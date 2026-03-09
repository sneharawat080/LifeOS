import { motion } from "framer-motion";
import { Zap, CheckCircle2, Circle, Clock, Flame, Plus, CalendarDays, Trash2 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { useTasks, useCreateTask, useToggleTask, useDeleteTask, useHabits, useHabitLogs, useToggleHabitLog, useCreateHabit } from "@/hooks/useData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Productivity() {
  const { data: tasks } = useTasks();
  const { data: habits } = useHabits();
  const { data: habitLogs } = useHabitLogs(30);
  const createTask = useCreateTask();
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();
  const createHabit = useCreateHabit();
  const toggleHabitLog = useToggleHabitLog();
  const { toast } = useToast();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const todayHabitLogs = habitLogs?.filter(l => l.log_date === today) || [];

  const completedTasks = tasks?.filter(t => t.completed).length || 0;
  const totalTasks = tasks?.length || 0;

  // Calculate streaks
  const getStreak = (habitId: string) => {
    if (!habitLogs) return 0;
    const logs = habitLogs.filter(l => l.habit_id === habitId && l.completed).map(l => l.log_date).sort().reverse();
    let streak = 0;
    const d = new Date();
    for (let i = 0; i < 30; i++) {
      const dateStr = d.toISOString().split("T")[0];
      if (logs.includes(dateStr)) streak++;
      else if (i > 0) break;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      await createTask.mutateAsync({ title: newTaskTitle, priority: newTaskPriority });
      setNewTaskTitle("");
      setShowAddTask(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleAddHabit = async () => {
    if (!newHabitName.trim()) return;
    try {
      await createHabit.mutateAsync({ name: newHabitName });
      setNewHabitName("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const hasData = (tasks && tasks.length > 0) || (habits && habits.length > 0);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="page-header">Productivity</h1>
        <p className="page-subtitle mt-1">Tasks, habits, and daily planning</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tasks Done" value={`${completedTasks}/${totalTasks}`} change={totalTasks ? `${Math.round(completedTasks / totalTasks * 100)}% complete` : "No tasks"} changeType="positive" icon={CheckCircle2} gradient="gradient-purple" delay={0.1} />
        <StatCard label="Active Habits" value={`${habits?.length || 0}`} changeType="neutral" icon={Zap} gradient="gradient-emerald" delay={0.15} />
        <StatCard label="Today's Habits" value={`${todayHabitLogs.filter(l => l.completed).length}/${habits?.length || 0}`} changeType="positive" icon={Flame} gradient="gradient-amber" delay={0.2} />
        <StatCard label="Tasks Pending" value={`${totalTasks - completedTasks}`} changeType="neutral" icon={Clock} gradient="gradient-blue" delay={0.25} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tasks */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Tasks</h3>
            <button onClick={() => setShowAddTask(!showAddTask)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="h-3.5 w-3.5" /> Add Task
            </button>
          </div>

          {showAddTask && (
            <div className="flex gap-2 mb-4">
              <input
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAddTask()}
                placeholder="Task title..."
                className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                autoFocus
              />
              <select value={newTaskPriority} onChange={e => setNewTaskPriority(e.target.value)} className="rounded-lg border border-border bg-card px-2 py-2 text-xs text-foreground">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button onClick={handleAddTask} className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">Save</button>
            </div>
          )}

          {!tasks || tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No tasks yet. Add your first task!</p>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-auto">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 rounded-lg border border-border p-3 transition-all hover:bg-muted/30 ${task.completed ? "opacity-60" : ""}`}
                >
                  <button onClick={() => toggleTask.mutate({ id: task.id, completed: !task.completed })}>
                    {task.completed ? <CheckCircle2 className="h-5 w-5 text-primary shrink-0" /> : <Circle className="h-5 w-5 text-muted-foreground shrink-0" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</p>
                    {task.category && <p className="text-xs text-muted-foreground">{task.category}</p>}
                  </div>
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                    task.priority === "high" ? "bg-destructive/10 text-destructive" :
                    task.priority === "medium" ? "bg-chart-fitness/10 text-chart-fitness" :
                    "bg-muted text-muted-foreground"
                  }`}>{task.priority}</span>
                  <button onClick={() => deleteTask.mutate(task.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Habits */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Daily Habits</h3>
          {habits && habits.length > 0 ? (
            <div className="space-y-3">
              {habits.map(h => {
                const todayDone = todayHabitLogs.some(l => l.habit_id === h.id && l.completed);
                const streak = getStreak(h.id);
                return (
                  <button
                    key={h.id}
                    onClick={() => toggleHabitLog.mutate({ habitId: h.id, completed: !todayDone })}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${todayDone ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"}`}
                  >
                    <p className="text-sm font-medium text-foreground">{h.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">🔥 {streak} day streak</p>
                      {todayDone ? <span className="badge-earned text-[10px]">✓ Done</span> : <span className="text-[10px] text-muted-foreground">Tap to complete</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">No habits yet.</p>
          )}
          <div className="flex gap-2 mt-3">
            <input
              value={newHabitName}
              onChange={e => setNewHabitName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddHabit()}
              placeholder="New habit..."
              className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button onClick={handleAddHabit} className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">Add</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
