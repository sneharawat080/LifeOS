import { motion } from "framer-motion";
import { Zap, CheckCircle2, Circle, Clock, Flame, Plus, CalendarDays } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { useState } from "react";

const initialTasks = [
  { id: 1, title: "Review ML course chapter 5", done: true, priority: "high", category: "Learning" },
  { id: 2, title: "Complete workout routine", done: true, priority: "medium", category: "Health" },
  { id: 3, title: "Write blog post draft", done: false, priority: "high", category: "Career" },
  { id: 4, title: "Meditate for 15 minutes", done: true, priority: "low", category: "Wellness" },
  { id: 5, title: "Team standup meeting", done: false, priority: "medium", category: "Work" },
  { id: 6, title: "Read 30 pages", done: false, priority: "low", category: "Personal" },
];

const habits = [
  { name: "💧 Drink Water", streak: 12, todayDone: true },
  { name: "📚 Read", streak: 8, todayDone: true },
  { name: "🏋️ Exercise", streak: 5, todayDone: false },
  { name: "🧘 Meditate", streak: 3, todayDone: true },
  { name: "✍️ Journal", streak: 15, todayDone: false },
];

const schedule = [
  { time: "07:00", task: "Morning routine", type: "personal" },
  { time: "08:30", task: "Focus: ML coursework", type: "learning" },
  { time: "10:00", task: "Team standup", type: "work" },
  { time: "10:30", task: "Deep work block", type: "work" },
  { time: "12:30", task: "Lunch & walk", type: "health" },
  { time: "14:00", task: "Project work", type: "work" },
  { time: "16:00", task: "Exercise", type: "health" },
  { time: "18:00", task: "Reading time", type: "personal" },
];

export default function Productivity() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const completedCount = tasks.filter(t => t.done).length;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="page-header">Productivity</h1>
        <p className="page-subtitle mt-1">Tasks, habits, and daily planning</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tasks Done" value={`${completedCount}/${tasks.length}`} change={`${Math.round(completedCount / tasks.length * 100)}% complete`} changeType="positive" icon={CheckCircle2} gradient="gradient-purple" delay={0.1} />
        <StatCard label="Productivity Score" value="88%" change="+3% vs yesterday" changeType="positive" icon={Zap} gradient="gradient-emerald" delay={0.15} />
        <StatCard label="Best Streak" value="15 days" change="Journaling" changeType="neutral" icon={Flame} gradient="gradient-amber" delay={0.2} />
        <StatCard label="Focus Time" value="4.5h" change="Today's total" changeType="neutral" icon={Clock} gradient="gradient-blue" delay={0.25} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tasks */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Today's Tasks</h3>
            <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="h-3.5 w-3.5" /> Add Task
            </button>
          </div>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer transition-all hover:bg-muted/30 ${task.done ? "opacity-60" : ""}`}
              >
                {task.done ? (
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.category}</p>
                </div>
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                  task.priority === "high" ? "bg-destructive/10 text-destructive" :
                  task.priority === "medium" ? "bg-chart-fitness/10 text-chart-fitness" :
                  "bg-muted text-muted-foreground"
                }`}>{task.priority}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Daily Schedule */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Daily Planner</h3>
          </div>
          <div className="space-y-3">
            {schedule.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xs font-mono text-muted-foreground w-12 shrink-0 pt-0.5">{s.time}</span>
                <div className="flex-1 rounded-lg border border-border p-2 bg-muted/20">
                  <p className="text-xs font-medium text-foreground">{s.task}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Habits */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Habit Tracker</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {habits.map((h) => (
            <div key={h.name} className={`rounded-lg border p-3 text-center transition-all ${h.todayDone ? "border-primary bg-primary/5" : "border-border"}`}>
              <p className="text-sm font-medium text-foreground">{h.name}</p>
              <p className="text-xs text-muted-foreground mt-1">🔥 {h.streak} day streak</p>
              <div className="mt-2">
                {h.todayDone ? (
                  <span className="badge-earned text-[10px]">✓ Done</span>
                ) : (
                  <span className="text-[10px] text-muted-foreground">Pending</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
