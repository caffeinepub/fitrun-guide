import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Article, Category, Goal, RunLog, RunningPlan } from "../backend";
import { useActor } from "./useActor";

export function useArticles() {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getArticles();
    },
    enabled: !!actor && !isFetching,
    placeholderData: [],
  });
}

export function useArticlesByCategory(category: Category | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["articles", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === null) return actor.getArticles();
      return actor.getArticlesByCategory(category);
    },
    enabled: !!actor && !isFetching,
    placeholderData: [],
  });
}

export function useRunningPlans() {
  const { actor, isFetching } = useActor();
  return useQuery<RunningPlan[]>({
    queryKey: ["runningPlans"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRunningPlans();
    },
    enabled: !!actor && !isFetching,
    placeholderData: [],
  });
}

export function useRunLogs() {
  const { actor, isFetching } = useActor();
  return useQuery<RunLog[]>({
    queryKey: ["runLogs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRunLogs();
    },
    enabled: !!actor && !isFetching,
    placeholderData: [],
  });
}

export function useGoals() {
  const { actor, isFetching } = useActor();
  return useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGoals();
    },
    enabled: !!actor && !isFetching,
    placeholderData: [],
  });
}

export function useAddRunLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      distanceKm,
      caloriesBurned,
      notes,
    }: { distanceKm: number; caloriesBurned: bigint; notes: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addRunLog(distanceKm, caloriesBurned, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["runLogs"] });
    },
  });
}

export function useAddGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      targetDistanceKm,
      targetDays,
    }: { name: string; targetDistanceKm: number; targetDays: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addGoal(name, targetDistanceKm, targetDays);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}

export function useUpdateGoalProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      goalIndex,
      daysCompleted,
    }: { goalIndex: bigint; daysCompleted: bigint }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateGoalProgress(goalIndex, daysCompleted);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
  });
}
