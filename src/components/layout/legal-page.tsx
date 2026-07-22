import type { ReactNode } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

interface LegalPageProps {
  title: string;
  description: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPage({
  title,
  description,
  lastUpdated,
  children,
}: LegalPageProps) {
  return (
    <>
      <SiteHeader showAuthLinks />
      <main className="flex flex-1 flex-col">
        <PageContainer className="max-w-3xl space-y-8 py-12 sm:py-16">
          <header className="space-y-3 border-b pb-8">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="text-muted-foreground">{description}</p>
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </header>
          <div className="space-y-8 text-sm leading-relaxed text-muted-foreground sm:text-base [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:mt-1.5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_p]:leading-relaxed [&_section]:space-y-3 [&_strong]:font-medium [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
            {children}
          </div>
        </PageContainer>
        <SiteFooter />
      </main>
    </>
  );
}
