import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID!;

export const PREMIUM_FEATURES = {
  free: {
    analyses: 1,
    planDays: 7,
    aiChat: false,
    weeklyComparison: false,
    advancedStats: false,
    progressPhotos: false,
    customWorkouts: false,
    customSkincare: false,
  },
  premium: {
    analyses: Infinity,
    planDays: 30,
    aiChat: true,
    weeklyComparison: true,
    advancedStats: true,
    progressPhotos: true,
    customWorkouts: true,
    customSkincare: true,
  },
};
