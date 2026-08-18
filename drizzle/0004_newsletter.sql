CREATE TABLE `newsletter_subscribers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`email_normalized` text NOT NULL,
	`locale` text DEFAULT 'en' NOT NULL,
	`region` text DEFAULT 'global' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`confirmation_token_hash` text,
	`unsubscribe_token` text NOT NULL,
	`consent_source` text DEFAULT 'updates-page' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`confirmed_at` text,
	`unsubscribed_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_newsletter_subscribers_email` ON `newsletter_subscribers` (`email_normalized`);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_newsletter_subscribers_confirmation_token` ON `newsletter_subscribers` (`confirmation_token_hash`);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_newsletter_subscribers_unsubscribe_token` ON `newsletter_subscribers` (`unsubscribe_token`);
--> statement-breakpoint
CREATE INDEX `idx_newsletter_subscribers_status` ON `newsletter_subscribers` (`status`);
--> statement-breakpoint
CREATE TABLE `newsletter_deliveries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`subscriber_id` integer NOT NULL,
	`kind` text NOT NULL,
	`publication_slug` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`provider_message_id` text,
	`error` text,
	`created_at` text NOT NULL,
	`sent_at` text,
	FOREIGN KEY (`subscriber_id`) REFERENCES `newsletter_subscribers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_newsletter_deliveries_status_created` ON `newsletter_deliveries` (`status`,`created_at`);
--> statement-breakpoint
CREATE INDEX `idx_newsletter_deliveries_subscriber` ON `newsletter_deliveries` (`subscriber_id`);
--> statement-breakpoint
PRAGMA optimize;
