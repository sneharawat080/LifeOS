import { motion } from "framer-motion";
import { Trophy, Star, Flame, Droplets, Footprints, BookOpen, Zap, Target, Award } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { useUserXP, useUserAchievements, useTasks, useHabits, useHabitLogs, useDailyHealthLogs } from "@/hooks/useData";

interface BadgeDef {
  key: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  xp: number;
  gradient: string;
  category: string;
}

const badgeDefs: BadgeDef[] = [
  { key: "hydration_hero", name: "Hydration Hero", desc: "Log 8 glasses of water in a day", icon: Droplets, xp: 200, gradient: "gradient-emerald", category: "Health" },
  { key: "step_master", name: "Step Master", desc: "Walk 10,000 steps in a day", icon: Footprints, xp: 150, gradient: "gradient-emerald", category: "Health" },
  { key: "fitness_starter", name: "Fitness Starter", desc: "Log 10 exercise sessions", icon: Flame, xp: 300, gradient: "gradient-amber", category: "Health" },
  { key: "7_day_streak", name: "7 Day Streak", desc: "Complete all habits for 7 days", icon: Star, xp: 500, gradient: "gradient-purple", category: "Consistency" },
  { key: "30_day_discipline", name: "30 Day Discipline", desc: "Maintain habits for 30 days", icon: Award, xp: 1000, gradient: "gradient-purple", category: "Consistency" },
  { key: "task_crusher", name: "Task Crusher", desc: "Complete 100 tasks", icon: Zap, xp: 400, gradient: "gradient-blue", category: "Productivity" },
  { key: "productivity_pro", name: "Productivity Pro", desc: "Complete 10 tasks in one day", icon: Trophy, xp: 600, gradient: "gradient-blue", category: "Productivity" },
  { key: "skill_builder", name: "Skill Builder", desc: "Track 5+ skills in your profile", icon: BookOpen, xp: 350, gradient: "gradient-rose", category: "Career" },
  { key: "consistency_champion", name: "Consistency Champion", desc: "Log data for 14 consecutive days", icon: Target, xp: 500, gradient: "gradient-rose", category: "Career" },
];

export default function Achievements() {
  const { data: userXP } = useUserXP();
  const { data: achievements } = useUserAchievements();
  const { data: tasks } = useTasks();
  const { data: healthLogs } = useDailyHealthLogs(30);

  const earnedKeys = new Set(achievements?.map(a => a.achievement_key) || []);

  // Check which can be earned based on real data
  const completedTasks = tasks?.filter(t => t.completed).length || 0;
  const has10kSteps = healthLogs?.some(l => (l.steps || 0) >= 10000) || false;
  const has8Water = healthLogs?.some(l => (l.water_glasses || 0) >= 8) || false;
  const exerciseSessions = healthLogs?.filter(l => (l.exercise_minutes || 0) > 0).length || 0;

  const canEarn: Record<string, boolean> = {
    hydration_hero: has8Water,
    step_master: has10kSteps,
    fitness_starter: exerciseSessions >= 10,
    task_crusher: completedTasks >= 100,
    consistency_champion: (healthLogs?.length || 0) >= 14,
  };

  const totalXP = userXP?.total_xp || 0;
  const level = userXP?.level || 1;
  const xpForNext = level * 500;
  const xpProgress = totalXP % 500;
  const xpPercent = (xpProgress / 500) * 100;

  const earnedCount = earnedKeys.size;

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
            <p className="text-4xl font-bold text-primary mt-1">{level}</p>
          </div>
        </div>
        <div className="xp-bar h-3">
          <div className="xp-fill h-3" style={{ width: `${xpPercent}%` }} />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{xpProgress} XP</span>
          <span>{xpForNext} XP to Level {level + 1}</span>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{earnedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Badges Earned</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{badgeDefs.length - earnedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Badges Locked</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-primary">{completedTasks}</p>
          <p className="text-xs text-muted-foreground mt-1">Tasks Completed</p>
        </motion.div>
      </div>

      {/* Badges Grid */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="text-sm font-semibold text-foreground mb-4">All Badges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badgeDefs.map((badge, i) => {
            const earned = earnedKeys.has(badge.key);
            const available = canEarn[badge.key] && !earned;
            return (
              <motion.div
                key={badge.key}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + i * 0.03 }}
                className={`glass-card p-4 ${!earned && !available ? "opacity-40" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${badge.gradient} shrink-0`}>
                    <badge.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{badge.name}</p>
                      {earned && <span className="badge-earned text-[10px]">Earned</span>}
                      {available && <span className="text-[10px] text-primary font-medium">🎯 Claimable!</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{badge.desc}</p>
                    <p className="text-xs font-semibold text-primary mt-1">+{badge.xp} XP</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
