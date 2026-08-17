ALTER TABLE `price_snapshots` ADD `source_url` text;
--> statement-breakpoint
ALTER TABLE `price_snapshots` ADD `parser_version` text DEFAULT 'legacy' NOT NULL;
--> statement-breakpoint
ALTER TABLE `price_snapshots` ADD `verification_status` text DEFAULT 'verified' NOT NULL;
