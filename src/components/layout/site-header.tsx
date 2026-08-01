import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/layout/logo";
import { SiteShell } from "@/components/layout/site-shell";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  actions?: ReactNode;
  showAuthLinks?: boolean;
}

export function SiteHeader({ actions, showAuthLinks = false }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <SiteShell className="flex h-20 items-center justify-between gap-6">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-3">
          {actions}
          <ThemeToggle />
          {showAuthLinks && (
            <>
              <Link
                className={cn(buttonVariants({ variant: "ghost", size: "default" }))}
                href="/login"
              >
                Sign in
              </Link>
              <Link className={cn(buttonVariants({ size: "default" }))} href="/login">
                Get started
              </Link>
            </>
          )}
        </div>
      </SiteShell>
    </header>
  );
}
