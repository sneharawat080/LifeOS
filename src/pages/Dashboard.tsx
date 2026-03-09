import { motion } from "framer-motion";
import { Heart, Briefcase, Zap, Footprints, Flame, Droplets, Brain, Target, BookOpen, CheckCircle2, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const weeklyData = [
  { day: "Mon", health: 78, career: 65, productivity: 82 },
  { day: "Tue", health: 82, career: 70, productivity: 75 },
  { day: "Wed", health: 85, career: 68, productivity: 88 },
  { day: "Thu", health: 80, career: 72, productivity: 90 },
  { day: "Fri", health: 88, career: 78, productivity: 85 },
  { day: "Sat", health: 92, career: 60, productivity: 70 },
  { day: "Sun", health: 90, career: 55, productivity: 65 },
];

const habitData = [
  { name: "Water", done: 6, total: 8 },
  { name: "Exercise", done: 5, total: 7 },
  { name: "Reading", done: 4, total: 7 },
  { name: "Meditation", done: 3, total: 7 },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <h1 className="page-header">Good morning, Alex 👋</h1>
        <p className="page-subtitle mt-1">Here's your life performance overview</p>
      </motion.div>

      {/* Life Score */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="stat-label">Life Score</p>
            <p className="text-4xl font-bold text-foreground mt-1">82<span className="text-lg text-muted-foreground">/100</span></p>
          </div>
          <div className="flex items-center gap-2 badge-earned">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+5 from last week</span>
          </div>
        </div>
        <div className="flex gap-2">
          {[
            { label: "Health", score: 85, color: "gradient-emerald" },
            { label: "Career", score: 72, color: "gradient-blue" },
            { label: "Productivity", score: 88, color: "gradient-purple" },
          ].map((item) => (
            <div key={item.label} className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-semibold text-foreground">{item.score}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div className={`h-2 rounded-full ${item.color} transition-all duration-700`} style={{ width: `${item.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Steps Today" value="8,432" change="+12% vs avg" changeType="positive" icon={Footprints} gradient="gradient-emerald" delay={0.15} />
        <StatCard label="Calories Burned" value="2,180" change="+8% vs avg" changeType="positive" icon={Flame} gradient="gradient-amber" delay={0.2} />
        <StatCard label="Tasks Completed" value="12/15" change="80% done" changeType="positive" icon={CheckCircle2} gradient="gradient-purple" delay={0.25} />
        <StatCard label="Learning Hours" value="2.5h" change="On track" changeType="neutral" icon={BookOpen} gradient="gradient-blue" delay={0.3} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Performance</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="careerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(270, 70%, 55%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(270, 70%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" strokeOpacity={0.3} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
              <Tooltip contentStyle={{ background: "hsl(224, 25%, 11%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
              <Area type="monotone" dataKey="health" stroke="hsl(160, 84%, 39%)" fill="url(#healthGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="career" stroke="hsl(217, 91%, 60%)" fill="url(#careerGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="productivity" stroke="hsl(270, 70%, 55%)" fill="url(#prodGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Habit Progress</h3>
          <div className="space-y-4">
            {habitData.map((h) => (
              <div key={h.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{h.name}</span>
                  <span className="font-medium text-foreground">{h.done}/{h.total}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full gradient-emerald transition-all duration-500" style={{ width: `${(h.done / h.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Heart, label: "Log Health Data", desc: "Update vitals & activity", gradient: "gradient-emerald" },
          { icon: Target, label: "Set New Goal", desc: "Career or personal", gradient: "gradient-blue" },
          { icon: Brain, label: "Talk to AI Coach", desc: "Get personalized advice", gradient: "gradient-purple" },
        ].map((action) => (
          <div key={action.label} className="glass-card p-4 cursor-pointer hover:scale-[1.02] transition-transform">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.gradient} mb-3`}>
              <action.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground">{action.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
