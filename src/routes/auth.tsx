import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Phone, Mail, ArrowLeft, ChevronRight } from "lucide-react";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

type Mode = "choose" | "phone-signin" | "phone-signup" | "email";

function AuthPage() {
  const { user, lang } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<Mode>("choose");

  if (user) {
    nav({ to: "/" });
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="mx-auto flex max-w-md flex-col px-4 pt-8 pb-16">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-3xl text-foreground sm:text-4xl">
            {t(lang, "signInTitle")}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">{t(lang, "authSubtitle")}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
          {mode === "choose" && <ChooseStep onPick={setMode} />}
          {mode === "phone-signin" && <PhoneSignIn onBack={() => setMode("choose")} onSwitch={() => setMode("phone-signup")} />}
          {mode === "phone-signup" && <PhoneSignUp onBack={() => setMode("choose")} onSwitch={() => setMode("phone-signin")} />}
          {mode === "email" && <EmailFlow onBack={() => setMode("choose")} />}
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">{t(lang, "byContinuing")}</p>
      </main>
    </div>
  );
}

/* ---------------- CHOOSE ---------------- */
function ChooseStep({ onPick }: { onPick: (m: Mode) => void }) {
  const { lang } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message || "Google sign-in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
  };

  return (
    <div className="space-y-3">
      <p className="mb-2 text-center text-sm text-muted-foreground">{t(lang, "chooseHowToSignIn")}</p>

      <Button
        type="button"
        size="lg"
        variant="outline"
        className="h-14 w-full justify-between text-base"
        onClick={handleGoogle}
        disabled={busy}
      >
        <span className="flex items-center gap-3">
          <GoogleIcon />
          {t(lang, "continueWithGoogle")}
        </span>
        <ChevronRight className="h-5 w-5 opacity-50" />
      </Button>

      <Button
        type="button"
        size="lg"
        className="h-14 w-full justify-between text-base"
        onClick={() => onPick("phone-signup")}
      >
        <span className="flex items-center gap-3">
          <Phone className="h-5 w-5" />
          {t(lang, "usePhoneNumber")}
        </span>
        <ChevronRight className="h-5 w-5 opacity-70" />
      </Button>

      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {t(lang, "orDivider")}
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        size="lg"
        variant="ghost"
        className="h-12 w-full justify-between text-sm"
        onClick={() => onPick("email")}
      >
        <span className="flex items-center gap-3">
          <Mail className="h-4 w-4" />
          {t(lang, "emailOption")}
        </span>
        <ChevronRight className="h-4 w-4 opacity-50" />
      </Button>
    </div>
  );
}

/* ---------------- PHONE: SIGN UP ---------------- */
function PhoneSignUp({ onBack, onSwitch }: { onBack: () => void; onSwitch: () => void }) {
  const { lang } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{10,13}$/.test(phone.replace(/\D/g, ""))) {
      toast.error(t(lang, "invalidPhone"));
      return;
    }
    if (!/^\d{6}$/.test(pin)) {
      toast.error(t(lang, "invalidPin"));
      return;
    }
    if (pin !== pin2) {
      toast.error(t(lang, "pinMismatch"));
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("phone-auth", {
      body: { action: "signup", phone, pin, name, language: lang },
    });
    if (error || data?.error) {
      toast.error(data?.error || error?.message || "Signup failed");
      setBusy(false);
      return;
    }
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setBusy(false);
    if (signInErr) {
      toast.error(signInErr.message);
      return;
    }
    toast.success(t(lang, "phoneSignupSuccess"));
    nav({ to: "/onboarding" });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <BackRow onBack={onBack} />
      <div>
        <Label htmlFor="pname" className="text-base">{t(lang, "name")}</Label>
        <Input id="pname" required value={name} onChange={(e) => setName(e.target.value)} className="h-12 text-base" />
      </div>
      <div>
        <Label htmlFor="phone" className="text-base">{t(lang, "phoneNumber")}</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="numeric"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t(lang, "phonePlaceholder")}
          className="h-12 text-base tracking-wider"
        />
      </div>
      <div>
        <Label htmlFor="pin" className="text-base">{t(lang, "pin")}</Label>
        <Input
          id="pin"
          type="password"
          inputMode="numeric"
          maxLength={6}
          pattern="\d{6}"
          required
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          className="h-12 text-center text-2xl tracking-[0.5em]"
        />
        <p className="mt-1 text-xs text-muted-foreground">{t(lang, "pinHint")}</p>
      </div>
      <div>
        <Label htmlFor="pin2" className="text-base">{t(lang, "confirmPin")}</Label>
        <Input
          id="pin2"
          type="password"
          inputMode="numeric"
          maxLength={6}
          required
          value={pin2}
          onChange={(e) => setPin2(e.target.value.replace(/\D/g, ""))}
          className="h-12 text-center text-2xl tracking-[0.5em]"
        />
      </div>
      <Button type="submit" size="lg" className="h-14 w-full text-base" disabled={busy}>
        {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {busy ? t(lang, "creatingAccount") : t(lang, "createAccount")}
      </Button>
      <button type="button" onClick={onSwitch} className="block w-full pt-1 text-center text-sm text-primary underline-offset-4 hover:underline">
        {t(lang, "haveAccount")}
      </button>
    </form>
  );
}

