import { motion } from "framer-motion";
import { Bot, Send, Sparkles, Heart, Briefcase, Zap } from "lucide-react";
import { useState } from "react";

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

const mockResponses: Record<string, string> = {
  default: "I'm your AI life coach! I can help with diet plans, workout recommendations, career guidance, and productivity tips. What would you like to work on today?",
  eat: "Based on your health profile and goals, here's what I recommend for today:\n\n🥣 **Breakfast**: Overnight oats with chia seeds, berries, and almond butter (380 cal)\n\n🥗 **Lunch**: Grilled chicken breast with quinoa and roasted vegetables (520 cal)\n\n🍎 **Snack**: Greek yogurt with walnuts and honey (220 cal)\n\n🐟 **Dinner**: Baked salmon with sweet potato and steamed broccoli (580 cal)\n\nThis gives you ~1,700 calories with a good macro balance. Stay hydrated with 8 glasses of water!",
  career: "Looking at your career profile, here are my top recommendations:\n\n1. **Continue ML coursework** — You're in Stage 3 of your roadmap. Focus on completing the supervised learning module this week.\n\n2. **Build a portfolio project** — Start a small data science project on Kaggle to practice.\n\n3. **Network** — Connect with 3 data scientists on LinkedIn this week.\n\n4. **Skill gap** — Your AWS skills are at 55%. Consider taking an introductory cloud course.\n\nWould you like me to create a detailed weekly plan?",
  plan: "Here's an optimized day plan based on your habits and goals:\n\n⏰ **7:00** — Morning routine + meditation (15 min)\n📚 **8:00** — Deep learning: ML coursework (2 hrs)\n☕ **10:00** — Break + healthy snack\n💼 **10:30** — Work tasks (high priority first)\n🥗 **12:30** — Lunch break + walk\n💻 **14:00** — Deep work block\n🏋️ **16:00** — Workout (45 min)\n📖 **17:30** — Reading time (30 min)\n🧘 **18:30** — Evening meditation\n📝 **19:00** — Journal & plan tomorrow\n\nThis schedule maximizes your energy peaks. Want me to adjust anything?",
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", content: "Hi Alex! 👋 I'm your AI life coach. I can help you with diet, fitness, career planning, and productivity. What can I help you with today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      let response = mockResponses.default;
      const lower = text.toLowerCase();
      if (lower.includes("eat") || lower.includes("diet") || lower.includes("food") || lower.includes("meal")) response = mockResponses.eat;
      else if (lower.includes("career") || lower.includes("job") || lower.includes("skill")) response = mockResponses.career;
      else if (lower.includes("plan") || lower.includes("day") || lower.includes("schedule")) response = mockResponses.plan;

      setMessages(prev => [...prev, { id: Date.now() + 1, role: "assistant", content: response }]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="shrink-0 mb-4">
        <h1 className="page-header">AI Life Coach</h1>
        <p className="page-subtitle mt-1">Your personal AI assistant for health, career & productivity</p>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 overflow-auto space-y-4 pb-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground"
                : "glass-card"
            }`}>
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full gradient-emerald">
                    <Sparkles className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">LifeOS AI</span>
                </div>
              )}
              <div className="text-sm whitespace-pre-line leading-relaxed">
                {msg.content.split("**").map((part, i) =>
                  i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex gap-2 mb-3 shrink-0">
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

      {/* Input */}
      <div className="shrink-0 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Ask your AI coach anything..."
          className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={() => sendMessage(input)}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
