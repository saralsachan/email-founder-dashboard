import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  actions?: ReactNode;
  showAuthLinks?: boolean;
}

export function SiteHeader({ actions, showAuthLinks = false }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-1 sm:gap-2">
          {actions}
          <ThemeToggle />
          {showAuthLinks && (
            <>
              <Link
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                href="/login"
              >
                Sign in
              </Link>
              <Link className={cn(buttonVariants({ size: "sm" }))} href="/login">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
