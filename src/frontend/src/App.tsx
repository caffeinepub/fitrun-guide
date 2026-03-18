import { Toaster } from "@/components/ui/sonner";
import {
  Activity,
  BarChart2,
  BookOpen,
  MapPin,
  Menu,
  Target,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { Explore } from "./pages/Explore";
import { Goals } from "./pages/Goals";
import { Home } from "./pages/Home";
import { Plans } from "./pages/Plans";
import { Tracker } from "./pages/Tracker";

const NAV_ITEMS = [
  { id: "home", label: "Dashboard", icon: <Activity className="w-4 h-4" /> },
  { id: "explore", label: "Explore", icon: <BookOpen className="w-4 h-4" /> },
  { id: "plans", label: "Plans", icon: <MapPin className="w-4 h-4" /> },
  { id: "tracker", label: "Tracker", icon: <BarChart2 className="w-4 h-4" /> },
  { id: "goals", label: "Goals", icon: <Target className="w-4 h-4" /> },
];

const FOOTER_LINKS = ["About", "Blog", "Support", "Privacy", "Community"];

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  function navigate(tab: string) {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center h-16 gap-6">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 gradient-cta rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-black" />
              </div>
              <span className="font-display font-bold text-foreground text-lg">
                FitRun Guide
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  data-ocid={`nav.${item.id}.link`}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? "text-black gradient-cta"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-3 ml-auto">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={clear}
                  data-ocid="nav.logout_button"
                  className="px-4 py-1.5 rounded-full text-sm font-medium text-fitrun-teal border border-fitrun-teal hover:bg-primary/10 transition-colors"
                >
                  Log Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={login}
                  disabled={isLoggingIn}
                  data-ocid="nav.login_button"
                  className="px-4 py-1.5 rounded-full text-sm font-medium text-fitrun-teal border border-fitrun-teal hover:bg-primary/10 transition-colors"
                >
                  {isLoggingIn ? "Connecting…" : "Log In"}
                </button>
              )}
              <button
                type="button"
                className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Toggle menu"
                data-ocid="nav.toggle"
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border overflow-hidden"
            >
              <nav className="px-4 py-3 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.id)}
                    data-ocid={`nav.mobile.${item.id}.link`}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      activeTab === item.id
                        ? "gradient-cta text-black"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex-1"
        >
          {activeTab === "home" && <Home onNavigate={navigate} />}
          {activeTab === "explore" && <Explore />}
          {activeTab === "plans" && <Plans />}
          {activeTab === "tracker" && <Tracker />}
          {activeTab === "goals" && <Goals />}
        </motion.div>
      </AnimatePresence>

      <footer className="border-t border-border mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              {FOOTER_LINKS.map((link) => (
                <span
                  key={link}
                  className="text-xs text-muted-foreground cursor-default"
                >
                  {link}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fitrun-teal hover:underline"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
