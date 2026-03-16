import { motion } from "framer-motion";
import { FileText, Upload, Loader2, Sparkles, CheckCircle2, AlertTriangle, Lightbulb, Award } from "lucide-react";
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ResumeAnalysisProps {
  skills: string[];
  storedAnalysis: any;
  resumeUrl?: string | null;
}

export function ResumeAnalysis({ skills, storedAnalysis, resumeUrl }: ResumeAnalysisProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

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
      const { error: uploadError } = await supabase.storage.from("resumes").upload(filePath, file);
      if (uploadError) throw uploadError;

      await supabase.from("career_profiles").update({ resume_url: filePath }).eq("user_id", user.id);
      toast({ title: "Resume uploaded! 📄", description: "Now analyzing with AI..." });

      setAnalyzing(true);
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { filePath, fileName: file.name, existingSkills: skills },
      });
      if (error) throw error;

      if (data?.analysis) {
        setAnalysisResult(data.analysis);
        await supabase.from("career_profiles").update({
          resume_extracted_data: data.analysis,
          skills: data.analysis.extracted_skills || skills,
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
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Resume Analysis</h3>
            <p className="text-[11px] text-muted-foreground">AI-powered skill extraction & insights</p>
          </div>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || analyzing}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {uploading ? "Uploading..." : analyzing ? "Analyzing..." : analysis ? "Re-analyze" : "Upload Resume"}
        </button>
        <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
      </div>

      <div className="p-5">
        {analyzing && (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <Sparkles className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-sm font-medium text-foreground">AI is analyzing your resume...</p>
            <p className="text-xs text-muted-foreground">Extracting skills, detecting gaps & generating suggestions</p>
          </div>
        )}

        {!analysis && !analyzing && (
          <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary/40 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mx-auto mb-4">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Drop your resume here or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1.5">Supports PDF, DOC, DOCX • Max 10MB</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              {["Skill Extraction", "Gap Detection", "Improvement Tips"].map(f => (
                <span key={f} className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-primary" /> {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {analysis && !analyzing && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 bg-primary/5 rounded-xl px-4 py-2.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary">AI Analysis Complete</span>
            </div>

            {/* Extracted Skills */}
            {analysis.extracted_skills?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold text-foreground">Extracted Skills ({analysis.extracted_skills.length})</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.extracted_skills.map((s: string) => (
                    <span key={s} className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Summary */}
            {analysis.experience_summary && (
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-xs font-semibold text-foreground mb-1.5">Experience Summary</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{analysis.experience_summary}</p>
              </div>
            )}

            {/* Career Gaps */}
            {analysis.career_gaps?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <p className="text-xs font-semibold text-foreground">Areas to Improve</p>
                </div>
                <div className="space-y-2">
                  {analysis.career_gaps.map((g: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-lg border border-amber-200/50 bg-amber-50/30 dark:border-amber-500/20 dark:bg-amber-500/5 p-3">
                      <span className="text-amber-500 text-xs mt-0.5">⚠</span>
                      <p className="text-xs text-foreground">{g}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions?.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold text-foreground">Improvement Suggestions</p>
                </div>
                <div className="space-y-2">
                  {analysis.suggestions.map((s: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-lg border border-primary/10 bg-primary/5 p-3">
                      <span className="text-primary text-xs mt-0.5 font-bold">{i + 1}</span>
                      <p className="text-xs text-foreground">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
