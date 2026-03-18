import {
  type Article,
  Category,
  type Goal,
  PlanLevel,
  type RunLog,
  type RunningPlan,
} from "../backend";

export const SAMPLE_ARTICLES: Article[] = [
  {
    title: "How to Start Running for Complete Beginners",
    content:
      "Starting to run can feel overwhelming, but with the right approach it becomes one of the most rewarding habits. Begin with run-walk intervals: run 1 minute, walk 2 minutes, for 20 minutes total. Over 4 weeks, progressively increase your running portions until you can sustain 20-30 minutes continuously. Focus on conversational pace — if you can't speak in short sentences, slow down. Invest in proper running shoes fitted at a specialty store. Your first goal should be consistency, not speed.",
    tags: ["beginner", "technique", "training"],
    category: Category.running,
  },
  {
    title: "Best Warm-Up Routine Before Your Run",
    content:
      "A proper warm-up reduces injury risk and improves performance. Spend 5-10 minutes on dynamic stretches: leg swings, hip circles, high knees, and butt kicks. Start your run at an easy pace for the first 5 minutes. Avoid static stretching cold muscles — save that for after your run. Core activation exercises like planks and bridges help stabilize your body during the run.",
    tags: ["warm-up", "injury prevention", "performance"],
    category: Category.running,
  },
  {
    title: "Weight Loss Through Running: A Scientific Approach",
    content:
      "Running is one of the highest calorie-burning cardio activities. A 70kg person burns approximately 600 calories per hour at a moderate pace. For fat loss, combine running 3-4 days per week with a slight caloric deficit. Zone 2 cardio (60-70% max heart rate) optimizes fat oxidation. Add one weekly tempo run for metabolic adaptation. Avoid compensatory eating by tracking your nutrition alongside your training log.",
    tags: ["fat loss", "cardio", "metabolism"],
    category: Category.fatLoss,
  },
  {
    title: "Strength Training for Runners",
    content:
      "Runners who skip strength training miss a huge performance and injury prevention opportunity. Focus on single-leg exercises: Bulgarian split squats, single-leg deadlifts, and step-ups. These mimic the unilateral demands of running and address imbalances. Add hip hinge exercises (deadlifts, hip thrusts) to build powerful glutes. Train legs 2x per week on easy run days, never before a hard running session.",
    tags: ["strength", "cross-training", "injury prevention"],
    category: Category.muscle,
  },
  {
    title: "Nutrition for Peak Running Performance",
    content:
      "Carbohydrates are your primary fuel for running. For runs under 60 minutes, pre-run fueling is optional if well-fed. For longer runs, consume 30-60g of carbs per hour after the first 45 minutes. Post-run recovery meals should combine protein (20-40g) with carbohydrates within 30 minutes to replenish glycogen and repair muscle tissue. Hydration is critical — drink 400-600ml of water in the 2 hours before running.",
    tags: ["nutrition", "fueling", "recovery"],
    category: Category.nutrition,
  },
  {
    title: "Breathing Techniques for Better Running",
    content:
      "Diaphragmatic breathing — belly breathing — is more efficient than chest breathing during runs. Use a rhythmic breathing pattern such as inhale for 3 steps, exhale for 2. This reduces side stitches by synchronizing diaphragm contractions with foot strikes. Breathe through both your mouth and nose during medium to high intensity running. Practice deep breathing drills during your warm-up walk.",
    tags: ["technique", "breathing", "efficiency"],
    category: Category.running,
  },
];

