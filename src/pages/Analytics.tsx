import { motion } from "framer-motion";
import { BarChart3, Download, TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const monthlyHealth = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  weight: 82 - i * 0.5 + Math.random() * 1,
  steps: 6000 + Math.floor(Math.random() * 4000),
  sleep: 6.5 + Math.random() * 1.5,
}));

const taskCompletion = Array.from({ length: 7 }, (_, i) => ({
  day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i],
  completed: Math.floor(8 + Math.random() * 8),
  total: 15,
}));

const categoryBreakdown = [
  { name: "Health", value: 35, color: "hsl(160,84%,39%)" },
  { name: "Career", value: 28, color: "hsl(217,91%,60%)" },
  { name: "Productivity", value: 25, color: "hsl(270,70%,55%)" },
  { name: "Personal", value: 12, color: "hsl(38,92%,50%)" },
];

const insights = [
  { label: "Health Score Trend", value: "+12%", type: "positive" as const, desc: "Consistent improvement over 3 months" },
  { label: "Habit Consistency", value: "87%", type: "positive" as const, desc: "Above your 80% target" },
  { label: "Career Progress", value: "Stage 3/6", type: "neutral" as const, desc: "Machine Learning phase" },
  { label: "Sleep Quality", value: "-5%", type: "negative" as const, desc: "Slight decline this week" },
];

export default function Analytics() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start justify-between">
        <div>
          <h1 className="page-header">Analytics</h1>
          <p className="page-subtitle mt-1">Detailed reports and insights</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <Download className="h-4 w-4" /> Export
        </button>
      </motion.div>

      {/* Insights */}
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
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Monthly Health Trends</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyHealth}>
              <defs>
                <linearGradient id="stepsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(160,84%,39%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(160,84%,39%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" strokeOpacity={0.3} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(220,10%,46%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(220,10%,46%)" />
              <Tooltip contentStyle={{ background: "hsl(224,25%,11%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
              <Area type="monotone" dataKey="steps" stroke="hsl(160,84%,39%)" fill="url(#stepsGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Task Completion Rate</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={taskCompletion}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" strokeOpacity={0.3} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(220,10%,46%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(220,10%,46%)" />
              <Tooltip contentStyle={{ background: "hsl(224,25%,11%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
              <Bar dataKey="completed" fill="hsl(270,70%,55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Category Distribution */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Time Distribution by Category</h3>
        <div className="flex items-center gap-8">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {categoryBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 grid grid-cols-2 gap-3">
            {categoryBreakdown.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ background: c.color }} />
                <div>
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
