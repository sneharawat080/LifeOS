import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { profile, careerProfile, resumeAnalysis } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are an expert career counselor. Based on the user's profile, generate a personalized career roadmap.

User Profile:
- Name: ${profile?.name || "Unknown"}
- Age: ${profile?.age || "Unknown"}
- Country: ${profile?.country || "Unknown"}

Career Profile:
- Current Profession: ${careerProfile?.profession || "Not specified"}
- Industry: ${careerProfile?.industry || "Not specified"}
- Years of Experience: ${careerProfile?.years_experience || "Not specified"}
- Education: ${careerProfile?.education_level || "Not specified"}
- Skills: ${(careerProfile?.skills || []).join(", ") || "None listed"}
- Tools Known: ${(careerProfile?.tools_known || []).join(", ") || "None listed"}
- Career Goals: ${(careerProfile?.career_goals || []).join(", ") || "None listed"}

${resumeAnalysis ? `Resume Analysis Results:
- Extracted Skills: ${(resumeAnalysis.extracted_skills || []).join(", ")}
- Experience Summary: ${resumeAnalysis.experience_summary || "N/A"}
- Career Gaps: ${(resumeAnalysis.career_gaps || []).join(", ")}` : ""}

Return a JSON object with these exact fields:
{
  "current_level": "Junior/Mid/Senior/Lead/Executive",
  "target_role": "Recommended next role",
  "timeline": "Estimated time to reach target",
  "phases": [
    {
      "title": "Phase title",
      "duration": "e.g. 0-3 months",
      "description": "What to focus on",
      "skills_to_learn": ["skill1", "skill2"],
      "actions": ["action1", "action2", "action3"],
      "milestones": ["milestone1", "milestone2"]
    }
  ],
  "salary_insights": "Expected salary range progression",
  "recommended_certifications": ["cert1", "cert2"],
  "networking_tips": ["tip1", "tip2"]
}

Make phases 3-5 items, each with 2-4 actions and skills. Be specific and actionable.
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
      throw new Error("AI roadmap generation failed");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let roadmap;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      roadmap = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      roadmap = null;
    }

    if (!roadmap) {
      return new Response(JSON.stringify({ error: "Failed to parse roadmap" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ roadmap }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-roadmap error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
