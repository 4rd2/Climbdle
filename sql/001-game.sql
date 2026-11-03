CREATE TABLE IF NOT EXISTS crux_runs (
 user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
 day date NOT NULL,
 guesses jsonb NOT NULL DEFAULT '[]'::jsonb CHECK(jsonb_typeof(guesses)='array'),
 normalized_guesses jsonb NOT NULL DEFAULT '[]'::jsonb CHECK(jsonb_typeof(normalized_guesses)='array'),
 solved boolean NOT NULL DEFAULT false,
 completed_at timestamptz,
 PRIMARY KEY (user_id,day)
);
CREATE INDEX IF NOT EXISTS crux_daily_scores ON crux_runs(day,(jsonb_array_length(guesses)),completed_at) WHERE solved=true;
