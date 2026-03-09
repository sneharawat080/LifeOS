import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, User, Heart, Briefcase, Zap, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const steps = [
  { icon: User, title: "Personal Information", subtitle: "Tell us about yourself" },
  { icon: Heart, title: "Health Information", subtitle: "Your health baseline" },
  { icon: Briefcase, title: "Career Information", subtitle: "Your professional life" },
  { icon: Zap, title: "Productivity Preferences", subtitle: "How you like to work" },
  { icon: Target, title: "Goals Setup", subtitle: "What you want to achieve" },
];

export default function Onboarding() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 1: Personal
  const [personal, setPersonal] = useState({ name: "", age: "", gender: "", country: "", height_cm: "", weight_kg: "" });
  // Step 2: Health
  const [health, setHealth] = useState({ target_weight: "", activity_level: "moderate", sleep_hours: "7", stress_level: "moderate", diseases: "", allergies: "", medications: "", exercise_frequency: "sometimes", diet_preference: "any", water_intake_goal: "8" });
  // Step 3: Career
  const [career, setCareer] = useState({ profession: "", industry: "", years_experience: "", education_level: "", skills: "", tools_known: "", career_goals: [] as string[] });
  // Step 4: Productivity
  const [habits, setHabits] = useState(["💧 Drink Water", "📚 Read", "🏋️ Exercise", "🧘 Meditate"]);
  const [newHabit, setNewHabit] = useState("");
  // Step 5: Goals
  const [goals, setGoals] = useState([{ title: "", category: "health", description: "" }]);

  const calcBMI = () => {
    const h = parseFloat(personal.height_cm) / 100;
    const w = parseFloat(personal.weight_kg);
    if (h > 0 && w > 0) return parseFloat((w / (h * h)).toFixed(1));
    return null;
  };

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const bmi = calcBMI();
      // Update profile
      await supabase.from("profiles").update({
        name: personal.name,
        age: personal.age ? parseInt(personal.age) : null,
        gender: personal.gender,
        country: personal.country,
        height_cm: personal.height_cm ? parseFloat(personal.height_cm) : null,
        weight_kg: personal.weight_kg ? parseFloat(personal.weight_kg) : null,
        bmi,
        onboarding_completed: true,
      }).eq("user_id", user.id);

      // Insert health profile
      await supabase.from("health_profiles").upsert({
        user_id: user.id,
        current_weight: personal.weight_kg ? parseFloat(personal.weight_kg) : null,
        target_weight: health.target_weight ? parseFloat(health.target_weight) : null,
        activity_level: health.activity_level,
        sleep_hours: health.sleep_hours ? parseFloat(health.sleep_hours) : null,
        stress_level: health.stress_level,
        diseases: health.diseases ? health.diseases.split(",").map(s => s.trim()).filter(Boolean) : [],
        allergies: health.allergies ? health.allergies.split(",").map(s => s.trim()).filter(Boolean) : [],
        medications: health.medications ? health.medications.split(",").map(s => s.trim()).filter(Boolean) : [],
        water_intake_goal: parseInt(health.water_intake_goal),
        exercise_frequency: health.exercise_frequency,
        diet_preference: health.diet_preference,
      }, { onConflict: "user_id" });

      // Insert career profile
      await supabase.from("career_profiles").upsert({
        user_id: user.id,
        profession: career.profession,
        industry: career.industry,
        years_experience: career.years_experience ? parseInt(career.years_experience) : null,
        education_level: career.education_level,
        skills: career.skills ? career.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
        tools_known: career.tools_known ? career.tools_known.split(",").map(s => s.trim()).filter(Boolean) : [],
        career_goals: career.career_goals,
      }, { onConflict: "user_id" });

      // Create habits
      for (const name of habits) {
        await supabase.from("habits").insert({ user_id: user.id, name });
      }

      // Create goals
      for (const goal of goals) {
        if (goal.title.trim()) {
          await supabase.from("goals").insert({ user_id: user.id, title: goal.title, category: goal.category, description: goal.description });
        }
      }

      qc.invalidateQueries({ queryKey: ["profile"] });
      toast({ title: "Welcome to LifeOS! 🎉", description: "Your profile is set up. Let's start tracking!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const careerGoalOptions = ["Get a new job", "Switch career", "Get promoted", "Learn new skills", "Start a business"];

  const inputClass = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  const selectClass = inputClass;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all ${i <= step ? "gradient-emerald" : "bg-muted"}`} />
            </div>
          ))}
        </div>

        <div className="text-center mb-6">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl gradient-emerald mb-3">
            {(() => { const Icon = steps[step].icon; return <Icon className="h-6 w-6 text-primary-foreground" />; })()}
          </div>
          <h2 className="text-xl font-bold text-foreground">{steps[step].title}</h2>
          <p className="text-sm text-muted-foreground">{steps[step].subtitle}</p>
        </div>

        <div className="glass-card p-6">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {step === 0 && (
                <div className="space-y-3">
                  <input placeholder="Full name" value={personal.name} onChange={e => setPersonal({ ...personal, name: e.target.value })} className={inputClass} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="Age" value={personal.age} onChange={e => setPersonal({ ...personal, age: e.target.value })} className={inputClass} />
                    <select value={personal.gender} onChange={e => setPersonal({ ...personal, gender: e.target.value })} className={selectClass}>
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <input placeholder="Country" value={personal.country} onChange={e => setPersonal({ ...personal, country: e.target.value })} className={inputClass} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="Height (cm)" value={personal.height_cm} onChange={e => setPersonal({ ...personal, height_cm: e.target.value })} className={inputClass} />
                    <input type="number" placeholder="Weight (kg)" value={personal.weight_kg} onChange={e => setPersonal({ ...personal, weight_kg: e.target.value })} className={inputClass} />
                  </div>
                  {calcBMI() && (
                    <p className="text-sm text-muted-foreground">BMI: <strong className="text-foreground">{calcBMI()}</strong></p>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-3">
                  <input type="number" placeholder="Target weight (kg)" value={health.target_weight} onChange={e => setHealth({ ...health, target_weight: e.target.value })} className={inputClass} />
                  <select value={health.activity_level} onChange={e => setHealth({ ...health, activity_level: e.target.value })} className={selectClass}>
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Lightly Active</option>
                    <option value="moderate">Moderately Active</option>
                    <option value="active">Active</option>
                    <option value="very_active">Very Active</option>
                  </select>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="Sleep hours" value={health.sleep_hours} onChange={e => setHealth({ ...health, sleep_hours: e.target.value })} className={inputClass} />
                    <select value={health.stress_level} onChange={e => setHealth({ ...health, stress_level: e.target.value })} className={selectClass}>
                      <option value="low">Low Stress</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High Stress</option>
                    </select>
                  </div>
                  <input placeholder="Diseases (comma separated)" value={health.diseases} onChange={e => setHealth({ ...health, diseases: e.target.value })} className={inputClass} />
                  <input placeholder="Allergies (comma separated)" value={health.allergies} onChange={e => setHealth({ ...health, allergies: e.target.value })} className={inputClass} />
                  <input placeholder="Medications (comma separated)" value={health.medications} onChange={e => setHealth({ ...health, medications: e.target.value })} className={inputClass} />
                  <div className="grid grid-cols-2 gap-3">
                    <select value={health.exercise_frequency} onChange={e => setHealth({ ...health, exercise_frequency: e.target.value })} className={selectClass}>
                      <option value="never">Never exercise</option>
                      <option value="rarely">Rarely</option>
                      <option value="sometimes">Sometimes</option>
                      <option value="often">Often</option>
                      <option value="daily">Daily</option>
                    </select>
                    <select value={health.diet_preference} onChange={e => setHealth({ ...health, diet_preference: e.target.value })} className={selectClass}>
                      <option value="any">Any diet</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="keto">Keto</option>
                      <option value="paleo">Paleo</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <input placeholder="Current profession" value={career.profession} onChange={e => setCareer({ ...career, profession: e.target.value })} className={inputClass} />
                  <input placeholder="Industry" value={career.industry} onChange={e => setCareer({ ...career, industry: e.target.value })} className={inputClass} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" placeholder="Years of experience" value={career.years_experience} onChange={e => setCareer({ ...career, years_experience: e.target.value })} className={inputClass} />
                    <select value={career.education_level} onChange={e => setCareer({ ...career, education_level: e.target.value })} className={selectClass}>
                      <option value="">Education level</option>
                      <option value="high_school">High School</option>
                      <option value="bachelor">Bachelor's</option>
                      <option value="master">Master's</option>
                      <option value="phd">PhD</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <input placeholder="Skills (comma separated)" value={career.skills} onChange={e => setCareer({ ...career, skills: e.target.value })} className={inputClass} />
                  <input placeholder="Tools & technologies (comma separated)" value={career.tools_known} onChange={e => setCareer({ ...career, tools_known: e.target.value })} className={inputClass} />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Career goals</p>
                    <div className="flex flex-wrap gap-2">
                      {careerGoalOptions.map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setCareer(prev => ({
                            ...prev,
                            career_goals: prev.career_goals.includes(g)
                              ? prev.career_goals.filter(x => x !== g)
                              : [...prev.career_goals, g]
                          }))}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            career.career_goals.includes(g)
                              ? "bg-primary text-primary-foreground"
                              : "border border-border text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground mb-2">Select habits you want to track daily:</p>
                  <div className="space-y-2">
                    {habits.map((h, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <span className="text-sm text-foreground">{h}</span>
                        <button onClick={() => setHabits(habits.filter((_, j) => j !== i))} className="text-xs text-destructive hover:underline">Remove</button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input placeholder="Add custom habit" value={newHabit} onChange={e => setNewHabit(e.target.value)} className={inputClass} />
                    <button
                      onClick={() => { if (newHabit.trim()) { setHabits([...habits, newHabit.trim()]); setNewHabit(""); } }}
                      className="shrink-0 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-3">
                  {goals.map((g, i) => (
                    <div key={i} className="space-y-2 rounded-lg border border-border p-3">
                      <input placeholder="Goal title" value={g.title} onChange={e => { const ng = [...goals]; ng[i].title = e.target.value; setGoals(ng); }} className={inputClass} />
                      <div className="grid grid-cols-2 gap-2">
                        <select value={g.category} onChange={e => { const ng = [...goals]; ng[i].category = e.target.value; setGoals(ng); }} className={selectClass}>
                          <option value="health">Health</option>
                          <option value="career">Career</option>
                          <option value="productivity">Productivity</option>
                          <option value="personal">Personal</option>
                        </select>
                        <input placeholder="Description" value={g.description} onChange={e => { const ng = [...goals]; ng[i].description = e.target.value; setGoals(ng); }} className={inputClass} />
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setGoals([...goals, { title: "", category: "health", description: "" }])} className="text-xs text-primary font-medium hover:underline">
                    + Add another goal
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-1 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={loading}
                className="flex items-center gap-1 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? "Setting up..." : "Complete Setup"} <Sparkles className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
