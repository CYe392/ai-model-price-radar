CREATE TABLE `analytics_daily` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`day` text NOT NULL,
	`event` text NOT NULL,
	`path` text NOT NULL,
	`source` text DEFAULT 'direct' NOT NULL,
	`count` integer DEFAULT 1 NOT NULL,
	`last_seen_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_analytics_daily_dimensions` ON `analytics_daily` (`day`,`event`,`path`,`source`);
--> statement-breakpoint
CREATE INDEX `idx_analytics_daily_day_event` ON `analytics_daily` (`day`,`event`);
--> statement-breakpoint
PRAGMA optimize;
