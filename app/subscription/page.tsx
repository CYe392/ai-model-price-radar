import type { Metadata } from "next";
import { ProductShell } from "../product-shell";
import { SubscriptionManager } from "./subscription-manager";

export const metadata: Metadata = {
  title: "Manage email subscription",
  description: "Manage or delete a ModelScope email subscription.",
  robots: { index: false, follow: false },
};

export default function SubscriptionPage() {
  return (
    <ProductShell
      eyebrow="EMAIL PREFERENCES"
      title="Your inbox, your control."
      lede="Use the private link from a ModelScope email to update market and language preferences, unsubscribe, or permanently remove the subscription record."
    >
      <SubscriptionManager />
    </ProductShell>
  );
}
