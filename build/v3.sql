ALTER TABLE sandbox
  ADD COLUMN css TEXT NOT NULL DEFAULT "",
  ADD COLUMN settings TEXT NOT NULL DEFAULT "";
ALTER TABLE ownership
  ADD COLUMN email VARCHAR(255) NOT NULL DEFAULT "",
  ADD COLUMN last_login DATETIME NOT NULL,
  ADD COLUMN created DATETIME NOT NULL,
  ADD COLUMN updated DATETIME NOT NULL;
CREATE TABLE forgot_tokens (
  owner_name VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expired INT(1) NOT NULL DEFAULT 0,
  created DATETIME NOT NULL,
  updated DATETIME NOT NULL,
  KEY `index_created` (`created`),
  KEY `index_token_expired_created` (`token`,`expired`,`created`)
);
