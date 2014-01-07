CREATE TABLE `customers` IF NOT EXIST (
  `stripe_id` char(255) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` char(255) NOT NULL,
  `expiry` datetime DEFAULT NULL,
  `active` boolean DEFAULT TRUE,
  PRIMARY KEY (`stripe_id`),
  KEY `name` (`name`),
  KEY `user_id` (`user_id`),
  KEY `expired` (`expiry`, `active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
