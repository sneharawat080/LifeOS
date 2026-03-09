import { motion } from "framer-motion";
import { Heart, Droplets, Footprints, Moon, Activity, Apple, Brain, Plus } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { DailyCheckIn } from "@/components/DailyCheckIn";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import { useProfile, useHealthProfile } from "@/hooks/useProfile";
import { useDailyHealthLogs, useTodayHealthLog, useTodayMoodLog } from "@/hooks/useData";
import { useState } from "react";

export default function Health() {
  const { data: profile } = useProfile();
  const { data: healthProfile } = useHealthProfile();
  const { data: healthLogs } = useDailyHealthLogs(30);
  const { data: todayHealth } = useTodayHealthLog();
  const { data: todayMood } = useTodayMoodLog();
  const [checkInOpen, setCheckInOpen] = useState(false);

  const weightData = (healthLogs || [])
    .filter(l => l.weight_kg)
    .map(l => ({ date: new Date(l.log_date).toLocaleDateString("en", { month: "short", day: "numeric" }), weight: l.weight_kg }));

  const waterProgress = todayHealth?.water_glasses || 0;
  const waterGoal = healthProfile?.water_intake_goal || 8;
  const waterPercent = Math.min(100, (waterProgress / waterGoal) * 100);

  const hasData = healthLogs && healthLogs.length > 0;

  const moodLabel = todayMood?.mood
    ? { great: "😄 Great", good: "😊 Good", okay: "😐 Okay", bad: "😢 Bad", terrible: "😫 Terrible" }[todayMood.mood] || todayMood.mood
    : "Not logged";

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start justify-between">
        <div>
          <h1 className="page-header">Health & Wellness</h1>
          <p className="page-subtitle mt-1">Track your physical and mental health</p>
        </div>
        <button onClick={() => setCheckInOpen(true)} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Log Today
        </button>
      </motion.div>

      {!hasData ? (
        <EmptyState message="Start logging your health data daily to see trends and insights here." icon={Heart} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Weight" value={profile?.weight_kg ? `${profile.weight_kg} kg` : "—"} change={profile?.bmi ? `BMI: ${profile.bmi}` : ""} changeType="positive" icon={Activity} gradient="gradient-emerald" delay={0.1} />
            <StatCard label="Steps Today" value={todayHealth?.steps?.toLocaleString() || "0"} icon={Footprints} gradient="gradient-amber" delay={0.15} />
            <StatCard label="Sleep" value={todayHealth?.sleep_hours ? `${todayHealth.sleep_hours}h` : "—"} icon={Moon} gradient="gradient-purple" delay={0.2} />
            <StatCard label="Mood" value={moodLabel} icon={Brain} gradient="gradient-rose" delay={0.25} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {weightData.length > 1 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Weight Trend</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" strokeOpacity={0.3} />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
                    <Tooltip contentStyle={{ background: "hsl(224,25%,11%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                    <Line type="monotone" dataKey="weight" stroke="hsl(160,84%,39%)" strokeWidth={2.5} dot={{ fill: "hsl(160,84%,39%)", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Hydration</h3>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={140} height={140}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={[{ name: "Water", value: waterPercent, fill: "hsl(160, 84%, 39%)" }]} startAngle={90} endAngle={-270}>
                    <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "hsl(220,14%,92%)" }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div>
                  <p className="text-3xl font-bold text-foreground">{waterProgress}<span className="text-lg text-muted-foreground"> / {waterGoal}</span></p>
                  <p className="text-xs text-muted-foreground mt-1">glasses of water</p>
                  <div className="mt-3 flex gap-1.5">
                    {Array.from({ length: waterGoal }).map((_, i) => (
                      <div key={i} className={`h-6 w-3 rounded-full ${i < waterProgress ? "gradient-emerald" : "bg-muted"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mental Health */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-4 w-4 text-chart-mental" />
              <h3 className="text-sm font-semibold text-foreground">Mental Wellness</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "Stress Level", value: todayMood?.stress_level ? `${todayMood.stress_level}/10` : "—" },
                { label: "Mood", value: moodLabel },
                { label: "Energy Level", value: todayMood?.energy_level ? `${todayMood.energy_level}/10` : "—" },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-border p-3 bg-muted/30 text-center">
                  <p className="stat-label">{item.label}</p>
                  <p className="text-lg font-bold mt-1 text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}

      <DailyCheckIn open={checkInOpen} onClose={() => setCheckInOpen(false)} />
    </div>
  );
}
