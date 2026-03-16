import { useState, useEffect } from "react";
import { Bell, X, CheckCircle2, Target, Trophy, Heart, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTodayHealthLog } from "@/hooks/useData";
import { useGoals } from "@/hooks/useData";
import { useUserAchievements } from "@/hooks/useData";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  type: "reminder" | "deadline" | "achievement";
  title: string;
  message: string;
  icon: any;
  time: string;
  read: boolean;
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { data: todayHealth } = useTodayHealthLog();
  const { data: goals } = useGoals();
  const { data: achievements } = useUserAchievements();

  useEffect(() => {
    if (!user) return;
    const notifs: Notification[] = [];
    const now = new Date();
    const hours = now.getHours();

    // Daily check-in reminder
    if (!todayHealth && hours >= 8) {
      notifs.push({
        id: "checkin-reminder",
        type: "reminder",
        title: "Daily Check-In",
        message: "You haven't logged today's health data yet. Track your water, steps, and mood!",
        icon: Heart,
        time: "Today",
        read: false,
      });
    }

    // Goal deadline alerts
    if (goals) {
      const upcoming = goals.filter(g => {
        if (!g.deadline || g.completed) return false;
        const deadline = new Date(g.deadline);
        const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 3 && daysLeft >= 0;
      });
      upcoming.forEach(g => {
        const daysLeft = Math.ceil((new Date(g.deadline!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        notifs.push({
          id: `goal-${g.id}`,
          type: "deadline",
          title: `Goal Deadline: ${g.title}`,
          message: daysLeft === 0 ? "Due today!" : `Due in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`,
          icon: Target,
          time: daysLeft === 0 ? "Today" : `${daysLeft}d left`,
          read: false,
        });
      });
    }

    // Achievement unlock notifications
    if (achievements && achievements.length > 0) {
      const recent = achievements
        .filter(a => {
          const earned = new Date(a.earned_at);
          const hoursSince = (now.getTime() - earned.getTime()) / (1000 * 60 * 60);
          return hoursSince < 24;
        })
        .slice(0, 3);

      recent.forEach(a => {
        notifs.push({
          id: `achievement-${a.id}`,
          type: "achievement",
          title: "Achievement Unlocked! 🏆",
          message: `You earned: ${a.achievement_key.replace(/_/g, " ")}`,
          icon: Trophy,
          time: "Recently",
          read: false,
        });
      });
    }

    // Morning motivation
    if (hours >= 6 && hours < 10) {
      notifs.push({
        id: "morning",
        type: "reminder",
        title: "Good Morning! ☀️",
        message: "Start your day strong. Complete your daily habits and log your morning check-in.",
        icon: Clock,
        time: "Morning",
        read: false,
      });
    }

    setNotifications(notifs);
  }, [user, todayHealth, goals, achievements]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const typeColors = {
    reminder: "text-blue-500 bg-blue-500/10",
    deadline: "text-amber-500 bg-amber-500/10",
    achievement: "text-emerald-500 bg-emerald-500/10",
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open) markAllRead(); }}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted transition-colors"
        title="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-border bg-card shadow-lg overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                {notifications.length > 0 && (
                  <button onClick={() => setNotifications([])} className="text-[10px] text-muted-foreground hover:text-foreground">
                    Clear all
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <CheckCircle2 className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">You're all caught up!</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-b-0 hover:bg-muted/30 transition-colors">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeColors[n.type]}`}>
                        <n.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{n.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</p>
                      </div>
                      <button onClick={() => dismissNotification(n.id)} className="shrink-0 text-muted-foreground/50 hover:text-foreground">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
