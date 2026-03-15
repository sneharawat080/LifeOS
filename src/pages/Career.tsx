import { motion } from "framer-motion";
import { Briefcase, Target, BookOpen, TrendingUp, CheckCircle2, Upload, FileText, Loader2, Sparkles } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { EmptyState } from "@/components/EmptyState";
import { useCareerProfile } from "@/hooks/useProfile";
import { useDailyCareerLogs, useGoals } from "@/hooks/useData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function Career() {
  const { user } = useAuth();
  const { data: careerProfile } = useCareerProfile();
  const { data: careerLogs } = useDailyCareerLogs(7);
  const { data: goals } = useGoals();
  const { toast } = useToast();
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const careerGoals = goals?.filter(g => g.category === "career") || [];
  const totalLearningHours = (careerLogs || []).reduce((sum, l) => sum + (l.learning_hours || 0), 0);
  const skills = careerProfile?.skills || [];

  const weeklyLearning = (careerLogs || []).map(l => ({
    day: new Date(l.log_date).toLocaleDateString("en", { weekday: "short" }),
    hours: l.learning_hours || 0,
  }));

  const hasData = careerProfile || (careerLogs && careerLogs.length > 0);

  // If resume was already analyzed, show stored result
  const storedAnalysis = careerProfile?.resume_extracted_data as any;

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: "Invalid file", description: "Please upload a PDF or DOC file.", variant: "destructive" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      // Update career profile with resume URL
      const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(filePath);
      await supabase.from("career_profiles").update({
        resume_url: filePath,
      }).eq("user_id", user.id);

      toast({ title: "Resume uploaded! 📄", description: "Now analyzing with AI..." });

      // Analyze with AI
      setAnalyzing(true);
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { filePath, fileName: file.name, existingSkills: skills },
      });

      if (error) throw error;

      if (data?.analysis) {
        setAnalysisResult(data.analysis);
        // Store extracted data
        await supabase.from("career_profiles").update({
          resume_extracted_data: data.analysis,
          skills: data.analysis.skills || skills,
        }).eq("user_id", user.id);
        qc.invalidateQueries({ queryKey: ["career_profile"] });
        toast({ title: "Analysis complete! ✨" });
      }
    } catch (err: any) {
      console.error("Resume upload error:", err);
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const analysis = analysisResult || storedAnalysis;

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

          {/* Resume Upload */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Resume Analysis</h3>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || analyzing}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                {uploading ? "Uploading..." : analyzing ? "Analyzing..." : "Upload Resume"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
              />
            </div>

            {analyzing && (
              <div className="flex items-center gap-3 py-8 justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">AI is analyzing your resume...</p>
              </div>
            )}

            {!analysis && !analyzing && (
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Upload your resume (PDF or DOC) for AI-powered analysis</p>
                <p className="text-xs text-muted-foreground mt-1">Get skill extraction, gap detection, and improvement suggestions</p>
              </div>
            )}

            {analysis && !analyzing && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs font-semibold text-primary">AI Analysis Results</span>
                </div>

                {analysis.extracted_skills?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Extracted Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.extracted_skills.map((s: string) => (
                        <span key={s} className="badge-earned">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.experience_summary && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Experience Summary</p>
                    <p className="text-sm text-foreground">{analysis.experience_summary}</p>
                  </div>
                )}

                {analysis.career_gaps?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Career Gaps Detected</p>
                    <ul className="space-y-1">
                      {analysis.career_gaps.map((g: string, i: number) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-destructive shrink-0">•</span> {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.suggestions?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Improvement Suggestions</p>
                    <ul className="space-y-1">
                      {analysis.suggestions.map((s: string, i: number) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-primary shrink-0">✦</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Skills & Learning Chart */}
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