export const SAMPLE_PLANS: RunningPlan[] = [
  {
    level: PlanLevel.beginner,
    schedule: [
      {
        day: 1n,
        isRestDay: false,
        distanceKm: 2,
        activity: "Easy jog + walk intervals",
      },
      { day: 2n, isRestDay: true, distanceKm: 0, activity: "Rest & stretch" },
      {
        day: 3n,
        isRestDay: false,
        distanceKm: 2.5,
        activity: "Continuous easy run",
      },
      {
        day: 4n,
        isRestDay: true,
        distanceKm: 0,
        activity: "Light yoga or walking",
      },
      { day: 5n, isRestDay: false, distanceKm: 3, activity: "Easy long run" },
      { day: 6n, isRestDay: true, distanceKm: 0, activity: "Rest" },
      { day: 7n, isRestDay: true, distanceKm: 0, activity: "Rest" },
    ],
  },
  {
    level: PlanLevel.intermediate,
    schedule: [
      { day: 1n, isRestDay: false, distanceKm: 5, activity: "Tempo run" },
      {
        day: 2n,
        isRestDay: false,
        distanceKm: 4,
        activity: "Easy recovery run",
      },
      {
        day: 3n,
        isRestDay: true,
        distanceKm: 0,
        activity: "Strength training",
      },
      {
        day: 4n,
        isRestDay: false,
        distanceKm: 6,
        activity: "Interval training",
      },
      { day: 5n, isRestDay: true, distanceKm: 0, activity: "Rest" },
      { day: 6n, isRestDay: false, distanceKm: 8, activity: "Long slow run" },
      { day: 7n, isRestDay: true, distanceKm: 0, activity: "Rest & stretch" },
    ],
  },
  {
    level: PlanLevel.advanced,
    schedule: [
      { day: 1n, isRestDay: false, distanceKm: 10, activity: "Threshold run" },
      {
        day: 2n,
        isRestDay: false,
        distanceKm: 7,
        activity: "Easy aerobic run",
      },
      { day: 3n, isRestDay: false, distanceKm: 8, activity: "Hill repeats" },
      { day: 4n, isRestDay: false, distanceKm: 6, activity: "Recovery run" },
      {
        day: 5n,
        isRestDay: false,
        distanceKm: 10,
        activity: "Tempo intervals",
      },
      { day: 6n, isRestDay: true, distanceKm: 0, activity: "Rest & massage" },
      { day: 7n, isRestDay: false, distanceKm: 20, activity: "Long run" },
    ],
  },
];

export const SAMPLE_GOALS: Goal[] = [
  {
    name: "Complete 5K in 30 Days",
    targetDistanceKm: 5,
    targetDays: 30n,
    completedDays: 12n,
    startDate: BigInt(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    name: "Lose 5kg with Running",
    targetDistanceKm: 3,
    targetDays: 60n,
    completedDays: 22n,
    startDate: BigInt(Date.now() - 22 * 24 * 60 * 60 * 1000),
  },
];

export const SAMPLE_RUN_LOGS: RunLog[] = [
  {
    date: BigInt(Date.now() - 6 * 86400000),
    distanceKm: 3.2,
    caloriesBurned: 280n,
    notes: "Morning run, felt great",
  },
  {
    date: BigInt(Date.now() - 5 * 86400000),
    distanceKm: 5.0,
    caloriesBurned: 420n,
    notes: "Tempo run in the park",
  },
  {
    date: BigInt(Date.now() - 3 * 86400000),
    distanceKm: 2.8,
    caloriesBurned: 240n,
    notes: "Easy recovery jog",
  },
  {
    date: BigInt(Date.now() - 2 * 86400000),
    distanceKm: 6.5,
    caloriesBurned: 550n,
    notes: "Long run Sunday",
  },
  {
    date: BigInt(Date.now() - 86400000),
    distanceKm: 4.0,
    caloriesBurned: 340n,
    notes: "Interval training",
  },
  {
    date: BigInt(Date.now()),
    distanceKm: 3.5,
    caloriesBurned: 300n,
    notes: "Morning run",
  },
];

export const ARTICLE_IMAGES: Record<string, string> = {
  [Category.running]:
    "/assets/generated/article-running-technique.dim_400x240.jpg",
  [Category.fatLoss]: "/assets/generated/article-weight-loss.dim_400x240.jpg",
  [Category.muscle]: "/assets/generated/article-muscle.dim_400x240.jpg",
  [Category.nutrition]: "/assets/generated/article-nutrition.dim_400x240.jpg",
};

export const CATEGORY_LABELS: Record<string, string> = {
  [Category.running]: "Running",
  [Category.fatLoss]: "Fat Loss",
  [Category.muscle]: "Muscle",
  [Category.nutrition]: "Nutrition",
};

export const PLAN_COLORS: Record<
  string,
  { label: string; color: string; progress: number }
> = {
  [PlanLevel.beginner]: { label: "Beginner", color: "#26D3C5", progress: 35 },
  [PlanLevel.intermediate]: {
    label: "Intermediate",
    color: "#1FC7FF",
    progress: 60,
  },
  [PlanLevel.advanced]: { label: "Advanced", color: "#7CFF7A", progress: 85 },
};
