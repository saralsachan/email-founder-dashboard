import type { EmailCategory, PaymentProvider, RevenueEventType, UrgentSubcategory } from "@/types/database";

export interface ParsedMessage {
  gmailMessageId: string;
  threadId: string;
  sender: string;
  subject: string;
  snippet: string;
  body: string;
  receivedAt: Date;
  headers: Record<string, string>;
}

export interface RevenueParseResult {
  type: RevenueEventType;
  amount: number;
  currency: string;
  provider: PaymentProvider;
}

export interface UrgentClassification {
  urgent: boolean;
  category: UrgentSubcategory | null;
  confidence: number | null;
}

export interface MessageClassification {
  category: EmailCategory;
  urgentSubcategory?: UrgentSubcategory | null;
  confidence?: number | null;
  revenue?: RevenueParseResult;
}

export interface SyncResult {
  userId: string;
  messagesProcessed: number;
  lastSyncedAt: string;
  lastHistoryId: string;
}
