import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useDailyHealthLogs(days = 7) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["daily_health_logs", user?.id, days],
    queryFn: async () => {
      if (!user) return [];
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      const { data, error } = await supabase
        .from("daily_health_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("log_date", fromDate.toISOString().split("T")[0])
        .order("log_date", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useTodayHealthLog() {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];
  return useQuery({
    queryKey: ["today_health_log", user?.id, today],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("daily_health_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("log_date", today)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useUpsertHealthLog() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (log: Record<string, any>) => {
      if (!user) throw new Error("Not authenticated");
      const today = new Date().toISOString().split("T")[0];
      const { error } = await supabase
        .from("daily_health_logs")
        .upsert({ user_id: user.id, log_date: today, ...log }, { onConflict: "user_id,log_date" });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["today_health_log"] });
      qc.invalidateQueries({ queryKey: ["daily_health_logs"] });
    },
  });
}

export function useTodayMoodLog() {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];
  return useQuery({
    queryKey: ["today_mood_log", user?.id, today],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("daily_mood_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("log_date", today)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useUpsertMoodLog() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (log: Record<string, any>) => {
      if (!user) throw new Error("Not authenticated");
      const today = new Date().toISOString().split("T")[0];
      const { error } = await supabase
        .from("daily_mood_logs")
        .upsert({ user_id: user.id, log_date: today, ...log }, { onConflict: "user_id,log_date" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["today_mood_log"] }),
  });
}

export function useTasks() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["tasks", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useCreateTask() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (task: { title: string; priority?: string; category?: string; due_date?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("tasks").insert({ user_id: user.id, ...task });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useToggleTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from("tasks")
        .update({ completed, completed_at: completed ? new Date().toISOString() : null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useHabits() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["habits", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id)
        .eq("active", true)
        .order("created_at");
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useHabitLogs(days = 7) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["habit_logs", user?.id, days],
    queryFn: async () => {
      if (!user) return [];
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      const { data, error } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("log_date", fromDate.toISOString().split("T")[0]);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useCreateHabit() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (habit: { name: string; icon?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("habits").insert({ user_id: user.id, ...habit });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habits"] }),
  });
}

export function useToggleHabitLog() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ habitId, completed }: { habitId: string; completed: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      const today = new Date().toISOString().split("T")[0];
      if (completed) {
        const { error } = await supabase
          .from("habit_logs")
          .upsert({ user_id: user.id, habit_id: habitId, log_date: today, completed: true }, { onConflict: "habit_id,log_date" });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("habit_logs")
          .update({ completed: false })
          .eq("habit_id", habitId)
          .eq("log_date", today);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habit_logs"] }),
  });
}

export function useGoals() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["goals", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useUserXP() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user_xp", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("user_xp")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useUserAchievements() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["user_achievements", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_achievements")
        .select("*")
        .eq("user_id", user.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useDailyCareerLogs(days = 7) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["daily_career_logs", user?.id, days],
    queryFn: async () => {
      if (!user) return [];
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      const { data, error } = await supabase
        .from("daily_career_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("log_date", fromDate.toISOString().split("T")[0])
        .order("log_date", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useDailyProductivityLogs(days = 7) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["daily_productivity_logs", user?.id, days],
    queryFn: async () => {
      if (!user) return [];
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - days);
      const { data, error } = await supabase
        .from("daily_productivity_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("log_date", fromDate.toISOString().split("T")[0])
        .order("log_date", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}
