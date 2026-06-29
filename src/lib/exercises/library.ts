export type ExerciseCategory =
  | "posture"
  | "neck"
  | "upper-back"
  | "shoulders"
  | "stretching"
  | "facial"
  | "fitness"
  | "skin"
  | "lifestyle";

export type ExerciseDifficulty = "beginner" | "intermediate" | "advanced";

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  durationMinutes: number;
  instructions: string[];
  icon: string;
  reminder: string;
}

export const EXERCISE_LIBRARY: Exercise[] = [
  {
    id: "chin-tuck",
    name: "Chin Tuck",
    category: "neck",
    difficulty: "beginner",
    durationMinutes: 3,
    icon: "user",
    reminder: "Morning & evening",
    instructions: [
      "Sit or stand tall, gaze forward",
      "Gently draw chin straight back (make a double chin)",
      "Hold 5 seconds, release",
      "Repeat 10-15 reps",
    ],
  },
  {
    id: "wall-angel",
    name: "Wall Angels",
    category: "posture",
    difficulty: "beginner",
    durationMinutes: 5,
    icon: "move-vertical",
    reminder: "Daily AM",
    instructions: [
      "Stand with back flat against wall",
      "Arms at 90°, wrists and elbows touch wall",
      "Slide arms up overhead maintaining contact",
      "Return slowly, 10 reps",
    ],
  },
  {
    id: "neck-extension",
    name: "Neck Extension Stretch",
    category: "neck",
    difficulty: "beginner",
    durationMinutes: 4,
    icon: "arrow-up",
    reminder: "After desk work",
    instructions: [
      "Sit tall, clasp hands behind head",
      "Gently extend neck backward",
      "Hold 15-20 seconds",
      "Repeat 3 times",
    ],
  },
  {
    id: "upper-trap-stretch",
    name: "Upper Trap Stretch",
    category: "shoulders",
    difficulty: "beginner",
    durationMinutes: 3,
    icon: "stretch-horizontal",
    reminder: "Midday",
    instructions: [
      "Tilt head to one side",
      "Gently pull with opposite hand",
      "Hold 45 seconds each side",
    ],
  },
  {
    id: "cat-cow",
    name: "Cat-Cow Stretch",
    category: "stretching",
    difficulty: "beginner",
    durationMinutes: 4,
    icon: "waves",
    reminder: "Morning mobility",
    instructions: [
      "Hands and knees, neutral spine",
      "Arch back, look up (cow)",
      "Round spine, tuck chin (cat)",
      "Flow 10-15 reps",
    ],
  },
  {
    id: "face-massage",
    name: "Lymphatic Face Massage",
    category: "facial",
    difficulty: "beginner",
    durationMinutes: 5,
    icon: "sparkles",
    reminder: "Evening routine",
    instructions: [
      "Apply light oil or moisturizer",
      "Stroke from center outward",
      "Light pressure under cheekbones",
      "Finish with jawline sweep",
    ],
  },
  {
    id: "jaw-release",
    name: "Masseter Release",
    category: "facial",
    difficulty: "intermediate",
    durationMinutes: 3,
    icon: "circle",
    reminder: "Before bed",
    instructions: [
      "Locate masseter at jaw angle",
      "Apply gentle pressure in circles",
      "30 seconds each side",
      "Avoid if TMJ pain",
    ],
  },
  {
    id: "band-pull-apart",
    name: "Band Pull-Aparts",
    category: "upper-back",
    difficulty: "intermediate",
    durationMinutes: 5,
    icon: "dumbbell",
    reminder: "Post-workout",
    instructions: [
      "Hold band at chest height",
      "Pull apart squeezing shoulder blades",
      "15-20 controlled reps",
      "3 sets",
    ],
  },
  {
    id: "dead-hang",
    name: "Dead Hang",
    category: "shoulders",
    difficulty: "intermediate",
    durationMinutes: 3,
    icon: "hand",
    reminder: "Gym days",
    instructions: [
      "Grip pull-up bar",
      "Relax shoulders, decompress spine",
      "Hold 20-40 seconds",
      "3 sets",
    ],
  },
  {
    id: "morning-walk",
    name: "Morning Sunlight Walk",
    category: "lifestyle",
    difficulty: "beginner",
    durationMinutes: 15,
    icon: "sun",
    reminder: "Within 30 min of waking",
    instructions: [
      "Walk outdoors 10-15 minutes",
      "No sunglasses first 10 min",
      "Supports circadian rhythm and posture",
    ],
  },
  {
    id: "spf-routine",
    name: "SPF Application",
    category: "skin",
    difficulty: "beginner",
    durationMinutes: 2,
    icon: "sun",
    reminder: "Every morning",
    instructions: [
      "Apply 2 finger-lengths SPF 30+",
      "Cover face, neck, ears",
      "Reapply if outdoors 2+ hours",
    ],
  },
  {
    id: "bodyweight-circuit",
    name: "Bodyweight Circuit",
    category: "fitness",
    difficulty: "intermediate",
    durationMinutes: 25,
    icon: "flame",
    reminder: "4x per week",
    instructions: [
      "Push-ups, squats, rows, planks",
      "45s work / 15s rest",
      "3-4 rounds",
      "Focus on form",
    ],
  },
];

export const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  posture: "Posture",
  neck: "Neck Mobility",
  "upper-back": "Upper Back",
  shoulders: "Shoulders",
  stretching: "Stretching",
  facial: "Facial Relaxation",
  fitness: "General Fitness",
  skin: "Skin Habits",
  lifestyle: "Healthy Lifestyle",
};
