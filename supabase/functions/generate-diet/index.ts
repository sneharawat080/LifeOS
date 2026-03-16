import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { profile, healthProfile } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are a certified nutritionist AI. Create a personalized daily diet plan based on the user's health profile.

User Profile:
- Age: ${profile?.age || "Unknown"}
- Gender: ${profile?.gender || "Unknown"}
- Height: ${profile?.height_cm ? profile.height_cm + " cm" : "Unknown"}
- Weight: ${profile?.weight_kg ? profile.weight_kg + " kg" : "Unknown"}
- BMI: ${profile?.bmi || "Unknown"}

Health Profile:
- Activity Level: ${healthProfile?.activity_level || "Moderate"}
- Diet Preference: ${healthProfile?.diet_preference || "No preference"}
- Target Weight: ${healthProfile?.target_weight ? healthProfile.target_weight + " kg" : "Not set"}
- Allergies: ${(healthProfile?.allergies || []).join(", ") || "None"}
- Medical Conditions: ${(healthProfile?.diseases || []).join(", ") || "None"}
- Medications: ${(healthProfile?.medications || []).join(", ") || "None"}
- Water Intake Goal: ${healthProfile?.water_intake_goal || 8} glasses/day

Return a JSON object with these exact fields:
{
  "daily_calories": 2000,
  "macros": { "protein_g": 120, "carbs_g": 250, "fat_g": 65, "fiber_g": 30 },
  "meals": [
    {
      "name": "Breakfast",
      "time": "7:00 AM",
      "items": ["item 1 with quantity", "item 2"],
      "calories": 450,
      "tip": "Quick tip about this meal"
    }
  ],
  "snacks": [
    { "name": "Mid-morning snack", "items": ["item"], "calories": 150 }
  ],
  "hydration_schedule": ["8 AM - 2 glasses", "12 PM - 2 glasses", "4 PM - 2 glasses", "8 PM - 2 glasses"],
  "foods_to_avoid": ["food1", "food2"],
  "supplements_recommended": ["supplement1", "supplement2"],
  "weekly_tips": ["tip1", "tip2", "tip3"]
}

Include 4 meals (breakfast, lunch, evening snack, dinner) and 2 snacks. Consider allergies and diet preference strictly.
Return ONLY valid JSON, no markdown.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("Diet generation failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let diet;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      diet = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      diet = null;
    }

    if (!diet) {
      return new Response(JSON.stringify({ error: "Failed to parse diet plan" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ diet }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-diet error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
