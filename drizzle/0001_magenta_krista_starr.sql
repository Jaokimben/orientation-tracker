CREATE TABLE `actions` (
	`id` varchar(10) NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`deadline` varchar(10) NOT NULL,
	`phase` varchar(20) NOT NULL,
	`link` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `actions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`actionId` varchar(10) NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_progress_id` PRIMARY KEY(`id`)
);
