CREATE TABLE IF NOT EXISTS `owners` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` VARCHAR(25) NOT NULL,
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

CREATE TABLE IF NOT EXISTS `ownership` (
  `name` VARCHAR(50) PRIMARY KEY NOT NULL,
  `key` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL DEFAULT '',
  `api_key` VARCHAR(255) NULL,
  `github_token` VARCHAR(255) NULL,
  `github_id` INTEGER NULL,
  `last_login` DATETIME NOT NULL,
  `created` DATETIME NOT NULL,
  `updated` DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS `sandbox` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `html` TEXT NOT NULL DEFAULT "",
  `css` TEXT NOT NULL DEFAULT "",
  `javascript` TEXT NOT NULL  DEFAULT "",
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
  `settings` TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS `forgot_tokens` (
  `owner_name` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `expires` DATETIME NOT NULL,
  `created` DATETIME NOT NULL
);

CREATE INDEX IF NOT EXISTS "sandbox_viewed" ON "sandbox" (`last_viewed`);
CREATE INDEX IF NOT EXISTS "sandbox_url" ON "sandbox" (`url`);
CREATE INDEX IF NOT EXISTS "sandbox_streaming_key" ON "sandbox" (`streaming_key`);
CREATE INDEX IF NOT EXISTS "sandbox_spam" ON "sandbox" (`created`,`last_viewed`);
CREATE INDEX IF NOT EXISTS "sandbox_revision" ON "sandbox" (`url`,`revision`);
CREATE INDEX IF NOT EXISTS "ownership_name_key" ON "ownership" (`name`,`key`);
CREATE INDEX IF NOT EXISTS "ownership_api_key" ON "ownership" (`api_key`);
CREATE INDEX IF NOT EXISTS "owners_name_url" ON "owners" (`name`,`url`,`revision`);
CREATE INDEX IF NOT EXISTS "index_owners_last_updated" ON "owners" (`name`, `last_updated`);
CREATE INDEX IF NOT EXISTS "index_expires" ON "forgot_tokens" (`expires`);
CREATE INDEX IF NOT EXISTS "index_token_expires" ON "forgot_tokens" (`token`,`created`,`expires`);
