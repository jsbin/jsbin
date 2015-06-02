/*
-- Table structure for table `assets`
--*/
CREATE TABLE IF NOT EXISTS `assets` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `asset_url` VARCHAR(255) NOT NULL,
  `size` INTEGER NOT NULL,
  `mime` VARCHAR(255) NOT NULL
);

/*
-- Table structure for table `customers`
--*/
CREATE TABLE IF NOT EXISTS `customers` (
  `stripe_id` VARCHAR(255) NOT NULL,
  `id` INTEGER NOT NULL NULL PRIMARY KEY AUTOINCREMENT,
  `user_id` INTEGER DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `expiry` DATETIME DEFAULT NULL,
  `active` INTEGER DEFAULT '1',
  `plan` VARCHAR(255) DEFAULT NULL
);

/*
-- Table structure for table `forgot_tokens`
--*/
CREATE TABLE IF NOT EXISTS `forgot_tokens` (
  `owner_name` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `expires` DATETIME NOT NULL,
  `created` DATETIME NOT NULL
);

/*
-- Table structure for table `owner_bookmarks`
--*/
CREATE TABLE IF NOT EXISTS `owner_bookmarks` (
  `id` INTEGER NOT NULL NULL PRIMARY KEY AUTOINCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `revision` INTEGER NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `created` DATETIME NOT NULL
);

/*
-- Table structure for table `owners`
--*/
CREATE TABLE IF NOT EXISTS `owners` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` VARCHAR(75) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `revision` INTEGER DEFAULT '1',
  `last_updated` DATETIME DEFAULT NULL,
  `summary` VARCHAR(255) NOT NULL DEFAULT '',
  `html` INTEGER DEFAULT '0',
  `css` INTEGER DEFAULT '0',
  `javascript` INTEGER DEFAULT '0',
  `archive` INTEGER DEFAULT '0',
  `visibility` VARCHAR(255) DEFAULT 'public' NOT NULL
);

/*
-- Table structure for table `ownership`
--*/
CREATE TABLE IF NOT EXISTS `ownership` (
  `name` VARCHAR(50) NOT NULL,
  `key` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL DEFAULT '',
  `last_login` DATETIME NOT NULL,
  `created` DATETIME NOT NULL,
  `updated` DATETIME NOT NULL,
  `api_key` VARCHAR(255) NULL,
  `github_token` VARCHAR(255) NULL,
  `github_id` INTEGER NULL,
  `verified` INTEGER NOT NULL DEFAULT '0',
  `pro` INTEGER NOT NULL DEFAULT '0',
  `id` INTEGER NOT NULL NULL PRIMARY KEY AUTOINCREMENT,
  `settings` TEXT,
  `dropbox_token` VARCHAR(255) DEFAULT NULL,
  `dropbox_id` INTEGER DEFAULT NULL,
  `beta` INTEGER DEFAULT NULL,
  `flagged` VARCHAR(16) DEFAULT NULL,
  `last_seen` DATETIME DEFAULT NULL  
);

/*
-- Table structure for table `sandbox`
--*/
CREATE TABLE IF NOT EXISTS `sandbox` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `javascript` TEXT NOT NULL DEFAULT "",
  `html` TEXT NOT NULL DEFAULT "",
  `created` DATETIME DEFAULT NULL,
  `last_viewed` DATETIME DEFAULT NULL,
  `url` VARCHAR(255) DEFAULT NULL,
  `active` VARCHAR(1) DEFAULT 'y',
  `reported` DATETIME DEFAULT NULL,
  `streaming` VARCHAR(1) DEFAULT 'n',
  `streaming_key` VARCHAR(32),
  `streaming_read_key` VARCHAR(32),
  `active_tab` VARCHAR(10),
  `active_cursor` INTEGER,
  `revision` INTEGER DEFAULT '1',
  `css` TEXT NOT NULL DEFAULT "",
  `settings` TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS "sandbox_viewed" ON "sandbox" (`last_viewed`);
CREATE INDEX IF NOT EXISTS "sandbox_url" ON "sandbox" (`url`);
CREATE INDEX IF NOT EXISTS "sandbox_streaming_key" ON "sandbox" (`streaming_key`);
CREATE INDEX IF NOT EXISTS "sandbox_spam" ON "sandbox" (`created`,`last_viewed`);
CREATE INDEX IF NOT EXISTS "sandbox_revision" ON "sandbox" (`url`,`revision`);

CREATE INDEX IF NOT EXISTS "ownership_name_key" ON "ownership" (`name`,`key`);
CREATE INDEX IF NOT EXISTS "ownership_created" ON "ownership" (`created`);
CREATE INDEX IF NOT EXISTS "ownership_api_key" ON "ownership" (`api_key`);
CREATE INDEX IF NOT EXISTS "ownership_last_seen" ON "ownership" (`last_seen`);

CREATE INDEX IF NOT EXISTS "owners_name_url" ON "owners" (`name`,`url`,`revision`);
CREATE INDEX IF NOT EXISTS "owners_last_updated" ON "owners" (`name`,`last_updated`);
CREATE INDEX IF NOT EXISTS "owners_url" ON "owners" (`url`,`revision`);

CREATE INDEX IF NOT EXISTS "owner_bookmarks_name" ON "owner_bookmarks" (`name`,`type`,`created`);  
CREATE INDEX IF NOT EXISTS "owner_bookmarks_revision" ON "owner_bookmarks" (`url`,`revision`);
  
CREATE INDEX IF NOT EXISTS "forgot_tokens_expires" ON "forgot_tokens" (`expires`);  
CREATE INDEX IF NOT EXISTS "forgot_tokens_token_expires" ON "forgot_tokens" (`token`,`created`, `expires`);  

CREATE INDEX IF NOT EXISTS "customers_stripe_id" ON "customers" (`stripe_id`);
CREATE INDEX IF NOT EXISTS "customers_name" ON "customers" (`name`);
CREATE INDEX IF NOT EXISTS "customers_user_id" ON "customers" (`user_id`);
CREATE INDEX IF NOT EXISTS "customers_expired" ON "customers" (`expiry`,`active`);

CREATE INDEX IF NOT EXISTS "assets_asset_url" ON "assets" (`asset_url`);  
CREATE INDEX IF NOT EXISTS "assets_username" ON "assets" (`username`);
