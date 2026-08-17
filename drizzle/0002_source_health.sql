CREATE TABLE `source_checks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`checked_at` text NOT NULL,
	`source_id` text NOT NULL,
	`source_name` text NOT NULL,
	`url` text NOT NULL,
	`status` text NOT NULL,
	`detail` text NOT NULL,
	`records` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_source_checks_source_time` ON `source_checks` (`source_id`,`checked_at`);
--> statement-breakpoint
CREATE INDEX `idx_source_checks_checked_at` ON `source_checks` (`checked_at`);
