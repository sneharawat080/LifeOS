import { motion } from "framer-motion";
import { BarChart3, Download, TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { EmptyState } from "@/components/EmptyState";
import { useDailyHealthLogs, useTasks, useHabits, useHabitLogs, useDailyCareerLogs, useDailyProductivityLogs } from "@/hooks/useData";

export default function Analytics() {
  const { data: healthLogs } = useDailyHealthLogs(30);
  const { data: tasks } = useTasks();
  const { data: habits } = useHabits();
  const { data: habitLogs } = useHabitLogs(30);
  const { data: careerLogs } = useDailyCareerLogs(30);

  const hasData = (healthLogs && healthLogs.length > 0) || (tasks && tasks.length > 0);

  const stepsData = (healthLogs || []).map(l => ({
    date: new Date(l.log_date).toLocaleDateString("en", { month: "short", day: "numeric" }),
    steps: l.steps || 0,
  }));

  const completedTasks = tasks?.filter(t => t.completed).length || 0;
  const totalTasks = tasks?.length || 0;
  const habitConsistency = habits?.length && habitLogs?.length
    ? Math.round((habitLogs.filter(l => l.completed).length / (habits.length * 7)) * 100)
    : 0;

  const totalLearningHours = (careerLogs || []).reduce((sum, l) => sum + (l.learning_hours || 0), 0);

  const categoryBreakdown = [
    { name: "Health Logs", value: healthLogs?.length || 0, color: "hsl(160,84%,39%)" },
    { name: "Tasks", value: totalTasks, color: "hsl(217,91%,60%)" },
    { name: "Habit Logs", value: habitLogs?.length || 0, color: "hsl(270,70%,55%)" },
    { name: "Career Logs", value: careerLogs?.length || 0, color: "hsl(38,92%,50%)" },
  ].filter(c => c.value > 0);

  const handleExportCSV = () => {
    const rows = [["Date", "Steps", "Water", "Exercise Min", "Sleep Hours"]];
    (healthLogs || []).forEach(l => {
      rows.push([l.log_date, String(l.steps || 0), String(l.water_glasses || 0), String(l.exercise_minutes || 0), String(l.sleep_hours || "")]);
    });
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lifeos-health-report.csv";
    a.click();
  };

  const insights = [
    { label: "Tasks Completed", value: `${completedTasks}/${totalTasks}`, type: totalTasks > 0 && completedTasks / totalTasks > 0.7 ? "positive" : "neutral" as const, desc: totalTasks ? `${Math.round(completedTasks / totalTasks * 100)}% completion rate` : "No tasks yet" },
    { label: "Habit Consistency", value: `${habitConsistency}%`, type: habitConsistency > 70 ? "positive" : habitConsistency > 0 ? "neutral" : "negative" as const, desc: habits?.length ? `${habits.length} habits tracked` : "No habits yet" },
    { label: "Learning Hours", value: `${totalLearningHours}h`, type: totalLearningHours > 5 ? "positive" : "neutral" as const, desc: "This month" },
    { label: "Health Entries", value: `${healthLogs?.length || 0}`, type: (healthLogs?.length || 0) > 7 ? "positive" : "neutral" as const, desc: "Last 30 days" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start justify-between">
        <div>
          <h1 className="page-header">Analytics</h1>
          <p className="page-subtitle mt-1">Detailed reports and insights</p>
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </motion.div>

      {!hasData ? (
        <EmptyState message="Start logging daily data to generate analytics and reports." icon={BarChart3} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {insights.map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="glass-card p-4">
                <p className="stat-label">{item.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xl font-bold ${item.type === "positive" ? "text-primary" : item.type === "negative" ? "text-destructive" : "text-foreground"}`}>{item.value}</span>
                  {item.type === "positive" && <TrendingUp className="h-4 w-4 text-primary" />}
                  {item.type === "negative" && <TrendingDown className="h-4 w-4 text-destructive" />}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {stepsData.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Steps Trend</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={stepsData}>
                    <defs>
                      <linearGradient id="stepsGradA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(160,84%,39%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(160,84%,39%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" strokeOpacity={0.3} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(220,10%,46%)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(220,10%,46%)" />
                    <Tooltip contentStyle={{ background: "hsl(224,25%,11%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                    <Area type="monotone" dataKey="steps" stroke="hsl(160,84%,39%)" fill="url(#stepsGradA)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {categoryBreakdown.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Activity Distribution</h3>
                <div className="flex items-center gap-8">
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                        {categoryBreakdown.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-3">
                    {categoryBreakdown.map((c) => (
                      <div key={c.name} className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ background: c.color }} />
                        <div>
                          <p className="text-sm font-medium text-foreground">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.value} entries</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
