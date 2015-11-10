-- MySQL dump 10.13  Distrib 5.5.29, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: jsbin
-- ------------------------------------------------------
-- Server version  5.5.29-0ubuntu0.12.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` char(255) NOT NULL,
  `asset_url` char(255) NOT NULL,
  `size` int(11) NOT NULL,
  `mime` char(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `asset_url` (`asset_url`),
  KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=79 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `stripe_id` char(255) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `name` char(255) NOT NULL,
  `expiry` datetime DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `plan` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stripe_id` (`stripe_id`),
  KEY `name` (`name`),
  KEY `user_id` (`user_id`),
  KEY `expired` (`expiry`,`active`)
) ENGINE=InnoDB AUTO_INCREMENT=223 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `forgot_tokens`
--

DROP TABLE IF EXISTS `forgot_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `forgot_tokens` (
  `owner_name` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires` datetime NOT NULL,
  `created` datetime NOT NULL,
  KEY `index_expires` (`expires`),
  KEY `index_token_expires` (`token`,`created`,`expires`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `owner_bookmarks`
--

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
  KEY `name` (`name`,`type`,`created`),
  KEY `revision` (`url`(191),`revision`)
) ENGINE=InnoDB AUTO_INCREMENT=295 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `owners`
--

DROP TABLE IF EXISTS `owners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `owners` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(75) NOT NULL,
  `url` char(255) NOT NULL,
  `revision` int(11) DEFAULT '1',
  `last_updated` datetime NOT NULL,
  `summary` varchar(255) NOT NULL DEFAULT '',
  `html` tinyint(1) NOT NULL DEFAULT '0',
  `css` tinyint(1) NOT NULL DEFAULT '0',
  `javascript` tinyint(1) NOT NULL DEFAULT '0',
  `archive` tinyint(1) NOT NULL DEFAULT '0',
  `visibility` enum('public','unlisted','private') NOT NULL DEFAULT 'public',
  PRIMARY KEY (`id`),
  KEY `name_url` (`name`,`url`,`revision`),
  KEY `last_updated` (`name`,`last_updated`),
  KEY `url` (`url`,`revision`)
) ENGINE=InnoDB AUTO_INCREMENT=2637880 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ownership`
--

DROP TABLE IF EXISTS `ownership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ownership` (
  `name` char(75) NOT NULL,
  `key` char(255) NOT NULL,
  `email` varchar(255) NOT NULL DEFAULT '',
  `last_login` datetime NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL,
  `api_key` varchar(255) DEFAULT NULL,
  `github_token` varchar(255) DEFAULT NULL,
  `github_id` int(11) DEFAULT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `pro` tinyint(1) NOT NULL DEFAULT '0',
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `settings` text,
  `dropbox_token` varchar(255) DEFAULT NULL,
  `dropbox_id` int(11) DEFAULT NULL,
  `beta` tinyint(1) DEFAULT NULL,
  `flagged` char(16) DEFAULT NULL,
  `last_seen` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `name_key` (`name`,`key`),
  KEY `created` (`created`),
  KEY `ownership_api_key` (`api_key`),
  KEY `last_seen` (`last_seen`)
) ENGINE=InnoDB AUTO_INCREMENT=132146 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sandbox`
--

DROP TABLE IF EXISTS `sandbox`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sandbox` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `javascript` mediumtext COLLATE utf8mb4_unicode_ci,
  `html` mediumtext COLLATE utf8mb4_unicode_ci,
  `created` datetime DEFAULT NULL,
  `last_viewed` datetime DEFAULT NULL,
  `url` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` char(1) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'y',
  `reported` datetime DEFAULT NULL,
  `streaming` char(1) COLLATE utf8mb4_unicode_ci DEFAULT 'n',
  `streaming_key` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `streaming_read_key` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active_tab` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active_cursor` int(11) NOT NULL,
  `revision` int(11) DEFAULT '1',
  `css` mediumtext COLLATE utf8mb4_unicode_ci,
  `settings` mediumtext COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `viewed` (`last_viewed`),
  KEY `url` (`url`(191)),
  KEY `streaming_key` (`streaming_key`),
  KEY `spam` (`created`,`last_viewed`),
  KEY `revision` (`url`(191),`revision`)
) ENGINE=InnoDB AUTO_INCREMENT=14551004 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-01-30 16:46:09
