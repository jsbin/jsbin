CREATE TABLE `sandbox` (
  `id` int(11) NOT NULL auto_increment,
  `javascript` text,
  `html` text,
  `created` datetime default NULL,
  `last_viewed` datetime default NULL,
  `url` char(255) default NULL,
  `streaming` char(1) default 'n',
  `streaming_key` char(32) NOT NULL,
  `streaming_read_key` char(32) NOT NULL,
  `active_tab` varchar(10) NOT NULL,
  `active_cursor` int(11) NOT NULL,
  PRIMARY KEY  (`id`),
  KEY `viewed` (`last_viewed`),
  KEY `url` (`url`),
  KEY `streaming_key` (`streaming_key`),
  KEY `spam` (`created`,`last_viewed`)
);