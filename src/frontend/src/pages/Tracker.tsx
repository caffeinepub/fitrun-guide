import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Flame, Loader2, PlusCircle, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import type { RunLog } from "../backend";
import { SAMPLE_RUN_LOGS } from "../data/sampleData";
import { useAddRunLog, useRunLogs } from "../hooks/useQueries";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getWeeklyChartData(logs: RunLog[]) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return DAY_NAMES.map((name, i) => {
    const dayStart = new Date(weekStart);
    dayStart.setDate(weekStart.getDate() + i);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);
    const dayLogs = logs.filter((log) => {
      const ts = Number(log.date);
      return ts >= dayStart.getTime() && ts <= dayEnd.getTime();
    });
    return {
      day: name,
      distance: Number.parseFloat(
        dayLogs.reduce((s, l) => s + l.distanceKm, 0).toFixed(1),
      ),
      calories: dayLogs.reduce((s, l) => s + Number(l.caloriesBurned), 0),
    };
  });
}

const tooltipStyle = {
  backgroundColor: "#1A1F22",
  border: "1px solid #2A3338",
  borderRadius: "8px",
  color: "#F3F5F7",
  fontSize: "12px",
};

export function Tracker() {
  const [distance, setDistance] = useState("");
  const [calories, setCalories] = useState("");
  const [notes, setNotes] = useState("");
  const { data: runLogs } = useRunLogs();
  const addRunLog = useAddRunLog();

  const displayLogs = runLogs && runLogs.length > 0 ? runLogs : SAMPLE_RUN_LOGS;
  const chartData = getWeeklyChartData(displayLogs);
  const weeklyDistance = chartData
    .reduce((s, d) => s + d.distance, 0)
    .toFixed(1);
  const weeklyCalories = chartData.reduce((s, d) => s + d.calories, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const dist = Number.parseFloat(distance);
    const cal = Number.parseInt(calories);
    if (!dist || dist <= 0) {
      toast.error("Enter a valid distance");
      return;
    }
    if (!cal || cal <= 0) {
      toast.error("Enter valid calories");
      return;
    }
    try {
      await addRunLog.mutateAsync({
        distanceKm: dist,
        caloriesBurned: BigInt(cal),
        notes,
      });
      toast.success("Run logged! 🏃");
      setDistance("");
      setCalories("");
      setNotes("");
    } catch {
      toast.error("Failed to log run.");
    }
  }

  const sortedLogs = [...displayLogs]
    .sort((a, b) => Number(b.date) - Number(a.date))
    .slice(0, 8);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">
          Progress Tracker
        </h1>
        <p className="text-muted-foreground mb-8">
          Log your runs and track your weekly performance.
        </p>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-card border border-border rounded-2xl p-6 card-glow">
              <h2 className="font-display text-lg font-bold text-foreground mb-5 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-fitrun-teal" /> Log a Run
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label
                    htmlFor="distance"
                    className="text-sm text-muted-foreground mb-1.5 block"
                  >
                    Distance (km)
                  </Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="e.g. 5.2"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    data-ocid="tracker.input"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="calories"
                    className="text-sm text-muted-foreground mb-1.5 block"
                  >
                    Calories Burned
                  </Label>
                  <Input
                    id="calories"
                    type="number"
                    min="1"
                    placeholder="e.g. 420"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                    data-ocid="tracker.input"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="notes"
                    className="text-sm text-muted-foreground mb-1.5 block"
                  >
                    Notes (optional)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="How did your run go?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
                    rows={3}
                    data-ocid="tracker.textarea"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={addRunLog.isPending}
                  className="w-full gradient-cta text-black font-semibold border-0 hover:opacity-90"
                  data-ocid="tracker.submit_button"
                >
                  {addRunLog.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging…
                    </>
                  ) : (
                    "Log Run"
                  )}
                </Button>
              </form>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 card-glow">
              <h2 className="font-semibold text-foreground mb-4">This Week</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-fitrun-teal">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Distance
                    </div>
                    <div className="font-semibold text-foreground">
                      {weeklyDistance} km
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-fitrun-lime">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Calories
                    </div>
                    <div className="font-semibold text-foreground">
                      {weeklyCalories.toLocaleString()} kcal
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-fitrun-cyan">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Total Logs
                    </div>
                    <div className="font-semibold text-foreground">
                      {displayLogs.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="bg-card border border-border rounded-2xl p-6 card-glow">
              <h2 className="font-semibold text-foreground mb-4">
                Weekly Distance (km)
              </h2>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={chartData}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3338" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#9AA3AA", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#9AA3AA", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ReTooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="distance"
                    fill="#7CFF7A"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 card-glow">
              <h2 className="font-semibold text-foreground mb-4">
                Calories Burned This Week
              </h2>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart
                  data={chartData}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3338" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#9AA3AA", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#9AA3AA", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ReTooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#26D3C5"
                    strokeWidth={2.5}
                    dot={{ fill: "#26D3C5", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 card-glow">
              <h2 className="font-semibold text-foreground mb-4">
                Run History
              </h2>
              {displayLogs.length === 0 ? (
                <div
                  className="text-center py-8 text-muted-foreground text-sm"
                  data-ocid="tracker.empty_state"
                >
                  No runs logged yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedLogs.map((log, i) => (
                    <div
                      key={`${Number(log.date)}-${log.distanceKm}`}
                      className="flex items-center gap-4 p-3 rounded-xl bg-secondary/40 text-sm"
                      data-ocid={`tracker.item.${i + 1}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] text-fitrun-teal font-bold">
                          {new Date(Number(log.date)).toLocaleDateString("en", {
                            month: "short",
                          })}
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {new Date(Number(log.date)).getDate()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-foreground">
                          {log.distanceKm.toFixed(1)} km
                        </div>
                        {log.notes && (
                          <div className="text-xs text-muted-foreground truncate">
                            {log.notes}
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-fitrun-lime shrink-0">
                        {Number(log.caloriesBurned)} kcal
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
