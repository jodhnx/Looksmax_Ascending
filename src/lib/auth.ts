import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import { loginSchema } from "@/lib/validations/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { createUserDefaults } from "@/lib/user-setup";
import type { Provider } from "next-auth/providers";

const BCRYPT_ROUNDS = 12;
const LOGIN_RATE_LIMIT = 10;
const LOGIN_RATE_WINDOW_MS = 15 * 60 * 1000;

const providers: Provider[] = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success) {
        return null;
      }

      const { email, password } = parsed.data;

      if (!checkRateLimit(`login:${email}`, LOGIN_RATE_LIMIT, LOGIN_RATE_WINDOW_MS)) {
        console.warn(`[auth] Login rate limit exceeded for ${email}`);
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user?.password) {
        return null;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return null;
      }

      resetRateLimit(`login:${email}`);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.unshift(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers,
  events: {
    async createUser({ user }) {
      if (!user.id) return;

      const existingProfile = await prisma.profile.findUnique({
        where: { userId: user.id },
      });

      if (!existingProfile) {
        await createUserDefaults(prisma, user.id);
      }
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
      }

      if (trigger === "update" && session) {
        if (session.onboardingComplete !== undefined) {
          token.onboardingComplete = session.onboardingComplete as boolean;
        }
        if (session.name !== undefined) {
          token.name = session.name as string;
        }
        if (session.image !== undefined) {
          token.picture = session.image as string;
        }
      }

      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            isPremium: true,
            onboardingComplete: true,
            name: true,
            image: true,
          },
        });

        if (dbUser) {
          token.isPremium = dbUser.isPremium;
          if (trigger !== "update" || session?.onboardingComplete === undefined) {
            token.onboardingComplete = dbUser.onboardingComplete;
          }
          token.name = dbUser.name;
          token.picture = dbUser.image;
        }
      }

      return token;
    },
  },
});

export { BCRYPT_ROUNDS };
