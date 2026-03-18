import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Coffee, Footprints } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { PlanLevel, type RunningPlan } from "../backend";
import { PLAN_COLORS, SAMPLE_PLANS } from "../data/sampleData";
import { useRunningPlans } from "../hooks/useQueries";

function PlanCard({ plan, index }: { plan: RunningPlan; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const meta = PLAN_COLORS[plan.level as string];
  const previewSchedule = plan.schedule.slice(0, 3);
  const totalDistance = plan.schedule.reduce((s, e) => s + e.distanceKm, 0);
  const restDays = plan.schedule.filter((e) => e.isRestDay).length;
  const runDays = plan.schedule.length - restDays;

  const stats = [
    { label: "Run Days", value: runDays },
    { label: "Rest Days", value: restDays },
    { label: "Days Total", value: plan.schedule.length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card border border-border rounded-2xl overflow-hidden card-glow"
      data-ocid={`plans.item.${index + 1}`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge
              className="border-0 text-xs font-semibold text-black mb-2"
              style={{ background: meta?.color ?? "#26D3C5" }}
            >
              {meta?.label ?? plan.level}
            </Badge>
            <h2 className="font-display text-xl font-bold text-foreground">
              {meta?.label ?? plan.level} Running Plan
            </h2>
          </div>
          <div className="text-right">
            <div
              className="text-2xl font-bold"
              style={{ color: meta?.color ?? "#26D3C5" }}
            >
              {totalDistance.toFixed(1)} km
            </div>
            <div className="text-xs text-muted-foreground">total / week</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-secondary/50 rounded-xl p-3 text-center"
            >
              <div className="text-lg font-bold text-foreground">{s.value}</div>
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Plan Progress</span>
            <span style={{ color: meta?.color ?? "#26D3C5" }}>
              {meta?.progress ?? 50}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${meta?.progress ?? 50}%`,
                background: meta?.color ?? "#26D3C5",
              }}
            />
          </div>
        </div>
        <div className="space-y-2 mb-4">
          {previewSchedule.map((entry) => (
            <div
              key={Number(entry.day)}
              className="flex items-center gap-3 text-sm"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={
                  entry.isRestDay
                    ? { background: "rgba(255,255,255,0.05)", color: "#666" }
                    : {
                        background: `${meta?.color ?? "#26D3C5"}20`,
                        color: meta?.color ?? "#26D3C5",
                      }
                }
              >
                {Number(entry.day)}
              </div>
              <span
                className={`flex-1 ${entry.isRestDay ? "text-muted-foreground" : "text-foreground"}`}
              >
                {entry.activity}
              </span>
              {entry.isRestDay ? (
                <Coffee className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <span className="text-xs text-muted-foreground">
                  {entry.distanceKm} km
                </span>
              )}
            </div>
          ))}
          {!expanded && plan.schedule.length > 3 && (
            <div className="text-xs text-muted-foreground pl-10">
              +{plan.schedule.length - 3} more days…
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-xl border border-border hover:border-primary/40 hover:text-fitrun-teal transition-colors"
          data-ocid={`plans.toggle.${index + 1}`}
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" /> Hide full schedule
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" /> View full schedule
            </>
          )}
        </button>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border p-6 pt-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                Full Schedule
              </h3>
              <div className="space-y-2">
                {plan.schedule.map((entry) => (
                  <div
                    key={Number(entry.day)}
                    className={`flex items-center gap-3 p-3 rounded-xl text-sm ${entry.isRestDay ? "bg-secondary/30" : "bg-secondary/50"}`}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={
                        entry.isRestDay
                          ? {
                              background: "rgba(255,255,255,0.05)",
                              color: "#666",
                            }
                          : {
                              background: `${meta?.color ?? "#26D3C5"}25`,
                              color: meta?.color ?? "#26D3C5",
                            }
                      }
                    >
                      {Number(entry.day)}
                    </div>
                    <span
                      className={`flex-1 ${entry.isRestDay ? "text-muted-foreground" : "text-foreground"}`}
                    >
                      {entry.activity}
                    </span>
                    {entry.isRestDay ? (
                      <Coffee className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    ) : (
                      <span
                        className="text-xs font-semibold shrink-0 flex items-center gap-1"
                        style={{ color: meta?.color ?? "#26D3C5" }}
                      >
                        <Footprints className="w-3.5 h-3.5" />
                        {entry.distanceKm} km
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function Plans() {
  const { data: plans, isLoading } = useRunningPlans();
  const displayPlans = plans && plans.length > 0 ? plans : SAMPLE_PLANS;
  const levelOrder: Record<string, number> = {
    [PlanLevel.beginner]: 0,
    [PlanLevel.intermediate]: 1,
    [PlanLevel.advanced]: 2,
  };
  const sortedPlans = [...displayPlans].sort(
    (a, b) =>
      (levelOrder[a.level as string] ?? 0) -
      (levelOrder[b.level as string] ?? 0),
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">
          Running Plans
        </h1>
        <p className="text-muted-foreground mb-8">
          Choose your level and follow a structured weekly schedule.
        </p>
        {isLoading ? (
          <div
            className="grid md:grid-cols-3 gap-6"
            data-ocid="plans.loading_state"
          >
            {["a", "b", "c"].map((k) => (
              <div
                key={k}
                className="bg-card border border-border rounded-2xl p-6 animate-pulse space-y-3"
              >
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-6 bg-muted rounded w-1/2" />
                <div className="h-2 bg-muted rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {sortedPlans.map((plan, i) => (
              <PlanCard key={plan.level as string} plan={plan} index={i} />
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
