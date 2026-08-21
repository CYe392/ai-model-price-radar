export function getNewsletterRuntimeReadiness(
  bindings: Record<string, string | undefined> = {},
) {
  const deliveryReady = Boolean(bindings.RESEND_API_KEY && bindings.NEWSLETTER_FROM);
  const webhookReady = Boolean(bindings.RESEND_WEBHOOK_SECRET);
  const operationsReady = Boolean(bindings.NEWSLETTER_ADMIN_TOKEN);
  const configured = [
    bindings.RESEND_API_KEY,
    bindings.NEWSLETTER_FROM,
    bindings.RESEND_WEBHOOK_SECRET,
    bindings.NEWSLETTER_ADMIN_TOKEN,
  ].filter(Boolean).length;

  return {
    status: deliveryReady && webhookReady && operationsReady
      ? "operational" as const
      : "awaiting_configuration" as const,
    optional: true,
    configured,
    required: 4,
    delivery_ready: deliveryReady,
    webhook_ready: webhookReady,
    operations_ready: operationsReady,
  };
}
