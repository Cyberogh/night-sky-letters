CREATE TABLE public.skies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  share_id TEXT NOT NULL UNIQUE,
  sky_name TEXT NOT NULL DEFAULT 'a sky for you',
  theme TEXT NOT NULL DEFAULT 'quiet-night',
  constellations JSONB NOT NULL DEFAULT '[]'::jsonb,
  letter_to TEXT NOT NULL DEFAULT '',
  letter_body TEXT NOT NULL DEFAULT '',
  letter_from TEXT NOT NULL DEFAULT '',
  music_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_skies_share_id ON public.skies(share_id);

ALTER TABLE public.skies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skies" ON public.skies FOR SELECT USING (true);
CREATE POLICY "Anyone can create skies" ON public.skies FOR INSERT WITH CHECK (true);