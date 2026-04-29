import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { t } from "@/lib/i18n";

const CRAFTS = [
  "Madhubani painting",
  "Pattachitra",
  "Warli art",
  "Kalamkari",
  "Tanjore painting",
  "Block printing",
  "Pottery",
  "Wood carving",
  "Metal craft",
  "Embroidery",
  "Weaving",
  "Jewelry making",
  "Other",
];

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const { user, profile, lang, setLang, refreshProfile, loading } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [craft, setCraft] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
    if (profile?.name) setName(profile.name);
    if (profile?.craft_type) setCraft(profile.craft_type);
  }, [loading, user, profile, nav]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name, craft_type: craft, language: lang })
      .eq("id", user.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refreshProfile();
    toast.success(t(lang, "profileSaved"));
    nav({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="mx-auto max-w-md px-4 pt-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl text-foreground">{t(lang, "onbTitle")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t(lang, "onbSubtitle")}</p>
        </div>

        <form
          onSubmit={submit}
          className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card"
        >
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
            <Label>{t(lang, "craftType")}</Label>
            <Select value={craft} onValueChange={setCraft} required>
              <SelectTrigger>
                <SelectValue placeholder={t(lang, "selectCraft")} />
              </SelectTrigger>
              <SelectContent>
                {CRAFTS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t(lang, "language")}</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              {t(lang, "searchLanguage")} — {t(lang, "language")}
            </p>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={busy || !name || !craft}>
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t(lang, "continue")}
          </Button>
        </form>
      </main>
    </div>
  );
}
