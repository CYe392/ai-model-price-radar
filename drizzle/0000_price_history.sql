CREATE TABLE `collection_runs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`collected_at` text NOT NULL,
	`source_count` integer NOT NULL,
	`ok_count` integer NOT NULL,
	`update_count` integer NOT NULL,
	`rejected_count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `price_snapshots` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`collected_at` text NOT NULL,
	`model` text NOT NULL,
	`provider` text NOT NULL,
	`source` text NOT NULL,
	`input` real,
	`cached` real,
	`cache_write` real,
	`output` real,
	`accepted` integer DEFAULT true NOT NULL,
	`confidence` text DEFAULT 'structured' NOT NULL,
	`change_percent` real
);
--> statement-breakpoint
CREATE INDEX `idx_price_snapshots_route_time` ON `price_snapshots` (`model`,`provider`,`collected_at`);
--> statement-breakpoint
CREATE INDEX `idx_price_snapshots_collected_at` ON `price_snapshots` (`collected_at`);
--> statement-breakpoint
PRAGMA optimize;
