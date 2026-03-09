import { motion } from "framer-motion";
import { Briefcase, Target, BookOpen, TrendingUp, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const skillData = [
  { skill: "Python", level: 85 },
  { skill: "React", level: 78 },
  { skill: "ML", level: 62 },
  { skill: "SQL", level: 90 },
  { skill: "AWS", level: 55 },
];

const roadmap = [
  { stage: 1, title: "Learn Python", status: "completed", desc: "Core syntax, data structures" },
  { stage: 2, title: "Statistics & Math", status: "completed", desc: "Probability, linear algebra" },
  { stage: 3, title: "Machine Learning", status: "in-progress", desc: "Supervised & unsupervised learning" },
  { stage: 4, title: "Deep Learning", status: "upcoming", desc: "Neural networks, TensorFlow" },
  { stage: 5, title: "Build Portfolio", status: "upcoming", desc: "3-5 real-world projects" },
  { stage: 6, title: "Apply for Jobs", status: "upcoming", desc: "Resume, networking, interviews" },
];

export default function Career() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="page-header">Career Growth</h1>
        <p className="page-subtitle mt-1">Track your professional development</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Career Score" value="72%" change="+5% this month" changeType="positive" icon={Briefcase} gradient="gradient-blue" delay={0.1} />
        <StatCard label="Skills Learned" value="12" change="3 in progress" changeType="neutral" icon={BookOpen} gradient="gradient-purple" delay={0.15} />
        <StatCard label="Goals Active" value="4" change="1 near completion" changeType="positive" icon={Target} gradient="gradient-emerald" delay={0.2} />
        <StatCard label="Learning Hours" value="48h" change="This month" changeType="neutral" icon={TrendingUp} gradient="gradient-amber" delay={0.25} />
      </div>

      {/* Career Roadmap */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
        <div className="flex items-center gap-2 mb-1">
          <Target className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Career Roadmap: Data Scientist</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-5">AI-generated roadmap based on your goals</p>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-4">
            {roadmap.map((step, i) => (
              <motion.div
                key={step.stage}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className="relative flex items-start gap-4 pl-2"
              >
                <div className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                  step.status === "completed" ? "border-primary bg-primary" :
                  step.status === "in-progress" ? "border-primary bg-background" :
                  "border-border bg-background"
                }`}>
                  {step.status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <span className={`text-xs font-bold ${step.status === "in-progress" ? "text-primary" : "text-muted-foreground"}`}>{step.stage}</span>
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold ${step.status === "upcoming" ? "text-muted-foreground" : "text-foreground"}`}>{step.title}</p>
                    {step.status === "in-progress" && <span className="badge-earned text-[10px]">In Progress</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Skill Progress</h3>
          <div className="space-y-3">
            {skillData.map((s) => (
              <div key={s.skill}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-foreground">{s.skill}</span>
                  <span className="text-muted-foreground">{s.level}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full gradient-blue transition-all duration-700" style={{ width: `${s.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Learning Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { day: "Mon", hours: 2 },
              { day: "Tue", hours: 1.5 },
              { day: "Wed", hours: 3 },
              { day: "Thu", hours: 2.5 },
              { day: "Fri", hours: 1 },
              { day: "Sat", hours: 4 },
              { day: "Sun", hours: 2 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" strokeOpacity={0.3} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220,10%,46%)" />
              <Tooltip contentStyle={{ background: "hsl(224,25%,11%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
              <Bar dataKey="hours" fill="hsl(217,91%,60%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
