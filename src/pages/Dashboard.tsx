import { motion } from "framer-motion";
import { Heart, Briefcase, Zap, Footprints, Flame, Brain, Target, BookOpen, CheckCircle2, TrendingUp, Plus } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { DailyCheckIn } from "@/components/DailyCheckIn";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useProfile } from "@/hooks/useProfile";
import { useDailyHealthLogs, useTodayHealthLog, useHabits, useHabitLogs, useTasks, useGoals } from "@/hooks/useData";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { data: profile } = useProfile();
  const { data: healthLogs } = useDailyHealthLogs(7);
  const { data: todayHealth } = useTodayHealthLog();
  const { data: habits } = useHabits();
  const { data: habitLogs } = useHabitLogs(7);
  const { data: tasks } = useTasks();
  const { data: goals } = useGoals();
  const [checkInOpen, setCheckInOpen] = useState(false);
  const navigate = useNavigate();

  const todayTasks = tasks?.filter(t => {
    const today = new Date().toISOString().split("T")[0];
    return !t.due_date || t.due_date === today;
  }) || [];
  const completedTasks = todayTasks.filter(t => t.completed).length;

  const todayHabitLogs = habitLogs?.filter(l => l.log_date === new Date().toISOString().split("T")[0] && l.completed) || [];

  const weeklyData = (healthLogs || []).map(log => ({
    day: new Date(log.log_date).toLocaleDateString("en", { weekday: "short" }),
    steps: log.steps || 0,
    water: log.water_glasses || 0,
    exercise: log.exercise_minutes || 0,
  }));

  const hasData = (healthLogs && healthLogs.length > 0) || (tasks && tasks.length > 0);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <h1 className="page-header">Good morning, {profile?.name || "there"} 👋</h1>
        <p className="page-subtitle mt-1">Here's your life performance overview</p>
      </motion.div>

      {/* Quick Action: Daily Check-In */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <button
          onClick={() => setCheckInOpen(true)}
          className="w-full glass-card p-4 flex items-center justify-between hover:scale-[1.01] transition-transform cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-emerald">
              <Plus className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">Daily Check-In</p>
              <p className="text-xs text-muted-foreground">Log your water, steps, mood, and more</p>
            </div>
          </div>
          <span className="badge-earned">
            {todayHealth ? "✓ Logged" : "Not yet"}
          </span>
        </button>
      </motion.div>

      {!hasData ? (
        <EmptyState message="Start logging your progress to see insights. Use the Daily Check-In above to get started!" />
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Steps Today" value={todayHealth?.steps?.toLocaleString() || "0"} change={todayHealth?.steps ? "Logged today" : "Not logged"} changeType={todayHealth?.steps ? "positive" : "neutral"} icon={Footprints} gradient="gradient-emerald" delay={0.15} />
            <StatCard label="Water Today" value={`${todayHealth?.water_glasses || 0}/8`} change="glasses" changeType={(todayHealth?.water_glasses || 0) >= 6 ? "positive" : "neutral"} icon={Flame} gradient="gradient-amber" delay={0.2} />
            <StatCard label="Tasks Done" value={`${completedTasks}/${todayTasks.length}`} change={todayTasks.length ? `${Math.round(completedTasks / todayTasks.length * 100)}% done` : "No tasks"} changeType="positive" icon={CheckCircle2} gradient="gradient-purple" delay={0.25} />
            <StatCard label="Habits Done" value={`${todayHabitLogs.length}/${habits?.length || 0}`} change="today" changeType={todayHabitLogs.length > 0 ? "positive" : "neutral"} icon={BookOpen} gradient="gradient-blue" delay={0.3} />
          </div>

          {/* Chart */}
          {weeklyData.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Activity</h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="stepsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" strokeOpacity={0.3} />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                  <Tooltip contentStyle={{ background: "hsl(224, 25%, 11%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                  <Area type="monotone" dataKey="steps" stroke="hsl(160, 84%, 39%)" fill="url(#stepsGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Habit Progress */}
          {habits && habits.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Habit Progress</h3>
              <div className="space-y-3">
                {habits.map(h => {
                  const completedDays = habitLogs?.filter(l => l.habit_id === h.id && l.completed).length || 0;
                  return (
                    <div key={h.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{h.name}</span>
                        <span className="font-medium text-foreground">{completedDays}/7 days</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-2 rounded-full gradient-emerald transition-all duration-500" style={{ width: `${(completedDays / 7) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Heart, label: "Log Health Data", desc: "Update vitals & activity", gradient: "gradient-emerald", path: "/health" },
          { icon: Target, label: "Set New Goal", desc: "Career or personal", gradient: "gradient-blue", path: "/career" },
          { icon: Brain, label: "Talk to AI Coach", desc: "Get personalized advice", gradient: "gradient-purple", path: "/ai-assistant" },
        ].map((action) => (
          <div key={action.label} onClick={() => navigate(action.path)} className="glass-card p-4 cursor-pointer hover:scale-[1.02] transition-transform">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.gradient} mb-3`}>
              <action.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground">{action.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
          </div>
        ))}
      </motion.div>

      <DailyCheckIn open={checkInOpen} onClose={() => setCheckInOpen(false)} />
    </div>
  );
}
