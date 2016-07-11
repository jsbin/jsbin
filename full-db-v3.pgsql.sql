
--
-- Table structure for table "assets"
--

DROP TABLE IF EXISTS "assets";
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE "assets" (
  "id"   BIGSERIAL UNIQUE,
  "username" char(255) NOT NULL,
  "asset_url" char(255) NOT NULL,
  "size"  BIGINT NOT NULL,
  "mime" char(255) NOT NULL
  --,
  --PRIMARY KEY ("id"),
  --KEY "asset_url" ("asset_url"),
  --KEY "username" ("username")
);-- ENGINE=MyISAM AUTO_INCREMENT=79 DEFAULT CHARSET=utf8;
ALTER SEQUENCE "assets_id_seq" RESTART WITH 79;
CREATE INDEX ON "assets" ("id");
CREATE INDEX ON "assets" ("asset_url");
CREATE INDEX ON "assets" ("username");
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table "customers"
--

DROP TABLE IF EXISTS "customers";
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE "customers" (
  "stripe_id" char(255) NOT NULL,
  "id"   BIGSERIAL UNIQUE,
  "user_id"  BIGINT DEFAULT NULL,
  "name" char(255) NOT NULL,
  "expiry" timestamp DEFAULT NULL,
  "active" SMALLINT DEFAULT '1',
  "plan" varchar(255) DEFAULT NULL
  --,
  --PRIMARY KEY ("id"),
  --KEY "stripe_id" ("stripe_id"),
  --KEY "name" ("name"),
  --KEY "user_id" ("user_id"),
  --KEY "expired" ("expiry","active")
);-- ENGINE=InnoDB AUTO_INCREMENT=223 DEFAULT CHARSET=utf8;
ALTER SEQUENCE "customers_id_seq" RESTART WITH 79;
CREATE INDEX ON "customers" ("id");
CREATE INDEX ON "customers" ("stripe_id");
CREATE INDEX ON "customers" ("name");
CREATE INDEX ON "customers" ("user_id");
CREATE INDEX ON "customers" ("expiry","active");

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table "forgot_tokens"
--

DROP TABLE IF EXISTS "forgot_tokens";
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE "forgot_tokens" (
  "owner_name" varchar(255) NOT NULL,
  "token" varchar(255) NOT NULL,
  "expires" timestamp NOT NULL,
  "created" timestamp NOT NULL
  --,
  --KEY "index_expires" ("expires"),
  --KEY "index_token_expires" ("token","created","expires")
); --ENGINE=MyISAM DEFAULT CHARSET=utf8;
CREATE INDEX ON "forgot_tokens" ("expires");
CREATE INDEX ON "forgot_tokens" ("token","created","expires");
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table "owner_bookmarks"
--

DROP TABLE IF EXISTS "owner_bookmarks";

CREATE TABLE "owner_bookmarks" (
  "id"   BIGSERIAL UNIQUE,
  "name" char(255) NOT NULL,
  "url" char(255) NOT NULL,
  "revision"  BIGINT NOT NULL,
  "type" char(50) NOT NULL,
  "created" timestamp NOT NULL
  --,
  --PRIMARY KEY ("id"),
  --KEY "name" ("name","type","created"),
  --KEY "revision" ("url"(191),"revision")
);--ENGINE=InnoDB AUTO_INCREMENT=295 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
ALTER SEQUENCE "owner_bookmarks_id_seq" RESTART WITH 295;
CREATE INDEX ON "owner_bookmarks" ("id");
CREATE INDEX ON "owner_bookmarks" ("name","type","created");
CREATE INDEX ON "owner_bookmarks" ("url","revision");
--
-- Table structure for table "owners"
--

DROP TABLE IF EXISTS "owners";
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
DROP TYPE "visibility_type";
CREATE TYPE "visibility_type" AS ENUM ('public','unlisted','private');
CREATE TABLE "owners" (
  "id"   BIGSERIAL UNIQUE,
  "name" char(75) NOT NULL,
  "url" char(255) NOT NULL,
  "revision"  BIGINT DEFAULT '1',
  "last_updated" timestamp NOT NULL,
  "summary" varchar(255) NOT NULL DEFAULT '',
  "html" SMALLINT NOT NULL DEFAULT '0',
  "css" SMALLINT NOT NULL DEFAULT '0',
  "javascript" SMALLINT NOT NULL DEFAULT '0',
  "archive" SMALLINT NOT NULL DEFAULT '0',
  "visibility" visibility_type NOT NULL DEFAULT 'public'
  --,
  --PRIMARY KEY ("id"),
  --KEY "name_url" ("name","url","revision"),
  --KEY "last_updated" ("name","last_updated"),
  --KEY "url" ("url","revision")
); --ENGINE=InnoDB AUTO_INCREMENT=2637880 DEFAULT CHARSET=utf8;
ALTER SEQUENCE "owners_id_seq" RESTART WITH 2637880;
CREATE INDEX ON "owners" ("id");
CREATE INDEX ON "owners" ("name","url","revision");
CREATE INDEX ON "owners" ("name","last_updated");
CREATE INDEX ON "owners" ("url","revision");
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table "ownership"
--

