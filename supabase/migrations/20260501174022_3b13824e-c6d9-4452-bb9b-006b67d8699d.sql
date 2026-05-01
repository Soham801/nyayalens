CREATE TABLE public.phone_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL UNIQUE,
  pin_hash TEXT NOT NULL,
  pin_salt TEXT NOT NULL,
  user_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.phone_credentials ENABLE ROW LEVEL SECURITY;

-- No client policies: only service role (which bypasses RLS) can read/write.

CREATE INDEX idx_phone_credentials_phone ON public.phone_credentials(phone);