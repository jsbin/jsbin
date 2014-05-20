DROP TABLE IF EXISTS `owner_bookmarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `owner_bookmarks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(255) NOT NULL,
  `url` char(255) NOT NULL,
  `revision` int(11) NOT NULL,
  `type` char(50) NOT NULL,
  `created` datetime NOT NULL,

  PRIMARY KEY (`id`),
  KEY `name` (`name`, `type`, `created`),
  KEY `revision` (`url`(191),`revision`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
