ALTER TABLE `price_snapshots` ADD `currency` text;
--> statement-breakpoint
ALTER TABLE `price_snapshots` ADD `native_input` real;
--> statement-breakpoint
ALTER TABLE `price_snapshots` ADD `native_output` real;
--> statement-breakpoint
ALTER TABLE `price_snapshots` ADD `list_input` real;
--> statement-breakpoint
ALTER TABLE `price_snapshots` ADD `list_output` real;
--> statement-breakpoint
ALTER TABLE `price_snapshots` ADD `discount_percent` real;
--> statement-breakpoint
ALTER TABLE `price_snapshots` ADD `pricing_region` text;
--> statement-breakpoint
ALTER TABLE `price_snapshots` ADD `fx_rate` real;
--> statement-breakpoint
ALTER TABLE `price_snapshots` ADD `fx_as_of` text;
--> statement-breakpoint
ALTER TABLE `price_snapshots` ADD `tier` text;
