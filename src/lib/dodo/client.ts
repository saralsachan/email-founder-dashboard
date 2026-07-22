import DodoPayments from "dodopayments";

export function createDodoClient() {
  const bearerToken = process.env.DODO_PAYMENTS_API_KEY;
  if (!bearerToken) {
    throw new Error("DODO_PAYMENTS_API_KEY is not set");
  }

  const environment =
    process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
      ? "live_mode"
      : "test_mode";

  return new DodoPayments({ bearerToken, environment });
}

export function getDodoProductId(): string {
  const productId = process.env.DODO_PRODUCT_ID;
  if (!productId) {
    throw new Error("DODO_PRODUCT_ID is not set");
  }
  return productId;
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
