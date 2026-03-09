import { motion } from "framer-motion";
import { Heart, Droplets, Footprints, Flame, Brain, Apple, Moon, Activity } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";

const weightData = [
  { week: "W1", weight: 78.5 },
  { week: "W2", weight: 78.2 },
  { week: "W3", weight: 77.8 },
  { week: "W4", weight: 77.5 },
  { week: "W5", weight: 77.1 },
  { week: "W6", weight: 76.8 },
];

const waterProgress = [{ name: "Water", value: 75, fill: "hsl(160, 84%, 39%)" }];

const mealPlan = [
  { meal: "Breakfast", food: "Oatmeal with berries & nuts", cal: 380 },
  { meal: "Lunch", food: "Grilled chicken salad", cal: 520 },
  { meal: "Snack", food: "Greek yogurt & almonds", cal: 220 },
  { meal: "Dinner", food: "Salmon with quinoa & veggies", cal: 580 },
];

export default function Health() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="page-header">Health & Wellness</h1>
        <p className="page-subtitle mt-1">Track your physical and mental health</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Weight" value="76.8 kg" change="-1.7 kg this month" changeType="positive" icon={Activity} gradient="gradient-emerald" delay={0.1} />
        <StatCard label="BMI" value="23.4" change="Normal range" changeType="positive" icon={Heart} gradient="gradient-blue" delay={0.15} />
        <StatCard label="Steps Today" value="8,432" change="+1,200 vs yesterday" changeType="positive" icon={Footprints} gradient="gradient-amber" delay={0.2} />
        <StatCard label="Sleep" value="7.5h" change="Good quality" changeType="positive" icon={Moon} gradient="gradient-purple" delay={0.25} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weight Trend */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Weight Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" strokeOpacity={0.3} />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
              <YAxis domain={[75, 80]} tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
              <Tooltip contentStyle={{ background: "hsl(224,25%,11%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
              <Line type="monotone" dataKey="weight" stroke="hsl(160,84%,39%)" strokeWidth={2.5} dot={{ fill: "hsl(160,84%,39%)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Hydration */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Hydration</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={waterProgress} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "hsl(220,14%,92%)" }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div>
              <p className="text-3xl font-bold text-foreground">6<span className="text-lg text-muted-foreground"> / 8</span></p>
              <p className="text-xs text-muted-foreground mt-1">glasses of water</p>
              <div className="mt-3 flex gap-1.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={`h-6 w-3 rounded-full ${i < 6 ? "gradient-emerald" : "bg-muted"}`} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Diet Plan */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Apple className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Today's Meal Plan</h3>
          <span className="badge-earned ml-auto">AI Generated</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {mealPlan.map((m) => (
            <div key={m.meal} className="rounded-lg border border-border p-3 bg-muted/30">
              <p className="text-xs font-semibold text-primary uppercase">{m.meal}</p>
              <p className="text-sm font-medium text-foreground mt-1">{m.food}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.cal} cal</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span>Total: <strong className="text-foreground">1,700 cal</strong></span>
          <span>Protein: <strong className="text-foreground">120g</strong></span>
          <span>Carbs: <strong className="text-foreground">180g</strong></span>
          <span>Fats: <strong className="text-foreground">55g</strong></span>
        </div>
      </motion.div>

      {/* Mental Health */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-4 w-4 text-chart-mental" />
          <h3 className="text-sm font-semibold text-foreground">Mental Wellness</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Stress Level", value: "Low", color: "text-primary" },
            { label: "Mood", value: "😊 Happy", color: "text-foreground" },
            { label: "Meditation", value: "15 min today", color: "text-foreground" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border p-3 bg-muted/30 text-center">
              <p className="stat-label">{item.label}</p>
              <p className={`text-lg font-bold mt-1 ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
