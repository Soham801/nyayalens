// Phone + 6-digit PIN authentication (no SMS)
// - signup: creates an auth user (synthetic email), stores hashed PIN, returns session
// - signin: verifies PIN, returns session
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function normalizePhone(p: string): string {
  // strip everything except digits, keep last 10–13 digits
  const d = p.replace(/\D+/g, "");
  return d;
}

function syntheticEmail(phone: string): string {
  return `phone_${phone}@phone.nyayalens.local`;
}

function syntheticPassword(phone: string, pin: string): string {
  // Deterministic password used purely as a Supabase Auth credential.
  // The real secret is the user's PIN; we still hash it ourselves on top
  // for defense in depth before storing in phone_credentials.
  return `nyl::${phone}::${pin}::v1`;
}

async function hashPin(pin: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}::${pin}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomSalt(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { action, phone, pin, name, language } = await req.json();
    if (!action || !phone || !pin) {
      return json({ error: "Missing fields" }, 400);
    }
    const ph = normalizePhone(phone);
    if (ph.length < 8) return json({ error: "Invalid phone number" }, 400);
    if (!/^\d{6}$/.test(pin)) return json({ error: "PIN must be 6 digits" }, 400);

    const email = syntheticEmail(ph);
    const password = syntheticPassword(ph, pin);

    if (action === "signup") {
      // Check if phone already registered
      const { data: existing } = await admin
        .from("phone_credentials")
        .select("id")
        .eq("phone", ph)
        .maybeSingle();
      if (existing) return json({ error: "Phone already registered. Please sign in." }, 400);

      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name: name || `User ${ph.slice(-4)}`, phone: ph, language: language || "en" },
      });
      if (createErr || !created.user) return json({ error: createErr?.message || "Signup failed" }, 400);

      const salt = randomSalt();
      const pin_hash = await hashPin(pin, salt);
      const { error: credErr } = await admin.from("phone_credentials").insert({
        phone: ph,
        pin_hash,
        pin_salt: salt,
        user_id: created.user.id,
      });
      if (credErr) {
        // Rollback the auth user so the phone can be re-used
        await admin.auth.admin.deleteUser(created.user.id);
        return json({ error: credErr.message }, 400);
      }

      // Ensure profile row exists with name + language
      await admin
        .from("profiles")
        .upsert(
          { id: created.user.id, name: name || `User ${ph.slice(-4)}`, language: language || "en" },
          { onConflict: "id" },
        );

      return json({ email, password });
    }

    if (action === "signin") {
      const { data: cred } = await admin
        .from("phone_credentials")
        .select("pin_hash, pin_salt")
        .eq("phone", ph)
        .maybeSingle();
      if (!cred) return json({ error: "Phone not registered" }, 404);
      const expected = await hashPin(pin, cred.pin_salt);
      if (expected !== cred.pin_hash) return json({ error: "Incorrect PIN" }, 401);
      return json({ email, password });
    }

    if (action === "reset_pin") {
      // For demo: allow PIN reset if user knows current PIN OR if "demo_reset" flag is set.
      const { newPin, currentPin } = await req.json().catch(() => ({}));
      if (!newPin || !/^\d{6}$/.test(newPin)) return json({ error: "New PIN must be 6 digits" }, 400);
      const { data: cred } = await admin
        .from("phone_credentials")
        .select("pin_hash, pin_salt, user_id")
        .eq("phone", ph)
        .maybeSingle();
      if (!cred) return json({ error: "Phone not registered" }, 404);
      const expected = await hashPin(currentPin || "", cred.pin_salt);
      if (expected !== cred.pin_hash) return json({ error: "Incorrect current PIN" }, 401);
      const salt = randomSalt();
      const pin_hash = await hashPin(newPin, salt);
      const newPassword = syntheticPassword(ph, newPin);
      await admin.auth.admin.updateUserById(cred.user_id, { password: newPassword });
      await admin
        .from("phone_credentials")
        .update({ pin_hash, pin_salt: salt, updated_at: new Date().toISOString() })
        .eq("phone", ph);
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
}
