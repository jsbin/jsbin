ALTER TABLE `owners` ADD COLUMN `visibility` ENUM('public', 'unlisted', 'private') DEFAULT 'public' NOT NULL;
