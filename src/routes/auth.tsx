import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { t } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { user, lang } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) {
    nav({ to: "/" });
    return null;
  }

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
      options: {
        emailRedirectTo: window.location.origin,
        data: { name },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t(lang, "accountCreated"));
    nav({ to: "/onboarding" });
  };

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(t(lang, "welcomeBack"));
    nav({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="mx-auto flex max-w-md flex-col px-4 pt-12">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl text-foreground">{t(lang, "welcomeNyayaLens")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t(lang, "authSubtitle")}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">{t(lang, "signUp")}</TabsTrigger>
              <TabsTrigger value="signin">{t(lang, "signIn")}</TabsTrigger>
            </TabsList>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="name">{t(lang, "name")}</Label>
                  <Input
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sita Devi"
                  />
                </div>
                <div>
                  <Label htmlFor="email-up">{t(lang, "email")}</Label>
                  <Input
                    id="email-up"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="pw-up">{t(lang, "password")}</Label>
                  <Input
                    id="pw-up"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={busy}>
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t(lang, "createAccount")}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="email-in">{t(lang, "email")}</Label>
                  <Input
                    id="email-in"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="pw-in">{t(lang, "password")}</Label>
                  <Input
                    id="pw-in"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={busy}>
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t(lang, "signIn")}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
