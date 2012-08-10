CREATE TABLE IF NOT EXISTS `sandbox` (
  `id` INT(11) NOT NULL auto_increment,
  `url` VARCHAR(255) DEFAULT NULL,
  `revision` INT(11) DEFAULT '1',
  `html` TEXT NOT NULL DEFAULT '',
  `css` TEXT NOT NULL DEFAULT '',
  `javascript` TEXT NOT NULL DEFAULT '',
  `created` datetime DEFAULT NULL,
  `last_viewed` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `settings` TEXT DEFAULT '',
  `streaming` VARCHAR(1) DEFAULT 'n',
  `streaming_key` VARCHAR(32) NOT NULL,
  `streaming_read_key` VARCHAR(32) NOT NULL,
  `active_tab` VARCHAR(10) NOT NULL,
  `active_cursor` INT(11) NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `viewed` (`last_viewed`),
  KEY `url` (`url`),
  KEY `streaming_key` (`streaming_key`),
  KEY `spam` (`created`,`last_viewed`),
  KEY `revision` (`url`,`revision`),
  KEY `last_updated` (`name`, `last_updated`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ownership` (
  `name` VARCHAR(50) NOT NULL,
  `key` VARCHAR(191) NOT NULL,
  `email` VARCHAR(255) NOT NULL DEFAULT '',
  `last_login` datetime NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY  (`name`),
  KEY `name_key` (`name`,`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `owners` (
  `id` INT(11) NOT NULL auto_increment,
  `name` VARCHAR(25) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `revision` INT(11) DEFAULT '1',
  PRIMARY KEY  (`id`),
  KEY `name_url` (`name`,`url`,`revision`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
