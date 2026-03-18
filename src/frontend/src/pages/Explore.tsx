import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { type Article, Category } from "../backend";
import {
  ARTICLE_IMAGES,
  CATEGORY_LABELS,
  SAMPLE_ARTICLES,
} from "../data/sampleData";
import { useArticlesByCategory } from "../hooks/useQueries";

const CATEGORIES = [
  { label: "All", value: null },
  { label: "Running", value: Category.running },
  { label: "Fat Loss", value: Category.fatLoss },
  { label: "Muscle", value: Category.muscle },
  { label: "Nutrition", value: Category.nutrition },
];

export function Explore() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const { data: articles, isLoading } = useArticlesByCategory(activeCategory);

  const displayArticles =
    articles && articles.length > 0
      ? articles
      : activeCategory === null
        ? SAMPLE_ARTICLES
        : SAMPLE_ARTICLES.filter((a) => a.category === activeCategory);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">
          Explore Articles
        </h1>
        <p className="text-muted-foreground mb-8">
          Science-backed fitness & running guides for all levels.
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => setActiveCategory(cat.value)}
              data-ocid="explore.tab"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.value
                  ? "gradient-cta text-black"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {isLoading ? (
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="explore.loading_state"
          >
            {["a", "b", "c", "d", "e", "f"].map((k) => (
              <div
                key={k}
                className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-muted" />
                <div className="p-5 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-5 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            layout
          >
            <AnimatePresence mode="popLayout">
              {displayArticles.map((article, i) => (
                <motion.article
                  key={article.title}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden card-glow group cursor-pointer hover:border-primary/40 transition-colors"
                  onClick={() => setSelectedArticle(article)}
                  data-ocid={`explore.item.${i + 1}`}
                >
                  <div className="h-44 overflow-hidden">
                    <img
                      src={
                        ARTICLE_IMAGES[article.category as string] ??
                        ARTICLE_IMAGES[Category.running]
                      }
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <Badge className="bg-primary/10 text-fitrun-teal border-0 text-xs mb-3">
                      {CATEGORY_LABELS[article.category as string]}
                    </Badge>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-fitrun-teal transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                      {article.content.slice(0, 120)}…
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground"
                        >
                          <Tag className="w-2.5 h-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
        {!isLoading && displayArticles.length === 0 && (
          <div
            className="text-center py-20 text-muted-foreground"
            data-ocid="explore.empty_state"
          >
            No articles found.
          </div>
        )}
      </motion.div>

      <Dialog
        open={!!selectedArticle}
        onOpenChange={() => setSelectedArticle(null)}
      >
        <DialogContent
          className="max-w-2xl bg-card border-border text-foreground"
          data-ocid="explore.dialog"
        >
          {selectedArticle && (
            <>
              <div className="h-56 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-2xl">
                <img
                  src={
                    ARTICLE_IMAGES[selectedArticle.category as string] ??
                    ARTICLE_IMAGES[Category.running]
                  }
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <DialogHeader>
                <Badge className="bg-primary/10 text-fitrun-teal border-0 text-xs w-fit mb-2">
                  {CATEGORY_LABELS[selectedArticle.category as string]}
                </Badge>
                <DialogTitle className="text-xl font-bold text-foreground">
                  {selectedArticle.title}
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                {selectedArticle.content}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {selectedArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-secondary px-2.5 py-1 rounded-full text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-secondary hover:bg-muted transition-colors"
                data-ocid="explore.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
