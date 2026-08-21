ALTER TABLE `newsletter_deliveries` ADD `last_event_at` text;
--> statement-breakpoint
ALTER TABLE `newsletter_deliveries` ADD `attempt_count` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_newsletter_deliveries_provider_message`
ON `newsletter_deliveries` (`provider_message_id`)
WHERE `provider_message_id` IS NOT NULL;
--> statement-breakpoint
CREATE INDEX `idx_newsletter_deliveries_retry`
ON `newsletter_deliveries` (`status`, `attempt_count`, `created_at`);
--> statement-breakpoint
CREATE TABLE `newsletter_webhook_events` (
	`event_id` text PRIMARY KEY NOT NULL,
	`provider_message_id` text,
	`event_type` text NOT NULL,
	`event_created_at` text NOT NULL,
	`processed_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_newsletter_webhook_message_time`
ON `newsletter_webhook_events` (`provider_message_id`, `event_created_at`);
--> statement-breakpoint
PRAGMA optimize;
