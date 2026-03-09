import { motion } from "framer-motion";
import { Trophy, Star, Flame, Droplets, Footprints, BookOpen, Zap, Target, Award } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Badge {
  name: string;
  desc: string;
  icon: LucideIcon;
  earned: boolean;
  xp: number;
  gradient: string;
  category: string;
}

const badges: Badge[] = [
  { name: "Hydration Hero", desc: "Drink 8 glasses for 7 days", icon: Droplets, earned: true, xp: 200, gradient: "gradient-emerald", category: "Health" },
  { name: "Step Master", desc: "Walk 10,000 steps in a day", icon: Footprints, earned: true, xp: 150, gradient: "gradient-emerald", category: "Health" },
  { name: "Fitness Starter", desc: "Complete 10 workouts", icon: Flame, earned: true, xp: 300, gradient: "gradient-amber", category: "Health" },
  { name: "7 Day Streak", desc: "Complete all habits for 7 days", icon: Star, earned: true, xp: 500, gradient: "gradient-purple", category: "Consistency" },
  { name: "30 Day Discipline", desc: "Maintain habits for 30 days", icon: Award, earned: false, xp: 1000, gradient: "gradient-purple", category: "Consistency" },
  { name: "Task Crusher", desc: "Complete 100 tasks", icon: Zap, earned: true, xp: 400, gradient: "gradient-blue", category: "Productivity" },
  { name: "Productivity Pro", desc: "Score 90%+ productivity 5 days", icon: Trophy, earned: false, xp: 600, gradient: "gradient-blue", category: "Productivity" },
  { name: "Skill Builder", desc: "Learn 5 new skills", icon: BookOpen, earned: true, xp: 350, gradient: "gradient-rose", category: "Career" },
  { name: "Career Climber", desc: "Complete a career roadmap stage", icon: Target, earned: true, xp: 500, gradient: "gradient-rose", category: "Career" },
];

const categories = ["All", "Health", "Consistency", "Productivity", "Career"];

export default function Achievements() {
  const totalXP = badges.filter(b => b.earned).reduce((sum, b) => sum + b.xp, 0);
  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="page-header">Achievements</h1>
        <p className="page-subtitle mt-1">Track your milestones and earn rewards</p>
      </motion.div>

      {/* XP Overview */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="stat-label">Total XP Earned</p>
            <p className="text-4xl font-bold text-foreground mt-1">{totalXP.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="stat-label">Level</p>
            <p className="text-4xl font-bold text-primary mt-1">12</p>
          </div>
        </div>
        <div className="xp-bar h-3">
          <div className="xp-fill h-3" style={{ width: "68%" }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>2,450 XP</span>
          <span>3,600 XP to Level 13</span>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{earnedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Badges Earned</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{badges.length - earnedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Badges Locked</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-primary">15</p>
          <p className="text-xs text-muted-foreground mt-1">Best Streak</p>
        </motion.div>
      </div>

      {/* Badges Grid */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="text-sm font-semibold text-foreground mb-4">All Badges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.03 }}
              className={`glass-card p-4 ${!badge.earned ? "opacity-40" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${badge.gradient} shrink-0`}>
                  <badge.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{badge.name}</p>
                    {badge.earned && <span className="badge-earned text-[10px]">Earned</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{badge.desc}</p>
                  <p className="text-xs font-semibold text-primary mt-1">+{badge.xp} XP</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
