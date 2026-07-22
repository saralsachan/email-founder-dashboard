"use client";

import { Copy, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { gmailThreadUrl } from "@/lib/dashboard/format";
import { cn } from "@/lib/utils";

interface DraftReplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emailId?: string;
  threadId?: string;
  type?: "urgent" | "waiting";
  subject: string;
}

export function DraftReplyDialog({
  open,
  onOpenChange,
  emailId,
  threadId,
  type = "urgent",
  subject,
}: DraftReplyDialogProps) {
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function loadDraft() {
    if (draft || loading) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          emailId ? { emailId } : { threadId, type },
        ),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Failed to generate draft");
      }

      setDraft(data.draft);
    } catch (draftError) {
      setError(
        draftError instanceof Error
          ? draftError.message
          : "Failed to generate draft",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      void loadDraft();
    } else {
      setDraft("");
      setError(null);
      setCopied(false);
    }
    onOpenChange(nextOpen);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle>Draft reply</DialogTitle>
          <DialogDescription className="line-clamp-2">{subject}</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-5 py-4">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
              <Loader2 className="animate-spin" />
              Generating draft…
            </div>
          )}

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              {error}
            </p>
          )}

          {!loading && !error && (
            <Textarea
              className="min-h-44 resize-y bg-muted/30"
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Your draft will appear here…"
              value={draft}
            />
          )}
        </div>

        <DialogFooter className="flex-row gap-2 border-t bg-muted/50 px-5 py-4 sm:justify-end">
          {threadId && (
            <a
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mr-auto",
              )}
              href={gmailThreadUrl(threadId)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ExternalLink />
              Open in Gmail
            </a>
          )}
          <Button disabled={!draft} onClick={() => void handleCopy()} size="sm">
            <Copy />
            {copied ? "Copied" : "Copy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