/* ---------------- PHONE: SIGN IN ---------------- */
function PhoneSignIn({ onBack, onSwitch }: { onBack: () => void; onSwitch: () => void }) {
  const { lang } = useAuth();
  const nav = useNavigate();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{10,13}$/.test(phone.replace(/\D/g, ""))) {
      toast.error(t(lang, "invalidPhone"));
      return;
    }
    if (!/^\d{6}$/.test(pin)) {
      toast.error(t(lang, "invalidPin"));
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.functions.invoke("phone-auth", {
      body: { action: "signin", phone, pin },
    });
    if (error || data?.error) {
      toast.error(data?.error || error?.message || "Sign-in failed");
      setBusy(false);
      return;
    }
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setBusy(false);
    if (signInErr) {
      toast.error(signInErr.message);
      return;
    }
    toast.success(t(lang, "phoneSigninSuccess"));
    nav({ to: "/" });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <BackRow onBack={onBack} />
      <div>
        <Label htmlFor="phone-in" className="text-base">{t(lang, "phoneNumber")}</Label>
        <Input
          id="phone-in"
          type="tel"
          inputMode="numeric"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t(lang, "phonePlaceholder")}
          className="h-12 text-base tracking-wider"
        />
      </div>
      <div>
        <Label htmlFor="pin-in" className="text-base">{t(lang, "enterPin")}</Label>
        <Input
          id="pin-in"
          type="password"
          inputMode="numeric"
          maxLength={6}
          required
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          className="h-12 text-center text-2xl tracking-[0.5em]"
        />
      </div>
      <Button type="submit" size="lg" className="h-14 w-full text-base" disabled={busy}>
        {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {busy ? t(lang, "signingIn") : t(lang, "signIn")}
      </Button>
      <button type="button" onClick={onSwitch} className="block w-full pt-1 text-center text-sm text-primary underline-offset-4 hover:underline">
        {t(lang, "newUser")}
      </button>
    </form>
  );
}

/* ---------------- EMAIL ---------------- */
function EmailFlow({ onBack }: { onBack: () => void }) {
  const { lang } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error(t(lang, "passwordMin"));
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin, data: { name } },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(t(lang, "accountCreated"));
    nav({ to: "/onboarding" });
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(t(lang, "welcomeBack"));
    nav({ to: "/" });
  };

  return (
    <div className="space-y-4">
      <BackRow onBack={onBack} />
      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant={tab === "signin" ? "default" : "outline"} onClick={() => setTab("signin")} className="h-10">
          {t(lang, "signIn")}
        </Button>
        <Button type="button" variant={tab === "signup" ? "default" : "outline"} onClick={() => setTab("signup")} className="h-10">
          {t(lang, "signUp")}
        </Button>
      </div>

      {tab === "signup" ? (
        <form onSubmit={handleSignUp} className="space-y-3">
          <div>
            <Label htmlFor="ename">{t(lang, "name")}</Label>
            <Input id="ename" required value={name} onChange={(e) => setName(e.target.value)} className="h-11" />
          </div>
          <div>
            <Label htmlFor="eemail-up">{t(lang, "email")}</Label>
            <Input id="eemail-up" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
          </div>
          <div>
            <Label htmlFor="epw-up">{t(lang, "password")}</Label>
            <Input id="epw-up" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" />
          </div>
          <Button type="submit" className="h-12 w-full" disabled={busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t(lang, "createAccount")}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSignIn} className="space-y-3">
          <div>
            <Label htmlFor="eemail-in">{t(lang, "email")}</Label>
            <Input id="eemail-in" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
          </div>
          <div>
            <Label htmlFor="epw-in">{t(lang, "password")}</Label>
            <Input id="epw-in" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" />
          </div>
          <Button type="submit" className="h-12 w-full" disabled={busy}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t(lang, "signIn")}
          </Button>
        </form>
      )}
    </div>
  );
}

function BackRow({ onBack }: { onBack: () => void }) {
  const { lang } = useAuth();
  return (
    <button
      type="button"
      onClick={onBack}
      className="-ml-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      {t(lang, "back")}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.92h5.49c-.24 1.4-1.66 4.1-5.49 4.1-3.31 0-6-2.74-6-6.12s2.69-6.12 6-6.12c1.88 0 3.14.8 3.86 1.49l2.64-2.54C16.97 3.4 14.71 2.4 12 2.4 6.86 2.4 2.7 6.55 2.7 12s4.16 9.6 9.3 9.6c5.37 0 8.92-3.78 8.92-9.1 0-.61-.07-1.07-.16-1.5H12z" />
    </svg>
  );
}
