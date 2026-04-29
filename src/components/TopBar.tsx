import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { t, LANGUAGES, getLanguageMeta, type Lang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { LogOut, Languages, Eye, Check, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export function TopBar() {
  const { user, profile, lang, setLang, signOut } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSignOut = async () => {
    await signOut();
    nav({ to: "/" });
  };

  const current = getLanguageMeta(lang);
  const filtered = LANGUAGES.filter((l) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );
  });

  const pickLang = (code: Lang) => {
    setLang(code);
    setOpen(false);
    setQuery("");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-terracotta shadow-warm">
            <Eye className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-xl text-foreground">{t(lang, "appName")}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {t(lang, "artisanProtection")}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Languages className="h-4 w-4" />
                <span className="text-xs font-medium">{current.nativeName}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-72 p-0" sideOffset={8}>
              <div className="border-b border-border p-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t(lang, "searchLanguage")}
                    className="w-full rounded-md border border-input bg-background py-1.5 pl-7 pr-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto p-1">
                {filtered.length === 0 ? (
                  <div className="p-3 text-center text-xs text-muted-foreground">
                    No language found
                  </div>
                ) : (
                  filtered.map((l) => {
                    const active = l.code === lang;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => pickLang(l.code)}
                        className={`flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm transition hover:bg-accent/40 ${
                          active ? "bg-accent/30" : ""
                        }`}
                      >
                        <span className="flex flex-col leading-tight">
                          <span className="font-medium text-foreground">{l.nativeName}</span>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {l.name}
                          </span>
                        </span>
                        {active && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    );
                  })
                )}
              </div>
            </PopoverContent>
          </Popover>

          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {profile?.name || user.email?.split("@")[0]}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1.5">
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t(lang, "signOut")}</span>
              </Button>
            </>
          ) : (
            <Button asChild size="sm">
              <Link to="/auth">{t(lang, "signIn")}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
