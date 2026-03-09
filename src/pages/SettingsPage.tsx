import { motion } from "framer-motion";
import { User, Bell, Shield, LogOut, Palette } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const [name, setName] = useState(profile?.name || "");

  const handleSaveName = async () => {
    try {
      await updateProfile.mutateAsync({ name });
      toast({ title: "Profile updated!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="page-header">Settings</h1>
        <p className="page-subtitle mt-1">Manage your account and preferences</p>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Profile</p>
            <p className="text-xs text-muted-foreground">Update your personal info</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm font-medium text-foreground">{user?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
              className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button onClick={handleSaveName} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              Save
            </button>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Height</span>
            <span className="text-sm font-medium text-foreground">{profile?.height_cm ? `${profile.height_cm} cm` : "—"}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Weight</span>
            <span className="text-sm font-medium text-foreground">{profile?.weight_kg ? `${profile.weight_kg} kg` : "—"}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">BMI</span>
            <span className="text-sm font-medium text-foreground">{profile?.bmi || "—"}</span>
          </div>
        </div>
      </motion.div>

      {/* Sign Out */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
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
