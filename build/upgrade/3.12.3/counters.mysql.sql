DROP TABLE IF EXISTS `counters`;
CREATE TABLE `counters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` char(255) NOT NULL, /* rem */
  `type` char(128) NOT NULL, /* ie. pro */
  `value` char(255), /* ie. #12, twelth user */

  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`,`type`),
  KEY `type` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

insert into counters values (null, 'rem', 'pro', '1');