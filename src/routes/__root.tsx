import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl text-foreground">404</h1>
        <h2 className="mt-4 font-serif text-2xl text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NyayaLens" },
      {
        name: "description",
        content:
          "AI-powered IP protection for Indian artisans. Register your work, detect copies, and generate legal complaints in minutes.",
      },
      { name: "author", content: "NyayaLens" },
      { property: "og:title", content: "NyayaLens" },
      {
        property: "og:description",
        content: "AI-powered IP protection for Indian artisans.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "NyayaLens" },
      { name: "description", content: "Artisan Shield protects artisan creations with AI-powered digital proof, copy detection, and automated legal complaints." },
      { property: "og:description", content: "Artisan Shield protects artisan creations with AI-powered digital proof, copy detection, and automated legal complaints." },
      { name: "twitter:description", content: "Artisan Shield protects artisan creations with AI-powered digital proof, copy detection, and automated legal complaints." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/483cfd2a-2fa5-446f-a738-840e811e1f26/id-preview-cf4d4dd6--1b5f41b9-d1ca-4acd-b8c4-61fa2b9f90df.lovable.app-1777394503962.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/483cfd2a-2fa5-446f-a738-840e811e1f26/id-preview-cf4d4dd6--1b5f41b9-d1ca-4acd-b8c4-61fa2b9f90df.lovable.app-1777394503962.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster richColors position="top-center" />
    </AuthProvider>
  );
}
