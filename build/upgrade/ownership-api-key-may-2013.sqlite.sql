ALTER TABLE `ownership` ADD COLUMN `api_key` VARCHAR(255) NULL;
CREATE INDEX IF NOT EXISTS "ownership_api_key" ON "ownership" (`api_key`);