import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PlanScheduleEntry {
    day: bigint;
    isRestDay: boolean;
    distanceKm: number;
    activity: string;
}
export interface RunningPlan {
    level: PlanLevel;
    schedule: Array<PlanScheduleEntry>;
}
export interface RunLog {
    date: bigint;
    distanceKm: number;
    notes: string;
    caloriesBurned: bigint;
}
export interface Article {
    title: string;
    content: string;
    tags: Array<string>;
    category: Category;
}
export interface Goal {
    completedDays: bigint;
    name: string;
    targetDistanceKm: number;
    targetDays: bigint;
    startDate: bigint;
}
export enum Category {
    muscle = "muscle",
    fatLoss = "fatLoss",
    running = "running",
    nutrition = "nutrition"
}
export enum PlanLevel {
    intermediate = "intermediate",
    beginner = "beginner",
    advanced = "advanced"
}
export interface backendInterface {
    addGoal(name: string, targetDistanceKm: number, targetDays: bigint): Promise<void>;
    addRunLog(distanceKm: number, caloriesBurned: bigint, notes: string): Promise<void>;
    getArticles(): Promise<Array<Article>>;
    getArticlesByCategory(category: Category): Promise<Array<Article>>;
    getGoals(): Promise<Array<Goal>>;
    getRunLogs(): Promise<Array<RunLog>>;
    getRunningPlanByLevel(level: PlanLevel): Promise<RunningPlan | null>;
    getRunningPlans(): Promise<Array<RunningPlan>>;
    updateGoalProgress(goalIndex: bigint, daysCompleted: bigint): Promise<void>;
}
