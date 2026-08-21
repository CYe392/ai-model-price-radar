CREATE TABLE `refresh_lease` (
	`id` text PRIMARY KEY NOT NULL,
	`started_at` text NOT NULL,
	`expires_at` integer NOT NULL,
	`completed_at` text,
	`status` text DEFAULT 'running' NOT NULL
);
