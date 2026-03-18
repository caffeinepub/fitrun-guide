import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2, Plus, Target } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Goal } from "../backend";
import { SAMPLE_GOALS } from "../data/sampleData";
import {
  useAddGoal,
  useGoals,
  useUpdateGoalProgress,
} from "../hooks/useQueries";

function GoalCard({
  goal,
  index,
  onIncrement,
  isUpdating,
}: {
  goal: Goal;
  index: number;
  onIncrement: () => void;
  isUpdating: boolean;
}) {
  const progress =
    goal.targetDays > 0n
      ? Math.min(
          100,
          Math.round(
            (Number(goal.completedDays) / Number(goal.targetDays)) * 100,
          ),
        )
      : 0;
  const isCompleted = goal.completedDays >= goal.targetDays;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card border border-border rounded-2xl p-5 card-glow"
      data-ocid={`goals.item.${index + 1}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-fitrun-lime shrink-0" />
            ) : (
              <Target className="w-4 h-4 text-fitrun-teal shrink-0" />
            )}
            <h3 className="font-semibold text-foreground truncate">
              {goal.name}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Target: {goal.targetDistanceKm} km · {Number(goal.targetDays)} days
          </p>
          <Progress value={progress} className="h-2 bg-muted" />
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-muted-foreground">
              {Number(goal.completedDays)} / {Number(goal.targetDays)} days
            </span>
            <span
              className={`text-xs font-semibold ${isCompleted ? "text-fitrun-lime" : "text-fitrun-teal"}`}
            >
              {progress}%
            </span>
          </div>
        </div>
        <Button
          size="sm"
          type="button"
          onClick={onIncrement}
          disabled={isUpdating || isCompleted}
          className="shrink-0 bg-primary/10 text-fitrun-teal hover:bg-primary/20 border-0"
          data-ocid={`goals.edit_button.${index + 1}`}
        >
          {isUpdating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            "+1 Day"
          )}
        </Button>
      </div>
    </motion.div>
  );
}

export function Goals() {
  const [goalName, setGoalName] = useState("");
  const [targetDistance, setTargetDistance] = useState("");
  const [targetDays, setTargetDays] = useState("");
  const [updatingIndex, setUpdatingIndex] = useState<number | null>(null);

  const { data: goals } = useGoals();
  const addGoal = useAddGoal();
  const updateProgress = useUpdateGoalProgress();

  const displayGoals = goals && goals.length > 0 ? goals : SAMPLE_GOALS;

  async function handleAddGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!goalName.trim()) {
      toast.error("Enter a goal name");
      return;
    }
    const dist = Number.parseFloat(targetDistance);
    const days = Number.parseInt(targetDays);
    if (!dist || dist <= 0) {
      toast.error("Enter a valid target distance");
      return;
    }
    if (!days || days <= 0) {
      toast.error("Enter valid target days");
      return;
    }
    try {
      await addGoal.mutateAsync({
        name: goalName.trim(),
        targetDistanceKm: dist,
        targetDays: BigInt(days),
      });
      toast.success("Goal created! 🎯");
      setGoalName("");
      setTargetDistance("");
      setTargetDays("");
    } catch {
      toast.error("Failed to create goal.");
    }
  }

  async function handleIncrement(goal: Goal, index: number) {
    setUpdatingIndex(index);
    try {
      await updateProgress.mutateAsync({
        goalIndex: BigInt(index),
        daysCompleted: goal.completedDays + 1n,
      });
      toast.success("Progress updated! 💪");
    } catch {
      toast.error("Failed to update progress.");
    } finally {
      setUpdatingIndex(null);
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">
          Your Goals
        </h1>
        <p className="text-muted-foreground mb-8">
          Set targets, track progress, and stay motivated.
        </p>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {displayGoals.length === 0 ? (
              <div
                className="text-center py-20 text-muted-foreground"
                data-ocid="goals.empty_state"
              >
                No goals set yet.
              </div>
            ) : (
              displayGoals.map((goal, i) => (
                <GoalCard
                  key={goal.name}
                  goal={goal}
                  index={i}
                  onIncrement={() => handleIncrement(goal, i)}
                  isUpdating={updatingIndex === i}
                />
              ))
            )}
          </div>
          <div>
            <div className="bg-card border-2 border-dashed border-border rounded-2xl p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-fitrun-teal" />
                </div>
                <h2 className="font-display font-bold text-foreground">
                  Set a New Goal
                </h2>
              </div>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <Label
                    htmlFor="goalName"
                    className="text-sm text-muted-foreground mb-1.5 block"
                  >
                    Goal Name
                  </Label>
                  <Input
                    id="goalName"
                    placeholder="e.g. Run 5K in 30 days"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    data-ocid="goals.input"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="targetDist"
                    className="text-sm text-muted-foreground mb-1.5 block"
                  >
                    Target Distance (km)
                  </Label>
                  <Input
                    id="targetDist"
                    type="number"
                    step="0.5"
                    min="0.5"
                    placeholder="e.g. 5"
                    value={targetDistance}
                    onChange={(e) => setTargetDistance(e.target.value)}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    data-ocid="goals.input"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="targetDays"
                    className="text-sm text-muted-foreground mb-1.5 block"
                  >
                    Target Days
                  </Label>
                  <Input
                    id="targetDays"
                    type="number"
                    min="1"
                    placeholder="e.g. 30"
                    value={targetDays}
                    onChange={(e) => setTargetDays(e.target.value)}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    data-ocid="goals.input"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={addGoal.isPending}
                  className="w-full gradient-cta text-black font-semibold border-0 hover:opacity-90"
                  data-ocid="goals.submit_button"
                >
                  {addGoal.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating…
                    </>
                  ) : (
                    "Create Goal"
                  )}
                </Button>
              </form>
            </div>
            <div className="mt-4 bg-card border border-border rounded-2xl p-5 card-glow">
              <p className="text-xs text-muted-foreground italic leading-relaxed">
                “The miracle isn’t that I finished. The miracle is that I had
                the courage to start.” — John Bingham
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
