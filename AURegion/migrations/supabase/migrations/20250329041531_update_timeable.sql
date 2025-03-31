-- Add timezone column to existing timetable
ALTER TABLE public.timetable
ADD COLUMN timezone TEXT NOT NULL DEFAULT 'UTC';