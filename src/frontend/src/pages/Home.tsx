import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  ChevronRight,
  Flame,
  Play,
  Target,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { Category } from "../backend";
import {
  ARTICLE_IMAGES,
  CATEGORY_LABELS,
  PLAN_COLORS,
  SAMPLE_ARTICLES,
  SAMPLE_PLANS,
} from "../data/sampleData";
import { useArticles, useRunningPlans } from "../hooks/useQueries";

interface HomeProps {
  onNavigate: (tab: string) => void;
}

const DAILY_TIPS = [
  "Run 10 minutes daily to build consistency — small habits lead to big results.",
  "Focus on breathing rhythm: inhale 3 steps, exhale 2. It prevents side stitches.",
  "Land mid-foot, not heel. Proper form reduces injury risk by 30%.",
  "Hydrate before you're thirsty. Drink 400ml water 1 hour before running.",
  "Rest days are training days — muscles grow during recovery, not during the run.",
  "Run slow to run fast. 80% of your runs should be at easy conversational pace.",
  "Dynamic warm-up before, static stretch after. Never stretch cold muscles.",
];

const QUICK_STATS = [
  {
    id: "dist",
    value: "4.2 km",
    label: "Avg distance",
    color: "text-fitrun-teal",
  },
  {
    id: "streak",
    value: "3 days",
    label: "Weekly streak",
    color: "text-fitrun-cyan",
  },
  {
    id: "goals",
    value: "2 active",
    label: "Goals set",
    color: "text-fitrun-lime",
  },
];

const todayTip = DAILY_TIPS[new Date().getDay()];

export function Home({ onNavigate }: HomeProps) {
  const { data: articles } = useArticles();
  const { data: plans } = useRunningPlans();

  const displayArticles = (
    articles && articles.length > 0 ? articles : SAMPLE_ARTICLES
  ).slice(0, 4);
  const displayPlans = plans && plans.length > 0 ? plans : SAMPLE_PLANS;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-16">
      <section>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-semibold tracking-[0.2em] uppercase text-fitrun-teal mb-3"
        >
          Home Screen
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-5xl md:text-7xl font-extrabold uppercase tracking-tight text-foreground leading-[0.95] mb-8"
        >
          YOUR JOURNEY
          <br />
          <span className="gradient-cta-text">STARTS TODAY.</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-4"
        >
          <div className="bg-card border border-border rounded-2xl p-6 card-glow">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-fitrun-teal" />
              </div>
              <span className="text-sm font-semibold text-fitrun-teal uppercase tracking-wide">
                Today's Tip
              </span>
            </div>
            <p className="text-foreground text-base leading-relaxed">
              {todayTip}
            </p>
            <button
              type="button"
              onClick={() => onNavigate("explore")}
              className="mt-4 flex items-center gap-1 text-xs text-muted-foreground hover:text-fitrun-teal transition-colors"
              data-ocid="home.explore_link"
            >
              Read more articles <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("tracker")}
            data-ocid="home.primary_button"
            className="gradient-cta rounded-2xl p-6 text-left group transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center">
                <Play className="w-5 h-5 text-black fill-black" />
              </div>
              <span className="font-display text-3xl font-extrabold uppercase text-black tracking-tight">
                START RUNNING
              </span>
            </div>
            <p className="text-black/70 text-sm font-medium">
              Begin Activity — Log Your Run
            </p>
            <div className="mt-4 flex items-center gap-1 text-black/60 text-xs font-semibold">
              Open tracker <ChevronRight className="w-3 h-3" />
            </div>
          </button>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-4"
      >
        {QUICK_STATS.map((stat) => (
          <div
            key={stat.id}
            className="bg-card border border-border rounded-xl p-4 card-glow text-center"
          >
            <div className={`flex justify-center mb-2 ${stat.color}`}>
              {stat.id === "dist" && <Flame className="w-5 h-5" />}
              {stat.id === "streak" && <TrendingUp className="w-5 h-5" />}
              {stat.id === "goals" && <Target className="w-5 h-5" />}
            </div>
            <div className="text-xl font-bold text-foreground">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </motion.section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Explore Articles
          </h2>
          <button
            type="button"
            onClick={() => onNavigate("explore")}
            className="flex items-center gap-1 text-sm text-fitrun-teal hover:opacity-80 transition-opacity"
            data-ocid="home.explore_link"
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayArticles.map((article) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl overflow-hidden card-glow group hover:border-primary/40 transition-colors cursor-pointer"
              onClick={() => onNavigate("explore")}
            >
              <div className="h-32 overflow-hidden">
                <img
                  src={
                    ARTICLE_IMAGES[article.category as string] ??
                    ARTICLE_IMAGES[Category.running]
                  }
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <Badge className="mb-2 bg-primary/10 text-fitrun-teal border-0 text-xs">
                  {CATEGORY_LABELS[article.category as string]}
                </Badge>
                <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-1">
                  {article.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {article.content.slice(0, 80)}…
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">
            Featured Running Plans
          </h2>
          <button
            type="button"
            onClick={() => onNavigate("plans")}
            className="flex items-center gap-1 text-sm text-fitrun-teal hover:opacity-80 transition-opacity"
            data-ocid="home.plans_link"
          >
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {displayPlans.map((plan) => {
            const meta = PLAN_COLORS[plan.level as string];
            return (
              <motion.div
                key={plan.level as string}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-5 card-glow cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() => onNavigate("plans")}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge
                    className="border-0 text-xs font-semibold text-black"
                    style={{ background: meta?.color ?? "#26D3C5" }}
                  >
                    {meta?.label ?? plan.level}
                  </Badge>
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {meta?.label ?? plan.level} Plan
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {plan.schedule.length} day schedule
                </p>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${meta?.progress ?? 50}%`,
                      background: meta?.color ?? "#26D3C5",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-muted-foreground">
                    Progress
                  </span>
                  <span
                    className="text-[10px]"
                    style={{ color: meta?.color ?? "#26D3C5" }}
                  >
                    {meta?.progress ?? 50}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
