ALTER TABLE ownership
  ADD COLUMN api_key VARCHAR(255) NULL,
  ADD INDEX `ownership_api_key` (`api_key`);