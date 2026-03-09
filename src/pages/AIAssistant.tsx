import { motion } from "framer-motion";
import { Bot, Send, Sparkles, Heart, Briefcase, Zap } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useHealthProfile, useCareerProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  { icon: Heart, label: "What should I eat today?", color: "gradient-emerald" },
  { icon: Briefcase, label: "How can I improve my career?", color: "gradient-blue" },
  { icon: Zap, label: "Help me plan my day", color: "gradient-purple" },
];

export default function AIAssistant() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const { data: healthProfile } = useHealthProfile();
  const { data: careerProfile } = useCareerProfile();
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", content: `Hi ${profile?.name || "there"}! 👋 I'm your AI life coach. I can help you with diet, fitness, career planning, and productivity. What can I help you with today?` },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Build context
      const userContext = [
        profile?.name ? `User name: ${profile.name}` : "",
        profile?.age ? `Age: ${profile.age}` : "",
        profile?.weight_kg ? `Weight: ${profile.weight_kg}kg` : "",
        profile?.height_cm ? `Height: ${profile.height_cm}cm` : "",
        profile?.bmi ? `BMI: ${profile.bmi}` : "",
        healthProfile?.diet_preference ? `Diet preference: ${healthProfile.diet_preference}` : "",
        healthProfile?.activity_level ? `Activity level: ${healthProfile.activity_level}` : "",
        healthProfile?.target_weight ? `Target weight: ${healthProfile.target_weight}kg` : "",
        healthProfile?.diseases?.length ? `Health conditions: ${healthProfile.diseases.join(", ")}` : "",
        healthProfile?.allergies?.length ? `Allergies: ${healthProfile.allergies.join(", ")}` : "",
        careerProfile?.profession ? `Profession: ${careerProfile.profession}` : "",
        careerProfile?.skills?.length ? `Skills: ${careerProfile.skills.join(", ")}` : "",
        careerProfile?.career_goals?.length ? `Career goals: ${careerProfile.career_goals.join(", ")}` : "",
      ].filter(Boolean).join("\n");

      const chatMessages = newMessages.map(m => ({ role: m.role, content: m.content }));

      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { messages: chatMessages, userContext },
      });

      if (error) throw error;

      const reply = data?.reply || "I'm sorry, I couldn't generate a response right now. Please try again.";
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "assistant", content: reply }]);
    } catch (err: any) {
      console.error("AI error:", err);
      // Fallback to basic response
      const fallbackResponses: Record<string, string> = {
        eat: `Based on your profile, here's a suggested meal plan:\n\n🥣 **Breakfast**: Oatmeal with berries & nuts\n🥗 **Lunch**: Grilled chicken salad with quinoa\n🍎 **Snack**: Greek yogurt & almonds\n🐟 **Dinner**: Baked salmon with sweet potato\n\nStay hydrated with 8 glasses of water!`,
        career: `Looking at your career goals, I recommend:\n\n1. **Focus on skill development** — Pick one key skill to improve this week\n2. **Network** — Connect with 3 professionals in your industry\n3. **Build projects** — Apply what you're learning\n\nConsistency is key!`,
        plan: `Here's an optimized day plan:\n\n⏰ **7:00** — Morning routine + meditation\n📚 **8:00** — Deep learning block (2 hrs)\n💼 **10:00** — Work tasks (high priority first)\n🥗 **12:30** — Lunch & walk\n💻 **14:00** — Deep work block\n🏋️ **16:00** — Workout (45 min)\n📖 **17:30** — Reading time\n📝 **19:00** — Journal & plan tomorrow`,
      };
      const lower = text.toLowerCase();
      let response = "I'm your AI life coach! I can help with diet, workout, career, and productivity tips. What would you like to work on?";
      if (lower.includes("eat") || lower.includes("diet") || lower.includes("food")) response = fallbackResponses.eat;
      else if (lower.includes("career") || lower.includes("job") || lower.includes("skill")) response = fallbackResponses.career;
      else if (lower.includes("plan") || lower.includes("day") || lower.includes("schedule")) response = fallbackResponses.plan;

      setMessages(prev => [...prev, { id: Date.now() + 1, role: "assistant", content: response }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="shrink-0 mb-4">
        <h1 className="page-header">AI Life Coach</h1>
        <p className="page-subtitle mt-1">Your personal AI assistant for health, career & productivity</p>
      </motion.div>

      <div className="flex-1 overflow-auto space-y-4 pb-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === "user" ? "bg-primary text-primary-foreground" : "glass-card"
            }`}>
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full gradient-emerald">
                    <Sparkles className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">LifeOS AI</span>
                </div>
              )}
              <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass-card rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full gradient-emerald">
                  <Sparkles className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="text-xs text-muted-foreground animate-pulse">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="flex gap-2 mb-3 shrink-0 flex-wrap">
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => sendMessage(s.label)}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <s.icon className="h-3.5 w-3.5 text-primary" />
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="shrink-0 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask your AI coach anything..."
          disabled={isLoading}
          className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={isLoading}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
