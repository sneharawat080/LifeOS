import { motion } from "framer-motion";
import { Briefcase, Target, BookOpen, TrendingUp, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { useCareerProfile } from "@/hooks/useProfile";
import { useDailyCareerLogs, useGoals } from "@/hooks/useData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Career() {
  const { data: careerProfile } = useCareerProfile();
  const { data: careerLogs } = useDailyCareerLogs(7);
  const { data: goals } = useGoals();

  const careerGoals = goals?.filter(g => g.category === "career") || [];
  const totalLearningHours = (careerLogs || []).reduce((sum, l) => sum + (l.learning_hours || 0), 0);
  const skills = careerProfile?.skills || [];

  const weeklyLearning = (careerLogs || []).map(l => ({
    day: new Date(l.log_date).toLocaleDateString("en", { weekday: "short" }),
    hours: l.learning_hours || 0,
  }));

  const hasData = careerProfile || (careerLogs && careerLogs.length > 0);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="page-header">Career Growth</h1>
        <p className="page-subtitle mt-1">Track your professional development</p>
      </motion.div>

      {!hasData ? (
        <EmptyState message="Complete your career profile in onboarding and log learning hours to see career insights." icon={Briefcase} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Profession" value={careerProfile?.profession || "—"} icon={Briefcase} gradient="gradient-blue" delay={0.1} />
            <StatCard label="Skills" value={`${skills.length}`} change={`${skills.length} tracked`} changeType="neutral" icon={BookOpen} gradient="gradient-purple" delay={0.15} />
            <StatCard label="Career Goals" value={`${careerGoals.length}`} changeType="neutral" icon={Target} gradient="gradient-emerald" delay={0.2} />
            <StatCard label="Learning Hours" value={`${totalLearningHours}h`} change="This week" changeType="neutral" icon={TrendingUp} gradient="gradient-amber" delay={0.25} />
          </div>

          {/* Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {skills.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map(s => (
                    <span key={s} className="badge-earned">{s}</span>
                  ))}
                </div>
              </motion.div>
            )}

            {weeklyLearning.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Learning Activity</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyLearning}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" strokeOpacity={0.3} />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
                    <Tooltip contentStyle={{ background: "hsl(224,25%,11%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                    <Bar dataKey="hours" fill="hsl(217,91%,60%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>

          {/* Career Goals */}
          {careerGoals.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Career Goals</h3>
              <div className="space-y-3">
                {careerGoals.map(g => (
                  <div key={g.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    {g.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    ) : (
                      <Target className="h-5 w-5 text-muted-foreground shrink-0" />
                    )}
                    <div>
                      <p className={`text-sm font-medium ${g.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{g.title}</p>
                      {g.description && <p className="text-xs text-muted-foreground">{g.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
