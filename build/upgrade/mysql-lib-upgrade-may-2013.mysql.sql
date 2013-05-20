ALTER TABLE sandbox
  MODIFY active_tab varchar(10) COLLATE utf8mb4_unicode_ci NULL,
  MODIFY active_cursor int(11) NULL;