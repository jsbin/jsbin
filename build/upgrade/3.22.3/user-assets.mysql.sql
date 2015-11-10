CREATE TABLE IF NOT EXISTS `assets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` char(255) NOT NULL,
  `asset_url` char(255) NOT NULL,
  `size` int(11) NOT NULL,
  `mime` char(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `asset_url` (`asset_url`),
  KEY `username` (`username`)
) ENGINE=MYISAM DEFAULT CHARSET=utf8;

