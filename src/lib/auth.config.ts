import type { NextAuthConfig } from "next-auth";

const publicPages = ["/", "/auth/signin", "/auth/signup"];

function isPublicPage(pathname: string): boolean {
  return publicPages.includes(pathname);
}

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [],
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const pathname = nextUrl.pathname;
      const isLoggedIn = !!auth?.user;

      if (!isLoggedIn) {
        return isPublicPage(pathname);
      }

      if (pathname === "/auth/signin" || pathname === "/auth/signup") {
        if (auth.user?.onboardingComplete) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return Response.redirect(new URL("/onboarding", nextUrl));
      }

      if (
        !auth.user?.onboardingComplete &&
        !pathname.startsWith("/onboarding")
      ) {
        return Response.redirect(new URL("/onboarding", nextUrl));
      }

      return true;
    },
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

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isPremium = Boolean(token.isPremium);
        session.user.onboardingComplete = Boolean(token.onboardingComplete);
        if (token.name) session.user.name = token.name as string;
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
