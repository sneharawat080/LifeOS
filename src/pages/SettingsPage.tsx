import { motion } from "framer-motion";
import { User, LogOut, Moon, Sun, Heart, Briefcase, Save, Edit2, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile, useHealthProfile, useCareerProfile } from "@/hooks/useProfile";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { data: healthProfile } = useHealthProfile();
  const { data: careerProfile } = useCareerProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const qc = useQueryClient();

  // Profile editing
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "", age: "", gender: "", country: "", height_cm: "", weight_kg: ""
  });

  // Health editing
  const [editingHealth, setEditingHealth] = useState(false);
  const [healthForm, setHealthForm] = useState({
    target_weight: "", activity_level: "moderate", sleep_hours: "7", stress_level: "moderate",
    exercise_frequency: "sometimes", diet_preference: "any", water_intake_goal: "8",
    diseases: "", allergies: "", medications: ""
  });

  // Career editing
  const [editingCareer, setEditingCareer] = useState(false);
  const [careerForm, setCareerForm] = useState({
    profession: "", industry: "", years_experience: "", education_level: "",
    skills: "", tools_known: ""
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || "",
        age: profile.age?.toString() || "",
        gender: profile.gender || "",
        country: profile.country || "",
        height_cm: profile.height_cm?.toString() || "",
        weight_kg: profile.weight_kg?.toString() || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (healthProfile) {
      setHealthForm({
        target_weight: healthProfile.target_weight?.toString() || "",
        activity_level: healthProfile.activity_level || "moderate",
        sleep_hours: healthProfile.sleep_hours?.toString() || "7",
        stress_level: healthProfile.stress_level || "moderate",
        exercise_frequency: healthProfile.exercise_frequency || "sometimes",
        diet_preference: healthProfile.diet_preference || "any",
        water_intake_goal: healthProfile.water_intake_goal?.toString() || "8",
        diseases: (healthProfile.diseases || []).join(", "),
        allergies: (healthProfile.allergies || []).join(", "),
        medications: (healthProfile.medications || []).join(", "),
      });
    }
  }, [healthProfile]);

  useEffect(() => {
    if (careerProfile) {
      setCareerForm({
        profession: careerProfile.profession || "",
        industry: careerProfile.industry || "",
        years_experience: careerProfile.years_experience?.toString() || "",
        education_level: careerProfile.education_level || "",
        skills: (careerProfile.skills || []).join(", "),
        tools_known: (careerProfile.tools_known || []).join(", "),
      });
    }
  }, [careerProfile]);

  const calcBMI = (h: string, w: string) => {
    const hm = parseFloat(h) / 100;
    const wk = parseFloat(w);
    if (hm > 0 && wk > 0) return parseFloat((wk / (hm * hm)).toFixed(1));
    return null;
  };

  const handleSaveProfile = async () => {
    try {
      const bmi = calcBMI(profileForm.height_cm, profileForm.weight_kg);
      await updateProfile.mutateAsync({
        name: profileForm.name,
        age: profileForm.age ? parseInt(profileForm.age) : null,
        gender: profileForm.gender || null,
        country: profileForm.country || null,
        height_cm: profileForm.height_cm ? parseFloat(profileForm.height_cm) : null,
        weight_kg: profileForm.weight_kg ? parseFloat(profileForm.weight_kg) : null,
        bmi,
      });
      setEditingProfile(false);
      toast({ title: "Profile updated! ✅" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleSaveHealth = async () => {
    if (!user) return;
    try {
      await supabase.from("health_profiles").upsert({
        user_id: user.id,
        target_weight: healthForm.target_weight ? parseFloat(healthForm.target_weight) : null,
        activity_level: healthForm.activity_level,
        sleep_hours: healthForm.sleep_hours ? parseFloat(healthForm.sleep_hours) : null,
        stress_level: healthForm.stress_level,
        exercise_frequency: healthForm.exercise_frequency,
        diet_preference: healthForm.diet_preference,
        water_intake_goal: parseInt(healthForm.water_intake_goal),
        diseases: healthForm.diseases ? healthForm.diseases.split(",").map(s => s.trim()).filter(Boolean) : [],
        allergies: healthForm.allergies ? healthForm.allergies.split(",").map(s => s.trim()).filter(Boolean) : [],
        medications: healthForm.medications ? healthForm.medications.split(",").map(s => s.trim()).filter(Boolean) : [],
      }, { onConflict: "user_id" });
      qc.invalidateQueries({ queryKey: ["health_profile"] });
      setEditingHealth(false);
      toast({ title: "Health profile updated! ✅" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleSaveCareer = async () => {
    if (!user) return;
    try {
      await supabase.from("career_profiles").upsert({
        user_id: user.id,
        profession: careerForm.profession,
        industry: careerForm.industry,
        years_experience: careerForm.years_experience ? parseInt(careerForm.years_experience) : null,
        education_level: careerForm.education_level,
        skills: careerForm.skills ? careerForm.skills.split(",").map(s => s.trim()).filter(Boolean) : [],
        tools_known: careerForm.tools_known ? careerForm.tools_known.split(",").map(s => s.trim()).filter(Boolean) : [],
      }, { onConflict: "user_id" });
      qc.invalidateQueries({ queryKey: ["career_profile"] });
      setEditingCareer(false);
      toast({ title: "Career profile updated! ✅" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const inputClass = "flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  const selectClass = inputClass;

  const SectionHeader = ({ icon: Icon, title, subtitle, editing, onToggle }: any) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <button onClick={onToggle} className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
        {editing ? <><X className="h-3 w-3" /> Cancel</> : <><Edit2 className="h-3 w-3" /> Edit</>}
      </button>
    </div>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value || "—"}</span>
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="page-header">Settings</h1>
        <p className="page-subtitle mt-1">Manage your account, profile & preferences</p>
      </motion.div>

      {/* Personal Profile */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
        <SectionHeader icon={User} title="Personal Profile" subtitle="Your basic information" editing={editingProfile} onToggle={() => setEditingProfile(!editingProfile)} />
        {editingProfile ? (
          <div className="space-y-3">
            <input value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} placeholder="Full name" className={inputClass} />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" value={profileForm.age} onChange={e => setProfileForm({ ...profileForm, age: e.target.value })} placeholder="Age" className={inputClass} />
              <select value={profileForm.gender} onChange={e => setProfileForm({ ...profileForm, gender: e.target.value })} className={selectClass}>
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <input value={profileForm.country} onChange={e => setProfileForm({ ...profileForm, country: e.target.value })} placeholder="Country" className={inputClass} />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" value={profileForm.height_cm} onChange={e => setProfileForm({ ...profileForm, height_cm: e.target.value })} placeholder="Height (cm)" className={inputClass} />
              <input type="number" value={profileForm.weight_kg} onChange={e => setProfileForm({ ...profileForm, weight_kg: e.target.value })} placeholder="Weight (kg)" className={inputClass} />
            </div>
            {calcBMI(profileForm.height_cm, profileForm.weight_kg) && (
              <p className="text-xs text-muted-foreground">Calculated BMI: <strong className="text-foreground">{calcBMI(profileForm.height_cm, profileForm.weight_kg)}</strong></p>
            )}
            <button onClick={handleSaveProfile} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Save className="h-4 w-4" /> Save Changes
            </button>
          </div>
        ) : (
          <div>
            <InfoRow label="Email" value={user?.email || ""} />
            <InfoRow label="Name" value={profile?.name || ""} />
            <InfoRow label="Age" value={profile?.age ? `${profile.age} years` : ""} />
            <InfoRow label="Gender" value={profile?.gender || ""} />
            <InfoRow label="Country" value={profile?.country || ""} />
            <InfoRow label="Height" value={profile?.height_cm ? `${profile.height_cm} cm` : ""} />
            <InfoRow label="Weight" value={profile?.weight_kg ? `${profile.weight_kg} kg` : ""} />
            <InfoRow label="BMI" value={profile?.bmi?.toString() || ""} />
          </div>
        )}
      </motion.div>

      {/* Health Profile */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5">
        <SectionHeader icon={Heart} title="Health Profile" subtitle="Your health baseline & goals" editing={editingHealth} onToggle={() => setEditingHealth(!editingHealth)} />
        {editingHealth ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input type="number" value={healthForm.target_weight} onChange={e => setHealthForm({ ...healthForm, target_weight: e.target.value })} placeholder="Target weight (kg)" className={inputClass} />
              <input type="number" value={healthForm.water_intake_goal} onChange={e => setHealthForm({ ...healthForm, water_intake_goal: e.target.value })} placeholder="Daily water glasses" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select value={healthForm.activity_level} onChange={e => setHealthForm({ ...healthForm, activity_level: e.target.value })} className={selectClass}>
                <option value="sedentary">Sedentary</option>
                <option value="light">Lightly Active</option>
                <option value="moderate">Moderately Active</option>
                <option value="active">Active</option>
                <option value="very_active">Very Active</option>
              </select>
              <select value={healthForm.stress_level} onChange={e => setHealthForm({ ...healthForm, stress_level: e.target.value })} className={selectClass}>
                <option value="low">Low Stress</option>
                <option value="moderate">Moderate</option>
                <option value="high">High Stress</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="number" value={healthForm.sleep_hours} onChange={e => setHealthForm({ ...healthForm, sleep_hours: e.target.value })} placeholder="Sleep hours" className={inputClass} />
              <select value={healthForm.exercise_frequency} onChange={e => setHealthForm({ ...healthForm, exercise_frequency: e.target.value })} className={selectClass}>
                <option value="never">Never</option>
                <option value="rarely">Rarely</option>
                <option value="sometimes">Sometimes</option>
                <option value="often">Often</option>
                <option value="daily">Daily</option>
              </select>
            </div>
            <select value={healthForm.diet_preference} onChange={e => setHealthForm({ ...healthForm, diet_preference: e.target.value })} className={selectClass}>
              <option value="any">Any diet</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
              <option value="paleo">Paleo</option>
            </select>
            <input value={healthForm.diseases} onChange={e => setHealthForm({ ...healthForm, diseases: e.target.value })} placeholder="Diseases (comma separated)" className={inputClass} />
            <input value={healthForm.allergies} onChange={e => setHealthForm({ ...healthForm, allergies: e.target.value })} placeholder="Allergies (comma separated)" className={inputClass} />
            <input value={healthForm.medications} onChange={e => setHealthForm({ ...healthForm, medications: e.target.value })} placeholder="Medications (comma separated)" className={inputClass} />
            <button onClick={handleSaveHealth} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Save className="h-4 w-4" /> Save Health Profile
            </button>
          </div>
        ) : (
          <div>
            <InfoRow label="Target Weight" value={healthProfile?.target_weight ? `${healthProfile.target_weight} kg` : ""} />
            <InfoRow label="Activity Level" value={healthProfile?.activity_level || ""} />
            <InfoRow label="Sleep Target" value={healthProfile?.sleep_hours ? `${healthProfile.sleep_hours} hrs` : ""} />
            <InfoRow label="Stress Level" value={healthProfile?.stress_level || ""} />
            <InfoRow label="Exercise" value={healthProfile?.exercise_frequency || ""} />
            <InfoRow label="Diet" value={healthProfile?.diet_preference || ""} />
            <InfoRow label="Water Goal" value={healthProfile?.water_intake_goal ? `${healthProfile.water_intake_goal} glasses` : ""} />
          </div>
        )}
      </motion.div>

      {/* Career Profile */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
        <SectionHeader icon={Briefcase} title="Career Profile" subtitle="Your professional information" editing={editingCareer} onToggle={() => setEditingCareer(!editingCareer)} />
        {editingCareer ? (
          <div className="space-y-3">
            <input value={careerForm.profession} onChange={e => setCareerForm({ ...careerForm, profession: e.target.value })} placeholder="Profession" className={inputClass} />
            <input value={careerForm.industry} onChange={e => setCareerForm({ ...careerForm, industry: e.target.value })} placeholder="Industry" className={inputClass} />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" value={careerForm.years_experience} onChange={e => setCareerForm({ ...careerForm, years_experience: e.target.value })} placeholder="Years of experience" className={inputClass} />
              <select value={careerForm.education_level} onChange={e => setCareerForm({ ...careerForm, education_level: e.target.value })} className={selectClass}>
                <option value="">Education level</option>
                <option value="high_school">High School</option>
                <option value="bachelor">Bachelor's</option>
                <option value="master">Master's</option>
                <option value="phd">PhD</option>
                <option value="other">Other</option>
              </select>
            </div>
            <input value={careerForm.skills} onChange={e => setCareerForm({ ...careerForm, skills: e.target.value })} placeholder="Skills (comma separated)" className={inputClass} />
            <input value={careerForm.tools_known} onChange={e => setCareerForm({ ...careerForm, tools_known: e.target.value })} placeholder="Tools & technologies (comma separated)" className={inputClass} />
            <button onClick={handleSaveCareer} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Save className="h-4 w-4" /> Save Career Profile
            </button>
          </div>
        ) : (
          <div>
            <InfoRow label="Profession" value={careerProfile?.profession || ""} />
            <InfoRow label="Industry" value={careerProfile?.industry || ""} />
            <InfoRow label="Experience" value={careerProfile?.years_experience ? `${careerProfile.years_experience} years` : ""} />
            <InfoRow label="Education" value={careerProfile?.education_level || ""} />
            <InfoRow label="Skills" value={(careerProfile?.skills || []).join(", ")} />
            <InfoRow label="Tools" value={(careerProfile?.tools_known || []).join(", ")} />
          </div>
        )}
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            {theme === "dark" ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-primary" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Appearance</p>
            <p className="text-xs text-muted-foreground">Choose your preferred theme</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {([
            { value: "light" as const, icon: Sun, label: "Light" },
            { value: "dark" as const, icon: Moon, label: "Dark" },
          ]).map(opt => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                theme === opt.value ? "border-primary bg-primary/5" : "border-border hover:bg-muted/30"
              }`}
            >
              <opt.icon className={`h-5 w-5 ${theme === opt.value ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-xs font-medium ${theme === opt.value ? "text-primary" : "text-muted-foreground"}`}>{opt.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Sign Out */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <button
          onClick={signOut}
          className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </motion.div>
    </div>
  );
}