DROP TABLE IF EXISTS "ownership";
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE "ownership" (
  "name" char(75) NOT NULL,
  "key" char(255) NOT NULL,
  "email" varchar(255) NOT NULL DEFAULT '',
  "last_login" timestamp NOT NULL,
  "created" timestamp NOT NULL,
  "updated" timestamp NOT NULL,
  "api_key" varchar(255) DEFAULT NULL,
  "github_token" varchar(255) DEFAULT NULL,
  "github_id"  BIGINT DEFAULT NULL,
  "verified" SMALLINT NOT NULL DEFAULT '0',
  "pro" SMALLINT NOT NULL DEFAULT '0',
  "id"   BIGSERIAL UNIQUE,
  "settings" text,
  "dropbox_token" varchar(255) DEFAULT NULL,
  "dropbox_id"  BIGINT DEFAULT NULL,
  "beta" SMALLINT DEFAULT NULL,
  "flagged" char(16) DEFAULT NULL,
  "last_seen" timestamp DEFAULT NULL
  --,
  --PRIMARY KEY ("id"),
  --UNIQUE KEY "name" ("name"),
  --KEY "name_key" ("name","key"),
  --KEY "created" ("created"),
  --KEY "ownership_api_key" ("api_key"),
  --KEY "last_seen" ("last_seen")
); --ENGINE=InnoDB AUTO_INCREMENT=132146 DEFAULT CHARSET=utf8;
ALTER SEQUENCE "ownership_id_seq" RESTART WITH 132146;
/*!40101 SET character_set_client = @saved_cs_client */;
CREATE INDEX ON "ownership" ("id");
CREATE INDEX ON "ownership" ("name");
CREATE INDEX ON "ownership" ("name","key");
CREATE INDEX ON "ownership" ("created");
CREATE INDEX ON "ownership" ("api_key");
CREATE INDEX ON "ownership" ("last_seen");
--
-- Table structure for table "sandbox"
--

DROP TABLE IF EXISTS "sandbox";
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE "sandbox" (
  "id"   BIGSERIAL UNIQUE,
  "javascript" TEXT ,
  "html" TEXT,
  "created" timestamp DEFAULT NULL,
  "last_viewed" timestamp DEFAULT NULL,
  "url" char(255)  DEFAULT NULL,
  "active" char(1) NOT NULL DEFAULT 'y',
  "reported" timestamp DEFAULT NULL,
  "streaming" char(1)  DEFAULT 'n',
  "streaming_key" char(32)  NOT NULL,
  "streaming_read_key" char(32) NOT NULL,
  "active_tab" varchar(10) NOT NULL,
  "active_cursor"  BIGINT NOT NULL,
  "revision"  BIGINT DEFAULT '1',
  "css" TEXT,
  "settings" TEXT 
  --,
  --PRIMARY KEY ("id"),
  --KEY "viewed" ("last_viewed"),
  --KEY "url" ("url"(191)),
  --KEY "streaming_key" ("streaming_key"),
  --KEY "spam" ("created","last_viewed"),
  --KEY "revision" ("url"(191),"revision")
); --ENGINE=InnoDB AUTO_INCREMENT=14551004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER SEQUENCE "sandbox_id_seq" RESTART WITH 14551004;
CREATE INDEX ON "sandbox" ("id");
CREATE INDEX ON "sandbox" ("last_viewed");
CREATE INDEX ON "sandbox" ("url");
CREATE INDEX ON "sandbox" ("streaming_key");
CREATE INDEX ON "sandbox" ("created","last_viewed");
CREATE INDEX ON "sandbox" ("revision");
CREATE INDEX ON "sandbox" ("url","revision");



SELECT * FROM "sandbox" WHERE "url"='1' AND "revision" BETWEEN '2' AND '3' + 1 ORDER BY "revision";

