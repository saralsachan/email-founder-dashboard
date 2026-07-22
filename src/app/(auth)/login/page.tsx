import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { SiteHeader } from "@/components/layout/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LoginButton } from "./login-button";

const ERROR_MESSAGES: Record<string, string> = {
  auth_failed: "Sign-in failed. Please try again.",
  missing_code: "Authentication was interrupted. Please try again.",
  profile_failed:
    "Could not save your profile. Check that the database migration has been applied.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params.error ? ERROR_MESSAGES[params.error] : null;

  return (
    <>
      <SiteHeader
        actions={
          <Link
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            href="/"
          >
            Back to home
          </Link>
        }
      />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <PageContainer className="py-0" narrow>
          <div className="mb-8 space-y-3 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              Your morning briefing
            </h1>
            <p className="text-muted-foreground">
              Connect Gmail read-only to see revenue, urgent issues, and what
              needs your reply.
            </p>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="space-y-1 border-b pb-4">
              <CardTitle className="text-xl">Sign in with Google</CardTitle>
              <CardDescription className="leading-relaxed">
                We only request read-only Gmail access. We never send email on
                your behalf.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {errorMessage && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                  {errorMessage}
                </p>
              )}
              <LoginButton />
            </CardContent>
          </Card>
        </PageContainer>
      </main>
    </>
  );
}
