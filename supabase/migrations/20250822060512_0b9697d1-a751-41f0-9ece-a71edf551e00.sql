-- Allow anonymous sessions (no auth) to manage public campaigns (user_id IS NULL)
-- This enables saving/scheduling campaigns before we wire up authentication.

-- SELECT
CREATE POLICY IF NOT EXISTS "Anon can view public campaigns"
ON public.campaigns
FOR SELECT
USING (auth.uid() IS NULL AND user_id IS NULL);

-- INSERT
CREATE POLICY IF NOT EXISTS "Anon can create public campaigns"
ON public.campaigns
FOR INSERT
WITH CHECK (auth.uid() IS NULL AND user_id IS NULL);

-- UPDATE
CREATE POLICY IF NOT EXISTS "Anon can update public campaigns"
ON public.campaigns
FOR UPDATE
USING (auth.uid() IS NULL AND user_id IS NULL);

-- DELETE
CREATE POLICY IF NOT EXISTS "Anon can delete public campaigns"
ON public.campaigns
FOR DELETE
USING (auth.uid() IS NULL AND user_id IS NULL);
