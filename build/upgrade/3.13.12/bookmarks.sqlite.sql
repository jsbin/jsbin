CREATE TABLE IF NOT EXISTS `owner_bookmarks` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) DEFAULT NULL,
  `revision` INTEGER NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `created` DATETIME NOT NULL
);

CREATE INDEX IF NOT EXISTS "owner_bookmarks_name" ON "owner_bookmarks" (`name`, `type`, `created`);
CREATE INDEX IF NOT EXISTS "owner_bookmarks_revision" ON "owner_bookmarks" (`url`, `revision`);