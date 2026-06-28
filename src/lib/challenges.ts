// Challenge type constants (avoid importing Prisma client in shared modules)
export const CHALLENGE_TYPES = {
  GLOW_UP_30: "GLOW_UP_30",
  HARD_75_LITE: "HARD_75_LITE",
  PERFECT_SKIN: "PERFECT_SKIN",
  PERFECT_SLEEP: "PERFECT_SLEEP",
  HYDRATION: "HYDRATION",
  GYM_CONSISTENCY: "GYM_CONSISTENCY",
} as const;

export const CHALLENGE_DEFINITIONS = [
  {
    type: CHALLENGE_TYPES.GLOW_UP_30,
    title: "30 Day Glow Up",
    description:
      "Complete your full ascension routine every day for 30 days. Transform your face, body, and mindset.",
    duration: 30,
    tasks: [
      "Morning skincare routine",
      "Ice face treatment",
      "Posture exercises",
      "Gym or home workout",
      "8 hours sleep",
      "2L+ water",
      "No junk food",
    ],
  },
  {
    type: CHALLENGE_TYPES.HARD_75_LITE,
    title: "75 Hard Lite",
    description:
      "Two workouts daily, strict nutrition, gallon of water, progress photo, and reading — simplified for ascension.",
    duration: 75,
    tasks: [
      "Workout 1 (45 min)",
      "Workout 2 (45 min outdoor)",
      "Gallon of water",
      "Follow nutrition plan",
      "Progress photo",
      "10 min reading",
    ],
  },
  {
    type: CHALLENGE_TYPES.PERFECT_SKIN,
    title: "Perfect Skin",
    description: "21 days of dedicated skincare — cleanse, treat, moisturize, SPF every single day.",
    duration: 21,
    tasks: [
      "AM cleanse + SPF",
      "PM double cleanse",
      "Moisturize twice daily",
      "No face touching",
      "Change pillowcase weekly",
    ],
  },
  {
    type: CHALLENGE_TYPES.PERFECT_SLEEP,
    title: "Perfect Sleep",
    description: "14 nights of 8+ hours quality sleep with a consistent bedtime routine.",
    duration: 14,
    tasks: [
      "In bed by 10:30 PM",
      "No screens 30 min before bed",
      "8+ hours sleep",
      "Cool dark room",
      "Morning sunlight within 30 min of waking",
    ],
  },
  {
    type: CHALLENGE_TYPES.HYDRATION,
    title: "Hydration Challenge",
    description: "Hit your water target every day for 14 days. Glowing skin starts from within.",
    duration: 14,
    tasks: [
      "3L water daily",
      "Water before each meal",
      "No sugary drinks",
      "Electrolytes post-workout",
    ],
  },
  {
    type: CHALLENGE_TYPES.GYM_CONSISTENCY,
    title: "Gym Consistency",
    description: "Train at least 4 days per week for 4 weeks. Build the physique to match your face.",
    duration: 28,
    tasks: [
      "4+ workouts per week",
      "Hit protein target",
      "Track progressive overload",
      "Post-workout stretch",
    ],
  },
] as const;

export const DEFAULT_DAILY_TASKS = [
  { id: "water", label: "Drink 3L water", category: "nutrition", icon: "droplets" },
  { id: "workout", label: "Complete workout", category: "fitness", icon: "dumbbell" },
  { id: "skincare", label: "Skincare routine", category: "skincare", icon: "sparkles" },
  { id: "sleep", label: "Sleep 8 hours", category: "recovery", icon: "moon" },
  { id: "protein", label: "Hit protein target", category: "nutrition", icon: "beef" },
  { id: "junk", label: "No junk food", category: "nutrition", icon: "ban" },
  { id: "posture", label: "Posture check-ins", category: "posture", icon: "user" },
  { id: "mewing", label: "Mewing reminder", category: "face", icon: "smile" },
  { id: "walk", label: "10k steps", category: "fitness", icon: "footprints" },
  { id: "stretch", label: "Stretching session", category: "recovery", icon: "activity" },
];
