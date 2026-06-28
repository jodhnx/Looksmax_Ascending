import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isPremium?: boolean;
      onboardingComplete?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    isPremium?: boolean;
    onboardingComplete?: boolean;
  }
}

declare module "next-auth" {
  interface User {
    id: string;
  }
}

// Session update payload (useSession().update())
export interface SessionUpdatePayload {
  onboardingComplete?: boolean;
  name?: string;
  image?: string;
}
