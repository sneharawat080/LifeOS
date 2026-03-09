export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      career_profiles: {
        Row: {
          career_goals: string[] | null
          created_at: string
          education_level: string | null
          id: string
          industry: string | null
          profession: string | null
          resume_extracted_data: Json | null
          resume_url: string | null
          skills: string[] | null
          tools_known: string[] | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          career_goals?: string[] | null
          created_at?: string
          education_level?: string | null
          id?: string
          industry?: string | null
          profession?: string | null
          resume_extracted_data?: Json | null
          resume_url?: string | null
          skills?: string[] | null
          tools_known?: string[] | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          career_goals?: string[] | null
          created_at?: string
          education_level?: string | null
          id?: string
          industry?: string | null
          profession?: string | null
          resume_extracted_data?: Json | null
          resume_url?: string | null
          skills?: string[] | null
          tools_known?: string[] | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      daily_career_logs: {
        Row: {
          created_at: string
          id: string
          learning_hours: number | null
          log_date: string
          notes: string | null
          projects_worked: string[] | null
          skills_studied: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          learning_hours?: number | null
          log_date?: string
          notes?: string | null
          projects_worked?: string[] | null
          skills_studied?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          learning_hours?: number | null
          log_date?: string
          notes?: string | null
          projects_worked?: string[] | null
          skills_studied?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      daily_health_logs: {
        Row: {
          calories_burned: number | null
          calories_consumed: number | null
          created_at: string
          exercise_minutes: number | null
          exercise_type: string | null
          id: string
          log_date: string
          sleep_hours: number | null
          steps: number | null
          updated_at: string
          user_id: string
          water_glasses: number | null
          weight_kg: number | null
        }
        Insert: {
          calories_burned?: number | null
          calories_consumed?: number | null
          created_at?: string
          exercise_minutes?: number | null
          exercise_type?: string | null
          id?: string
          log_date?: string
          sleep_hours?: number | null
          steps?: number | null
          updated_at?: string
          user_id: string
          water_glasses?: number | null
          weight_kg?: number | null
        }
        Update: {
          calories_burned?: number | null
          calories_consumed?: number | null
          created_at?: string
          exercise_minutes?: number | null
          exercise_type?: string | null
          id?: string
          log_date?: string
          sleep_hours?: number | null
          steps?: number | null
          updated_at?: string
          user_id?: string
          water_glasses?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      daily_mood_logs: {
        Row: {
          created_at: string
          energy_level: number | null
          id: string
          log_date: string
          mood: string | null
          notes: string | null
          stress_level: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          energy_level?: number | null
          id?: string
          log_date?: string
          mood?: string | null
          notes?: string | null
          stress_level?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          energy_level?: number | null
          id?: string
          log_date?: string
          mood?: string | null
          notes?: string | null
          stress_level?: number | null
          user_id?: string
        }
        Relationships: []
      }
      daily_productivity_logs: {
        Row: {
          created_at: string
          focus_hours: number | null
          habits_completed: number | null
          id: string
          log_date: string
          productivity_score: number | null
          tasks_completed: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          focus_hours?: number | null
          habits_completed?: number | null
          id?: string
          log_date?: string
          productivity_score?: number | null
          tasks_completed?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          focus_hours?: number | null
          habits_completed?: number | null
          id?: string
          log_date?: string
          productivity_score?: number | null
          tasks_completed?: number | null
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          category: string | null
          completed: boolean
          created_at: string
          current_value: number | null
          deadline: string | null
          description: string | null
          id: string
          target_value: number | null
          title: string
          unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          completed?: boolean
          created_at?: string
          current_value?: number | null
          deadline?: string | null
          description?: string | null
          id?: string
          target_value?: number | null
          title: string
          unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          completed?: boolean
          created_at?: string
          current_value?: number | null
          deadline?: string | null
          description?: string | null
          id?: string
          target_value?: number | null
          title?: string
          unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_logs: {
        Row: {
          completed: boolean
          created_at: string
          habit_id: string
          id: string
          log_date: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          habit_id: string
          id?: string
          log_date?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          habit_id?: string
          id?: string
          log_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          active: boolean
          created_at: string
          icon: string | null
          id: string
          name: string
          target_per_day: number | null
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          target_per_day?: number | null
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          target_per_day?: number | null
          user_id?: string
        }
        Relationships: []
      }
      health_profiles: {
        Row: {
          activity_level: string | null
          allergies: string[] | null
          created_at: string
          current_weight: number | null
          diet_preference: string | null
          diseases: string[] | null
          exercise_frequency: string | null
          id: string
          medications: string[] | null
          sleep_hours: number | null
          stress_level: string | null
          target_weight: number | null
          updated_at: string
          user_id: string
          water_intake_goal: number | null
        }
        Insert: {
          activity_level?: string | null
          allergies?: string[] | null
          created_at?: string
          current_weight?: number | null
          diet_preference?: string | null
          diseases?: string[] | null
          exercise_frequency?: string | null
          id?: string
          medications?: string[] | null
          sleep_hours?: number | null
          stress_level?: string | null
          target_weight?: number | null
          updated_at?: string
          user_id: string
          water_intake_goal?: number | null
        }
        Update: {
          activity_level?: string | null
          allergies?: string[] | null
          created_at?: string
          current_weight?: number | null
          diet_preference?: string | null
          diseases?: string[] | null
          exercise_frequency?: string | null
          id?: string
          medications?: string[] | null
          sleep_hours?: number | null
          stress_level?: string | null
          target_weight?: number | null
          updated_at?: string
          user_id?: string
          water_intake_goal?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          bmi: number | null
          country: string | null
          created_at: string
          gender: string | null
          height_cm: number | null
          id: string
          name: string | null
          onboarding_completed: boolean
          updated_at: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          bmi?: number | null
          country?: string | null
          created_at?: string
          gender?: string | null
          height_cm?: number | null
          id?: string
          name?: string | null
          onboarding_completed?: boolean
          updated_at?: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          bmi?: number | null
          country?: string | null
          created_at?: string
          gender?: string | null
          height_cm?: number | null
          id?: string
          name?: string | null
          onboarding_completed?: boolean
          updated_at?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          category: string | null
          completed: boolean
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_key: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_key: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_key?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_xp: {
        Row: {
          created_at: string
          id: string
          level: number
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          level?: number
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
