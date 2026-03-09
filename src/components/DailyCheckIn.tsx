import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Footprints, Dumbbell, Moon, Brain, Smile, X } from "lucide-react";
import { useUpsertHealthLog, useTodayHealthLog, useUpsertMoodLog, useTodayMoodLog } from "@/hooks/useData";
import { useToast } from "@/hooks/use-toast";

interface DailyCheckInProps {
  open: boolean;
  onClose: () => void;
}

const moods = [
  { value: "great", emoji: "😄", label: "Great" },
  { value: "good", emoji: "😊", label: "Good" },
  { value: "okay", emoji: "😐", label: "Okay" },
  { value: "bad", emoji: "😢", label: "Bad" },
  { value: "terrible", emoji: "😫", label: "Terrible" },
];

export function DailyCheckIn({ open, onClose }: DailyCheckInProps) {
  const { data: todayHealth } = useTodayHealthLog();
  const { data: todayMood } = useTodayMoodLog();
  const upsertHealth = useUpsertHealthLog();
  const upsertMood = useUpsertMoodLog();
  const { toast } = useToast();

  const [waterGlasses, setWaterGlasses] = useState(todayHealth?.water_glasses || 0);
  const [steps, setSteps] = useState(todayHealth?.steps?.toString() || "");
  const [exerciseMinutes, setExerciseMinutes] = useState(todayHealth?.exercise_minutes?.toString() || "");
  const [sleepHours, setSleepHours] = useState(todayHealth?.sleep_hours?.toString() || "");
  const [mood, setMood] = useState(todayMood?.mood || "");
  const [stressLevel, setStressLevel] = useState(todayMood?.stress_level?.toString() || "5");
  const [energyLevel, setEnergyLevel] = useState(todayMood?.energy_level?.toString() || "5");

  const handleSave = async () => {
    try {
      await upsertHealth.mutateAsync({
        water_glasses: waterGlasses,
        steps: steps ? parseInt(steps) : 0,
        exercise_minutes: exerciseMinutes ? parseInt(exerciseMinutes) : 0,
        sleep_hours: sleepHours ? parseFloat(sleepHours) : null,
      });
      await upsertMood.mutateAsync({
        mood,
        stress_level: parseInt(stressLevel),
        energy_level: parseInt(energyLevel),
      });
      toast({ title: "Check-in saved! ✅" });
      onClose();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  if (!open) return null;

  const inputClass = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="glass-card p-6 w-full max-w-md max-h-[90vh] overflow-auto"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Daily Check-In</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
          </div>

          <div className="space-y-4">
            {/* Water */}
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                <Droplets className="h-3.5 w-3.5" /> Water Intake
              </label>
              <div className="flex gap-1.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setWaterGlasses(i + 1)}
                    className={`h-8 w-6 rounded-full transition-all ${i < waterGlasses ? "gradient-emerald" : "bg-muted"}`}
                  />
                ))}
                <span className="ml-2 text-sm text-foreground font-medium">{waterGlasses}/8</span>
              </div>
            </div>

            {/* Steps & Exercise */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                  <Footprints className="h-3.5 w-3.5" /> Steps
                </label>
                <input type="number" placeholder="0" value={steps} onChange={e => setSteps(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                  <Dumbbell className="h-3.5 w-3.5" /> Exercise (min)
                </label>
                <input type="number" placeholder="0" value={exerciseMinutes} onChange={e => setExerciseMinutes(e.target.value)} className={inputClass} />
              </div>
            </div>

            {/* Sleep */}
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                <Moon className="h-3.5 w-3.5" /> Sleep (hours)
              </label>
              <input type="number" step="0.5" placeholder="7" value={sleepHours} onChange={e => setSleepHours(e.target.value)} className={inputClass} />
            </div>

            {/* Mood */}
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                <Smile className="h-3.5 w-3.5" /> Mood
              </label>
              <div className="flex gap-2">
                {moods.map(m => (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`flex-1 rounded-lg border p-2 text-center transition-all ${mood === m.value ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <span className="text-lg">{m.emoji}</span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{m.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Stress & Energy */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                  <Brain className="h-3.5 w-3.5" /> Stress (1-10)
                </label>
                <input type="range" min="1" max="10" value={stressLevel} onChange={e => setStressLevel(e.target.value)} className="w-full accent-primary" />
                <p className="text-xs text-center text-muted-foreground">{stressLevel}/10</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Energy (1-10)</label>
                <input type="range" min="1" max="10" value={energyLevel} onChange={e => setEnergyLevel(e.target.value)} className="w-full accent-primary" />
                <p className="text-xs text-center text-muted-foreground">{energyLevel}/10</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={upsertHealth.isPending || upsertMood.isPending}
            className="w-full mt-6 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {upsertHealth.isPending ? "Saving..." : "Save Check-In"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
