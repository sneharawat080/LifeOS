import { motion } from "framer-motion";
import { Apple, Loader2, Sparkles, Droplets, AlertCircle, Pill, RefreshCw, Clock, Flame } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DietChartProps {
  profile: any;
  healthProfile: any;
}

export function DietChart({ profile, healthProfile }: DietChartProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [diet, setDiet] = useState<any>(null);

  const generateDiet = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-diet", {
        body: { profile, healthProfile },
      });
      if (error) throw error;
      if (data?.diet) {
        setDiet(data.diet);
        toast({ title: "Diet plan ready! 🥗" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/80">
            <Apple className="h-4 w-4 text-accent-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Personalized Diet Plan</h3>
            <p className="text-[11px] text-muted-foreground">AI-generated based on your health profile</p>
          </div>
        </div>
        <button
          onClick={generateDiet}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : diet ? <RefreshCw className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
          {loading ? "Generating..." : diet ? "Regenerate" : "Generate Diet Plan"}
        </button>
      </div>

      <div className="p-5">
        {loading && (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <Apple className="h-6 w-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-sm font-medium text-foreground">Creating your personalized diet...</p>
            <p className="text-xs text-muted-foreground">Considering your health profile, allergies & preferences</p>
          </div>
        )}

        {!diet && !loading && (
          <div className="text-center py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mx-auto mb-4">
              <Apple className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Get your AI-powered diet plan</p>
            <p className="text-xs text-muted-foreground mt-1.5 max-w-sm mx-auto">
              Personalized meals, macros, and hydration schedule based on your weight, BMI, allergies & goals
            </p>
          </div>
        )}

        {diet && !loading && (
          <div className="space-y-5">
            {/* Macros Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { label: "Calories", value: `${diet.daily_calories} kcal`, icon: Flame },
                { label: "Protein", value: `${diet.macros?.protein_g}g` },
                { label: "Carbs", value: `${diet.macros?.carbs_g}g` },
                { label: "Fat", value: `${diet.macros?.fat_g}g` },
                { label: "Fiber", value: `${diet.macros?.fiber_g}g` },
              ].map(item => (
                <div key={item.label} className="rounded-xl border border-border bg-muted/30 p-2.5 text-center">
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-xs font-bold text-foreground mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Meals */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-foreground">Daily Meals</p>
              {diet.meals?.map((meal: any, i: number) => (
                <div key={i} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-semibold text-foreground">{meal.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{meal.time}</span>
                      <span className="text-[10px] font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">{meal.calories} kcal</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {meal.items?.map((item: string, j: number) => (
                      <p key={j} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-primary">•</span> {item}
                      </p>
                    ))}
                  </div>
                  {meal.tip && (
                    <p className="text-[10px] text-primary mt-2 italic">💡 {meal.tip}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Snacks */}
            {diet.snacks?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-foreground mb-2">Snacks</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {diet.snacks.map((snack: any, i: number) => (
                    <div key={i} className="rounded-xl border border-border p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-foreground">{snack.name}</span>
                        <span className="text-[10px] text-primary">{snack.calories} kcal</span>
                      </div>
                      {snack.items?.map((item: string, j: number) => (
                        <p key={j} className="text-[10px] text-muted-foreground">• {item}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hydration */}
            {diet.hydration_schedule?.length > 0 && (
              <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold text-primary">Hydration Schedule</p>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {diet.hydration_schedule.map((h: string, i: number) => (
                    <p key={i} className="text-xs text-foreground">💧 {h}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {diet.foods_to_avoid?.length > 0 && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <p className="text-xs font-semibold text-foreground">Foods to Avoid</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {diet.foods_to_avoid.map((f: string, i: number) => (
                      <span key={i} className="text-[10px] bg-destructive/10 text-destructive rounded-md px-2 py-0.5">{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {diet.supplements_recommended?.length > 0 && (
                <div className="rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="h-4 w-4 text-primary" />
                    <p className="text-xs font-semibold text-foreground">Supplements</p>
                  </div>
                  <div className="space-y-1">
                    {diet.supplements_recommended.map((s: string, i: number) => (
                      <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="text-primary">•</span> {s}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Weekly Tips */}
            {diet.weekly_tips?.length > 0 && (
              <div className="rounded-xl bg-muted/50 p-4">
                <p className="text-xs font-semibold text-foreground mb-2">💡 Weekly Tips</p>
                <div className="space-y-1.5">
                  {diet.weekly_tips.map((t: string, i: number) => (
                    <p key={i} className="text-xs text-muted-foreground">• {t}</p>
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
