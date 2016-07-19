
--
-- Table structure for table "assets"
--

DROP TABLE IF EXISTS "assets";

CREATE TABLE "assets" (
  "id"   BIGSERIAL UNIQUE,
  "username" text NOT NULL,
  "asset_url" text NOT NULL,
  "size"  BIGINT NOT NULL,
  "mime" text NOT NULL
);

CREATE INDEX ON "assets" ("id");
CREATE INDEX ON "assets" ("asset_url");
CREATE INDEX ON "assets" ("username");


--
-- Table structure for table "customers"
--
DROP TABLE IF EXISTS "customers";
CREATE TABLE "customers" (
  "stripe_id" text NOT NULL,
  "id"   BIGSERIAL UNIQUE,
  "user_id"  BIGINT DEFAULT NULL,
  "name" text NOT NULL,
  "expiry" timestamp DEFAULT NULL,
  "active" SMALLINT DEFAULT '1',
  "plan" text DEFAULT NULL
);

CREATE INDEX ON "customers" ("id");
CREATE INDEX ON "customers" ("stripe_id");
CREATE INDEX ON "customers" ("name");
CREATE INDEX ON "customers" ("user_id");
CREATE INDEX ON "customers" ("expiry","active");

--
-- Table structure for table "forgot_tokens"
--
DROP TABLE IF EXISTS "forgot_tokens";
CREATE TABLE "forgot_tokens" (
  "owner_name" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp NOT NULL,
  "created" timestamp NOT NULL
);
CREATE INDEX ON "forgot_tokens" ("expires");
CREATE INDEX ON "forgot_tokens" ("token","created","expires");

--
-- Table structure for table "owner_bookmarks"
--
DROP TABLE IF EXISTS "owner_bookmarks";

CREATE TABLE "owner_bookmarks" (
  "id"   BIGSERIAL UNIQUE,
  "name" text NOT NULL,
  "url" text NOT NULL,
  "revision"  BIGINT NOT NULL,
  "type" text NOT NULL,
  "created" timestamp NOT NULL
);

CREATE INDEX ON "owner_bookmarks" ("id");
CREATE INDEX ON "owner_bookmarks" ("name","type","created");
CREATE INDEX ON "owner_bookmarks" ("url","revision");

--
-- Table structure for table "owners"
--
DROP TABLE IF EXISTS "owners";

DROP TYPE "visibility_type";
CREATE TYPE "visibility_type" AS ENUM ('public','unlisted','private');
CREATE TABLE "owners" (
  "id"   BIGSERIAL UNIQUE,
  "name" text NOT NULL,
  "url" text NOT NULL,
  "revision"  BIGINT DEFAULT '1',
  "last_updated" timestamp NOT NULL,
  "summary" text NOT NULL DEFAULT '',
  "html" SMALLINT DEFAULT '0',
  "css" SMALLINT DEFAULT '0',
  "javascript" SMALLINT DEFAULT '0',
  "archive" SMALLINT DEFAULT '0',
  "visibility" visibility_type NOT NULL DEFAULT 'public'

); 

CREATE INDEX ON "owners" ("id");
CREATE INDEX ON "owners" ("name","url","revision");
CREATE INDEX ON "owners" ("name","last_updated");
CREATE INDEX ON "owners" ("url","revision");

--
-- Table structure for table "ownership"
--
DROP TABLE IF EXISTS "ownership";

CREATE TABLE "ownership" (
  "name" text NOT NULL,
  "key" text NOT NULL,
  "email" text NOT NULL DEFAULT '',
  "last_login" timestamp NOT NULL,
  "created" timestamp NOT NULL,
  "updated" timestamp NOT NULL,
  "api_key" text DEFAULT NULL,
  "github_token" text DEFAULT NULL,
  "github_id"  BIGINT DEFAULT NULL,
  "verified" SMALLINT NOT NULL DEFAULT '0',
  "pro" SMALLINT NOT NULL DEFAULT '0',
  "id"   BIGSERIAL UNIQUE,
  "settings" text,
  "dropbox_token" text DEFAULT NULL,
  "dropbox_id"  BIGINT DEFAULT NULL,
  "beta" SMALLINT DEFAULT NULL,
  "flagged" text DEFAULT NULL,
  "last_seen" timestamp DEFAULT NULL

); 

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

CREATE TABLE "sandbox" (
  "id"   BIGSERIAL UNIQUE,
  "javascript" TEXT ,
  "html" TEXT,
  "sql" TEXT,
  "created" timestamp DEFAULT NULL,
  "last_viewed" timestamp DEFAULT NULL,
  "url" text  DEFAULT NULL,
  "active" text NOT NULL DEFAULT 'y',
  "reported" timestamp DEFAULT NULL,
  "streaming" text  DEFAULT 'n',
  "streaming_key" text  NOT NULL,
  "streaming_read_key" text,
  "active_tab" text,
  "active_cursor"  BIGINT,
  "revision"  BIGINT DEFAULT '1',
  "css" TEXT,
  "settings" TEXT 
 
); 

CREATE INDEX ON "sandbox" ("id");
CREATE INDEX ON "sandbox" ("last_viewed");
CREATE INDEX ON "sandbox" ("url");
CREATE INDEX ON "sandbox" ("streaming_key");
CREATE INDEX ON "sandbox" ("created","last_viewed");
CREATE INDEX ON "sandbox" ("revision");
CREATE INDEX ON "sandbox" ("url","revision");

