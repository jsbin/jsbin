CREATE TABLE IF NOT EXISTS `sandbox` (
  `id` int(11) NOT NULL auto_increment,
  `javascript` text,
  `html` text,
  `created` datetime default NULL,
  `last_viewed` datetime default NULL,
  `url` char(255) character set latin1 default NULL,
  `streaming` char(1) character set latin1 default 'n',
  `streaming_key` char(32) character set latin1 NOT NULL,
  `streaming_read_key` char(32) character set latin1 NOT NULL,
  `active_tab` varchar(10) character set latin1 NOT NULL,
  `active_cursor` int(11) NOT NULL,
  `revision` int(11) default '1',
  `css` text,
  `settings` text,
  PRIMARY KEY  (`id`),
  KEY `viewed` (`last_viewed`),
  KEY `url` (`url`),
  KEY `streaming_key` (`streaming_key`),
  KEY `spam` (`created`,`last_viewed`),
  KEY `revision` (`url`,`revision`)
) ENGINE=MyISAM AUTO_INCREMENT=1191178 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `ownership` (
  `name` char(50) NOT NULL,
  `key` char(255) NOT NULL,
  `email` varchar(255) NOT NULL default '',
  `last_login` datetime NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY  (`name`),
  KEY `name_key` (`name`,`key`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `owners` (
  `id` int(11) NOT NULL auto_increment,
  `name` char(25) NOT NULL,
  `url` char(255) NOT NULL,
  `revision` int(11) default '1',
  PRIMARY KEY  (`id`),
  KEY `name_url` (`name`,`url`,`revision`)
) ENGINE=MyISAM AUTO_INCREMENT=8450 DEFAULT CHARSET=utf8;