DROP POLICY "Anyone can create skies" ON public.skies;

CREATE POLICY "Anyone can create skies" ON public.skies
FOR INSERT
WITH CHECK (
  length(sky_name) <= 120
  AND length(letter_to) <= 120
  AND length(letter_from) <= 120
  AND length(letter_body) <= 5000
  AND length(share_id) <= 16
  AND (music_url IS NULL OR length(music_url) <= 500)
);