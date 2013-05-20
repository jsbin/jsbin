ALTER TABLE ownership
  ADD COLUMN api_key VARCHAR(255) NULL,
  KEY `ownership_api_key` (`expires`);