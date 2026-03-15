
-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('resumes', 'resumes', false, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);

-- RLS policies for resumes bucket
CREATE POLICY "Users can upload own resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view own resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Add unique constraint for health_logs upsert if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'daily_health_logs_user_id_log_date_key'
  ) THEN
    ALTER TABLE public.daily_health_logs ADD CONSTRAINT daily_health_logs_user_id_log_date_key UNIQUE (user_id, log_date);
  END IF;
END $$;

-- Add unique constraint for mood_logs upsert if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'daily_mood_logs_user_id_log_date_key'
  ) THEN
    ALTER TABLE public.daily_mood_logs ADD CONSTRAINT daily_mood_logs_user_id_log_date_key UNIQUE (user_id, log_date);
  END IF;
END $$;

-- Add unique constraint for habit_logs if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'habit_logs_habit_id_log_date_key'
  ) THEN
    ALTER TABLE public.habit_logs ADD CONSTRAINT habit_logs_habit_id_log_date_key UNIQUE (habit_id, log_date);
  END IF;
END $$;
