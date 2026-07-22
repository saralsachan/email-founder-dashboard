import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/refund", label: "Refund Policy" },
  { href: "/faq", label: "FAQs" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t px-4 py-10 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="font-semibold tracking-tight">Founder Dashboard</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Gmail read-only · Synced every 15 minutes · No auto-send
            </p>
          </div>
          <nav
            aria-label="Legal"
            className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-4"
          >
            {FOOTER_LINKS.map((link) => (
              <Link
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Founder Dashboard. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