--  "getBin": "SELECT * FROM `sandbox` WHERE `url`=? AND `revision` BETWEEN ? AND ? + 1 ORDER BY `revision`",
  -- "getLatestBin": "SELECT * FROM `sandbox` WHERE `url`=? ORDER BY `revision` DESC LIMIT 1",
  -- "setBin": "INSERT INTO `sandbox` (`javascript`, `css`, `html`, `created`, `last_viewed`, `url`, `revision`, `streaming_key`, `settings`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
  -- "setBinPanel": "UPDATE `sandbox` SET `:panel`=?, `settings`=?, `created`=? WHERE `url`=? AND `revision`=? AND `streaming_key`=? AND `streaming_key`!='' AND `active`='y'",
  -- "binExists": "SELECT id FROM `sandbox` WHERE `url`=? LIMIT 1",
  -- "getUser": "SELECT * FROM `ownership` WHERE `name`=? LIMIT 1",
  -- "getUserByGithubId": "SELECT * FROM `ownership` WHERE `github_id`=? LIMIT 1",
  -- "getUserByApiKey": "SELECT * FROM `ownership` WHERE `api_key`=? LIMIT 1",
  -- "getByEmail": "SELECT * FROM `ownership` WHERE `email`=? LIMIT 1",
  -- "setUser": "INSERT INTO `ownership` (`name`, `key`, `email`, `last_login`, `created`, `updated`, `github_token`, `github_id`, `flagged`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
  -- "touchLogin": "UPDATE `ownership` SET `last_login`=? WHERE `name`=?",
  -- "updateUserKey": "UPDATE ownership SET `key`=?, `updated`=? WHERE `name`=?",
  -- "updateUserSettings": "UPDATE ownership SET `settings`=? WHERE `name`=?",
  -- "upgradeUserKey": "UPDATE ownership SET `key`=?, `created`=?, `updated`=? WHERE `name`=?",
  -- "DATELIMITgetBinsByUser": "SELECT SUBSTR(s.html, 1, 200) as html, SUBSTR(s.javascript, 1, 100) as javascript, SUBSTR(s.css, 1, 100) as css, o.archive, o.last_updated, o.url, o.revision FROM `owners` as o, `sandbox` s WHERE o.url=s.url and o.revision=s.revision and o.last_updated>DATE_SUB(NOW(), INTERVAL 6 MONTH) AND o.name=?",
  -- "getBinsByUser": "select summary as html, summary as javascript, summary as css, archive, last_updated, url, revision from `owners` where name=?",
  -- "LIMITgetBinsByUser": "SELECT SUBSTR(s.html, 1, 200) as html, SUBSTR(s.javascript, 1, 100) as javascript, SUBSTR(s.css, 1, 100) as css, o.archive, o.last_updated, o.url, o.revision FROM `owners` as o, `sandbox` s WHERE o.url=s.url and o.revision=s.revision AND o.name=? ORDER BY o.last_updated LIMIT 500",
  -- "OLDDgetBinsByUser": "SELECT *, `last_updated` as `created` FROM `owners` WHERE `name`=?",
  -- "getAllOwners": "SELECT * FROM `owners`",
  -- "getOwnersBlock": "SELECT * FROM `owners` LIMIT ?, ?",
  -- "getBinByUrlAndRevision": "SELECT * FROM `sandbox` WHERE `url`=? AND `revision`=? LIMIT 1",
  -- "getLatestBinForUser": "SELECT `url`, `revision` FROM `owners` WHERE `name`=? AND `last_updated` != 0 AND `archive` = 0 ORDER BY `last_updated` DESC LIMIT ?,1",
  -- "setBinOwner": "INSERT INTO `owners` (`name`, `url`, `revision`, `last_updated`, `summary`, `html`, `css`, `javascript`, `visibility`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
  -- "touchOwners": "UPDATE `owners` SET `last_updated`=? WHERE `name`=? AND `url`=? AND `revision` = ?",
  -- "updateOwners": "UPDATE `owners` SET `last_updated`=?, `summary`=?, `:panel`=? WHERE `name`=? AND `url`=? AND `revision` = ?",
  -- "populateOwners": "UPDATE `owners` SET `last_updated`=?, `summary`=?, `html`=?, `css`=?, `javascript`=? WHERE `name`=? AND `url`=? AND `revision` = ?",
  -- "archiveBin": "UPDATE `owners` SET `archive`=? WHERE `name`=? AND `url`=? AND `revision` = ?",
  -- "updateUserEmail": "UPDATE ownership SET `email`=?, `updated`=? WHERE `name`=?",
  -- "updateUserGithubData": "UPDATE ownership SET `github_id`=?, `github_token`=?, `updated`=? WHERE `name`=?",
  -- "updateUserDropboxData":"UPDATE ownership SET `dropbox_token`=?, `updated`=? WHERE `name`=?",
  -- "getUserByEmail": "SELECT * FROM `ownership` WHERE `email`=? LIMIT 1",
  -- "getUserForForgotToken": "SELECT `ownership`.*, expires FROM `ownership` INNER JOIN `forgot_tokens` ON `name` = `owner_name` WHERE `token` = ? AND `forgot_tokens`.`expires` >= ?",
  -- "setForgotToken": "INSERT INTO `forgot_tokens` (`owner_name`, `token`, `expires`, `created`) VALUES (?, ?, ?, ?)",
  -- "deleteExpiredForgotToken": "DELETE FROM `forgot_tokens` WHERE `expires` <= ? OR `token`=? OR `owner_name`=?",
  -- "reportBin": "UPDATE `sandbox` SET `reported`=?, `active`='n' WHERE `url`=? AND `revision`=? AND `reported` IS NULL",
  -- "updateBinData": "UPDATE `sandbox` SET `:field`=? WHERE `url`=? AND `revision`=?",
  -- "updateOwnersData": "UPDATE `owners` SET `:field`=? WHERE `url`=? AND `revision`=?",
  -- "updateOwnershipData": "UPDATE `ownership` SET `:field`=? WHERE `name`=?",
  -- "isOwnerOf": "SELECT name=? as `owner`, s.active FROM `owners` AS `o`, `sandbox` AS `s` WHERE o.url=s.url AND o.revision=s.revision AND o.url=? AND o.revision=1",
  -- "getUserBinCount": "SELECT COUNT(*) as total FROM `owners` WHERE `name`=? AND archive=0",
  -- "setProAccount": "UPDATE ownership SET `pro`=?, `updated`=? WHERE `name`=?",
  -- "setCustomer" : "REPLACE INTO `customers` (`stripe_id`, `user_id`, `name`, `plan`) VALUES (?, ?, ?, ?)",
  -- "setCustomerActive": "UPDATE `customers` SET `active`=? WHERE `name`=?",
  -- "getCustomerByStripeId": "SELECT * FROM `customers` WHERE `stripe_id`=? LIMIT 1",
  -- "getCustomerByUser": "SELECT * FROM `customers` WHERE `name`=? LIMIT 1",
  -- "setBinVisibility": "UPDATE `owners` SET `visibility`=? WHERE `name`=? AND `url`=?",
  -- "getBinMetadata": "SELECT * FROM `owners` AS `o`, `ownership` AS `os` WHERE o.name=os.name AND o.url=? AND o.revision=?",
  -- "setProAccount": "UPDATE ownership SET `pro`=?, `updated`=? WHERE `name`=?",
  -- "saveBookmark": "INSERT INTO owner_bookmarks (`name`, `url`, `revision`, `type`, `created`) VALUES (?,?,?,?,?)",
  -- "getBookmark": "SELECT * FROM owner_bookmarks WHERE `name`=? AND `type`=? ORDER BY `created` DESC",
  -- "getAssetsForUser": "SELECT * FROM assets WHERE `username`=?",
  -- "deleteAsset": "DELETE FROM assets WHERE `asset_url`=? AND `username`=?",
  -- "saveAsset": "INSERT INTO assets (`username`, `asset_url`, `size`, `mime`) VALUES (?,?,?,?)",
  -- "userListing": "SELECT s.url, s.revision, s.created, s.settings FROM `owners` AS `o`, `sandbox` AS `s` WHERE o.name=? AND s.revision=o.revision AND s.url=o.url",
  -- "deleteUser": "DELETE FROM ownership, owners, sandbox USING ownership INNER JOIN owners INNER JOIN sandbox WHERE ownership.name = ? AND ownership.name = owners.name AND owners.url = sandbox.url AND owners.revision = sandbox.revision",
  -- "sandboxColumns": [
  --   "created",
  --   "last_viewed",
  --   "url",
  --   "active",
  --   "reported",
  --   "streaming",
  --   "streaming_key",
  --   "streaming_read_key",
  --   "active_tab",
  --   "active_cursor",
  --   "//protected revision",
  --   "css",
  --   "settings"
  -- ],
  -- "ownersColumns": [
  --   "name",
  --   "url",
  --   "//protected revision",
  --   "last_updated",
  --   "summary",
  --   "html",
  --   "css",
  --   "javascript",
  --   "archive",
  --   "visibility"
  -- ],
  -- "ownershipColumns": [
  --   "// protected name",
  --   "key",
  --   "email",
  --   "api_key",
  --   "github_token",
  --   "github_id",
  --   "last_login",
  --   "created",
  --   "updated",
  --   "pro",
  --   "settings",
  --   "embed",
  --   "// protected id",
  --   "dropbox_token",
  --   "domain",
  --   "verified",
  --   "dropbox_id",
  --   "beta",
  --   "flagged",
  --   "last_seen"
  -- ]


