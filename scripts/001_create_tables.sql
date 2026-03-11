-- ContentReel Database Schema
-- Users profile table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 100,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  keyword TEXT,
  script TEXT,
  voiceover_url TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  aspect_ratio TEXT DEFAULT '9:16',
  duration INTEGER,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Video scenes table
CREATE TABLE IF NOT EXISTS public.video_scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  scene_order INTEGER NOT NULL,
  text TEXT,
  media_url TEXT,
  media_type TEXT DEFAULT 'image',
  duration INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_scenes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "projects_select_own" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "projects_insert_own" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "projects_update_own" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "projects_delete_own" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Videos policies
CREATE POLICY "videos_select_own" ON public.videos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "videos_insert_own" ON public.videos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "videos_update_own" ON public.videos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "videos_delete_own" ON public.videos FOR DELETE USING (auth.uid() = user_id);

-- Video scenes policies
CREATE POLICY "scenes_select_own" ON public.video_scenes FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.videos WHERE videos.id = video_scenes.video_id AND videos.user_id = auth.uid()));
CREATE POLICY "scenes_insert_own" ON public.video_scenes FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.videos WHERE videos.id = video_scenes.video_id AND videos.user_id = auth.uid()));
CREATE POLICY "scenes_update_own" ON public.video_scenes FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM public.videos WHERE videos.id = video_scenes.video_id AND videos.user_id = auth.uid()));
CREATE POLICY "scenes_delete_own" ON public.video_scenes FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.videos WHERE videos.id = video_scenes.video_id AND videos.user_id = auth.uid()));
