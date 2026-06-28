import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;
      const publicRoutes = ["/", "/auth/signin", "/auth/signup"];

      if (!isLoggedIn && !publicRoutes.includes(pathname)) {
        return false;
      }

      if (
        isLoggedIn &&
        !auth?.user?.onboardingComplete &&
        !pathname.startsWith("/onboarding") &&
        !pathname.startsWith("/api/onboarding") &&
        !pathname.startsWith("/api/auth")
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
        token.name = session.name;
        token.picture = session.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isPremium = token.isPremium as boolean;
        session.user.onboardingComplete = token.onboardingComplete as boolean;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
