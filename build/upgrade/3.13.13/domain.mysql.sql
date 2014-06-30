ALTER TABLE ownership
  ADD COLUMN domain CHAR(255) DEFAULT 0;
ALTER TABLE ownership
  ADD INDEX domain (domain);
