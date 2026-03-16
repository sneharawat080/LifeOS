import { motion } from "framer-motion";
import { Map, Loader2, Sparkles, GraduationCap, Clock, Target, Award, Users, RefreshCw } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CareerRoadmapProps {
  profile: any;
  careerProfile: any;
}

export function CareerRoadmap({ profile, careerProfile }: CareerRoadmapProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(null);

  const resumeAnalysis = careerProfile?.resume_extracted_data as any;

  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-roadmap", {
        body: { profile, careerProfile, resumeAnalysis },
      });
      if (error) throw error;
      if (data?.roadmap) {
        setRoadmap(data.roadmap);
        toast({ title: "Roadmap generated! 🗺️" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} className="glass-card overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/80">
            <Map className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Career Roadmap</h3>
            <p className="text-[11px] text-muted-foreground">AI-generated personalized growth plan</p>
          </div>
        </div>
        <button
          onClick={generateRoadmap}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : roadmap ? <RefreshCw className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
          {loading ? "Generating..." : roadmap ? "Regenerate" : "Generate Roadmap"}
        </button>
      </div>

      <div className="p-5">
        {loading && (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <Map className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-sm font-medium text-foreground">Building your career roadmap...</p>
            <p className="text-xs text-muted-foreground">Analyzing skills, experience & market trends</p>
          </div>
        )}

        {!roadmap && !loading && (
          <div className="text-center py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mx-auto mb-4">
              <Map className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Get your personalized career roadmap</p>
            <p className="text-xs text-muted-foreground mt-1.5 max-w-sm mx-auto">
              Based on your skills, experience, and goals — AI will create a step-by-step plan to advance your career
            </p>
          </div>
        )}

        {roadmap && !loading && (
          <div className="space-y-5">
            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Current Level", value: roadmap.current_level, icon: Target },
                { label: "Target Role", value: roadmap.target_role, icon: Award },
                { label: "Timeline", value: roadmap.timeline, icon: Clock },
              ].map(item => (
                <div key={item.label} className="rounded-xl border border-border bg-muted/30 p-3 text-center">
                  <item.icon className="h-4 w-4 text-primary mx-auto mb-1.5" />
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-xs font-bold text-foreground mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Phases Timeline */}
            {roadmap.phases?.map((phase: any, i: number) => (
              <div key={i} className="relative pl-8">
                {/* Timeline line */}
                {i < (roadmap.phases?.length || 0) - 1 && (
                  <div className="absolute left-[13px] top-8 bottom-0 w-0.5 bg-border" />
                )}
                {/* Timeline dot */}
                <div className={`absolute left-0 top-1.5 flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-primary-foreground ${i === 0 ? "bg-primary" : "bg-muted-foreground/40"}`}>
                  {i + 1}
                </div>

                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-foreground">{phase.title}</h4>
                    <span className="text-[10px] text-muted-foreground bg-muted rounded-full px-2.5 py-0.5">{phase.duration}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{phase.description}</p>

                  {phase.skills_to_learn?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">SKILLS TO LEARN</p>
                      <div className="flex flex-wrap gap-1">
                        {phase.skills_to_learn.map((s: string) => (
                          <span key={s} className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {phase.actions?.length > 0 && (
                    <div className="space-y-1.5">
                      {phase.actions.map((a: string, j: number) => (
                        <div key={j} className="flex items-start gap-2 text-xs text-foreground">
                          <span className="text-primary mt-0.5 text-[10px]">→</span> {a}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Certifications & Tips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roadmap.recommended_certifications?.length > 0 && (
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <p className="text-xs font-semibold text-foreground">Certifications</p>
                  </div>
                  <div className="space-y-1.5">
                    {roadmap.recommended_certifications.map((c: string, i: number) => (
                      <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-primary">•</span> {c}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {roadmap.networking_tips?.length > 0 && (
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-primary" />
                    <p className="text-xs font-semibold text-foreground">Networking Tips</p>
                  </div>
                  <div className="space-y-1.5">
                    {roadmap.networking_tips.map((t: string, i: number) => (
                      <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-primary">•</span> {t}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {roadmap.salary_insights && (
              <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
                <p className="text-xs font-semibold text-primary mb-1">💰 Salary Insights</p>
                <p className="text-xs text-foreground">{roadmap.salary_insights}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
