mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 8.0.12, for Win64 (x86_64)
--
-- Host: localhost    Database: devvault
-- ------------------------------------------------------
-- Server version	8.0.12

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `collection_resources`
--

DROP TABLE IF EXISTS `collection_resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `collection_resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `collection_id` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `added_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `collection_resources_collection_id_resource_id_key` (`collection_id`,`resource_id`),
  KEY `collection_resources_resource_id_fkey` (`resource_id`)
) ENGINE=MyISAM AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collection_resources`
--

LOCK TABLES `collection_resources` WRITE;
/*!40000 ALTER TABLE `collection_resources` DISABLE KEYS */;
INSERT INTO `collection_resources` VALUES (1,1,3,0,'2026-06-26 12:51:03.028'),(2,1,4,1,'2026-06-26 12:51:03.030'),(3,1,5,2,'2026-06-26 12:51:03.032'),(4,1,6,3,'2026-06-26 12:51:03.033'),(5,1,7,4,'2026-06-26 12:51:03.034'),(6,1,8,5,'2026-06-26 12:51:03.035'),(7,1,9,6,'2026-06-26 12:51:03.036'),(8,1,10,7,'2026-06-26 12:51:03.038'),(9,1,11,8,'2026-06-26 12:51:03.039'),(10,1,12,9,'2026-06-26 12:51:03.041'),(11,1,13,10,'2026-06-26 12:51:03.045'),(12,1,14,11,'2026-06-26 12:51:03.047'),(13,1,15,12,'2026-06-26 12:51:03.049'),(14,1,16,13,'2026-06-26 12:51:03.050'),(15,1,17,14,'2026-06-26 12:51:03.052'),(16,1,18,15,'2026-06-26 12:51:03.054'),(17,1,19,16,'2026-06-26 12:51:03.056'),(18,1,20,17,'2026-06-26 12:51:03.058'),(19,1,21,18,'2026-06-26 12:51:03.059'),(20,2,22,0,'2026-06-26 14:28:29.675'),(21,2,23,1,'2026-06-26 14:28:29.678'),(22,2,24,2,'2026-06-26 14:28:29.680'),(23,2,25,3,'2026-06-26 14:28:29.681'),(24,2,26,4,'2026-06-26 14:28:29.682'),(25,2,27,5,'2026-06-26 14:28:29.683'),(26,2,28,6,'2026-06-26 14:28:29.684'),(27,2,29,7,'2026-06-26 14:28:29.686'),(28,2,30,8,'2026-06-26 14:28:29.687'),(29,2,31,9,'2026-06-26 14:28:29.688'),(30,2,32,10,'2026-06-26 14:28:29.689'),(31,2,33,11,'2026-06-26 14:28:29.691'),(32,2,34,12,'2026-06-26 14:28:29.692'),(33,2,35,13,'2026-06-26 14:28:29.694'),(34,2,36,14,'2026-06-26 14:28:29.695'),(35,2,37,15,'2026-06-26 14:28:29.696'),(36,2,38,16,'2026-06-26 14:28:29.698'),(37,2,39,17,'2026-06-26 14:28:29.699'),(38,2,40,18,'2026-06-26 14:28:29.700');
/*!40000 ALTER TABLE `collection_resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collections`
--

DROP TABLE IF EXISTS `collections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `collections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cover_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT '0',
  `parent_id` int(11) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `resource_count` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `collections_user_id_idx` (`user_id`),
  KEY `collections_parent_id_fkey` (`parent_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collections`
--

LOCK TABLES `collections` WRITE;
/*!40000 ALTER TABLE `collections` DISABLE KEYS */;
INSERT INTO `collections` VALUES (1,1,'AI 大模型学习资源','从零开始学 AI 大模型，B站免费资源合集',NULL,1,NULL,0,19,'2026-06-26 12:51:03.023','2026-06-26 12:51:03.023'),(2,1,'AI 大模型学习资源','从零开始学 AI 大模型，B站免费资源合集',NULL,1,NULL,0,19,'2026-06-26 14:28:29.672','2026-06-26 14:28:29.672');
/*!40000 ALTER TABLE `collections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `comments_resource_id_idx` (`resource_id`),
  KEY `comments_user_id_fkey` (`user_id`),
  KEY `comments_parent_id_fkey` (`parent_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follows`
--

DROP TABLE IF EXISTS `follows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `follows` (
  `follower_id` int(11) NOT NULL,
  `following_id` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`follower_id`,`following_id`),
  KEY `follows_following_id_fkey` (`following_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follows`
--

LOCK TABLES `follows` WRITE;
/*!40000 ALTER TABLE `follows` DISABLE KEYS */;
/*!40000 ALTER TABLE `follows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `learning_path_items`
--

DROP TABLE IF EXISTS `learning_path_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `learning_path_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `path_id` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'not_started',
  `completed_at` datetime(3) DEFAULT NULL,
  `note` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `learning_path_items_path_id_idx` (`path_id`),
  KEY `learning_path_items_resource_id_fkey` (`resource_id`)
) ENGINE=MyISAM AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learning_path_items`
--

LOCK TABLES `learning_path_items` WRITE;
/*!40000 ALTER TABLE `learning_path_items` DISABLE KEYS */;
INSERT INTO `learning_path_items` VALUES (1,1,3,0,'not_started',NULL,NULL),(2,1,4,1,'not_started',NULL,NULL),(3,1,5,2,'not_started',NULL,NULL),(4,1,6,3,'not_started',NULL,NULL),(5,1,7,4,'not_started',NULL,NULL),(6,1,8,5,'not_started',NULL,NULL),(7,1,9,6,'not_started',NULL,NULL),(8,1,10,7,'not_started',NULL,NULL),(9,1,11,8,'not_started',NULL,NULL),(10,1,12,9,'not_started',NULL,NULL),(11,1,13,10,'not_started',NULL,NULL),(12,1,14,11,'not_started',NULL,NULL),(13,1,15,12,'not_started',NULL,NULL),(14,1,16,13,'not_started',NULL,NULL),(15,1,17,14,'not_started',NULL,NULL),(16,1,18,15,'not_started',NULL,NULL),(17,1,19,16,'not_started',NULL,NULL),(18,1,20,17,'not_started',NULL,NULL),(19,1,21,18,'not_started',NULL,NULL),(20,2,3,0,'not_started',NULL,NULL),(21,2,4,1,'not_started',NULL,NULL),(22,2,5,2,'not_started',NULL,NULL),(23,2,6,3,'not_started',NULL,NULL),(24,2,7,4,'not_started',NULL,NULL),(25,2,8,5,'not_started',NULL,NULL),(26,2,9,6,'not_started',NULL,NULL),(27,2,10,7,'not_started',NULL,NULL),(28,2,11,8,'not_started',NULL,NULL),(29,2,12,9,'not_started',NULL,NULL),(30,2,13,10,'not_started',NULL,NULL),(31,2,14,11,'not_started',NULL,NULL),(32,2,15,12,'not_started',NULL,NULL),(33,2,16,13,'not_started',NULL,NULL),(34,2,17,14,'not_started',NULL,NULL),(35,2,18,15,'not_started',NULL,NULL),(36,2,19,16,'not_started',NULL,NULL),(37,2,20,17,'not_started',NULL,NULL),(38,2,21,18,'not_started',NULL,NULL),(39,3,22,0,'not_started',NULL,NULL),(40,3,23,1,'not_started',NULL,NULL),(41,3,24,2,'not_started',NULL,NULL),(42,3,25,3,'not_started',NULL,NULL),(43,3,26,4,'not_started',NULL,NULL),(44,3,27,5,'not_started',NULL,NULL),(45,3,28,6,'not_started',NULL,NULL),(46,3,29,7,'not_started',NULL,NULL),(47,3,30,8,'not_started',NULL,NULL),(48,3,31,9,'not_started',NULL,NULL),(49,3,32,10,'not_started',NULL,NULL),(50,3,33,11,'not_started',NULL,NULL),(51,3,34,12,'not_started',NULL,NULL),(52,3,35,13,'not_started',NULL,NULL),(53,3,36,14,'not_started',NULL,NULL),(54,3,37,15,'not_started',NULL,NULL),(55,3,38,16,'not_started',NULL,NULL),(56,3,39,17,'not_started',NULL,NULL),(57,3,40,18,'not_started',NULL,NULL);
/*!40000 ALTER TABLE `learning_path_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `learning_paths`
--

DROP TABLE IF EXISTS `learning_paths`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `learning_paths` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cover_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT '0',
  `fork_count` int(11) NOT NULL DEFAULT '0',
  `fork_from` int(11) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `learning_paths_user_id_idx` (`user_id`),
  KEY `learning_paths_fork_from_fkey` (`fork_from`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learning_paths`
--

LOCK TABLES `learning_paths` WRITE;
/*!40000 ALTER TABLE `learning_paths` DISABLE KEYS */;
INSERT INTO `learning_paths` VALUES (1,1,'? AI 大模型学习路线图','B站为主，全部免费，中文友好，从零到独立开发。6个阶段，25+资源，约16-20周。',NULL,1,1,NULL,'2026-06-26 12:51:02.992','2026-06-26 12:54:09.595'),(2,2,'? AI 大模型学习路线图 (Fork)','B站为主，全部免费，中文友好，从零到独立开发。6个阶段，25+资源，约16-20周。',NULL,0,0,1,'2026-06-26 12:54:09.590','2026-06-26 12:54:09.590'),(3,1,'? AI 大模型学习路线图','B站为主，全部免费，中文友好，从零到独立开发。6个阶段，25+资源，约16-20周。',NULL,1,0,NULL,'2026-06-26 14:28:29.640','2026-06-26 14:28:29.640');
/*!40000 ALTER TABLE `learning_paths` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `likes` (
  `user_id` int(11) NOT NULL,
  `resource_id` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`user_id`,`resource_id`),
  KEY `likes_resource_id_fkey` (`resource_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `related_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_is_read_idx` (`user_id`,`is_read`),
  KEY `notifications_created_at_idx` (`created_at`),
  KEY `notifications_sender_id_fkey` (`sender_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operation_logs`
--

DROP TABLE IF EXISTS `operation_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `operation_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_id` int(11) NOT NULL,
  `detail` text COLLATE utf8mb4_unicode_ci,
  `ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `operation_logs_user_id_idx` (`user_id`),
  KEY `operation_logs_created_at_idx` (`created_at`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operation_logs`
--

LOCK TABLES `operation_logs` WRITE;
/*!40000 ALTER TABLE `operation_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `operation_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_tags`
--

DROP TABLE IF EXISTS `resource_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `resource_tags` (
  `resource_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`resource_id`,`tag_id`),
  KEY `resource_tags_tag_id_fkey` (`tag_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_tags`
--

LOCK TABLES `resource_tags` WRITE;
/*!40000 ALTER TABLE `resource_tags` DISABLE KEYS */;
INSERT INTO `resource_tags` VALUES (1,1,'2026-06-26 12:50:52.473'),(1,3,'2026-06-26 12:50:52.473'),(1,16,'2026-06-26 12:50:52.473'),(2,1,'2026-06-26 12:50:52.480'),(2,3,'2026-06-26 12:50:52.480'),(2,16,'2026-06-26 12:50:52.480'),(3,6,'2026-06-26 12:51:02.929'),(3,31,'2026-06-26 12:51:02.929'),(3,32,'2026-06-26 12:51:02.929'),(3,33,'2026-06-26 12:51:02.929'),(4,6,'2026-06-26 12:51:02.946'),(4,31,'2026-06-26 12:51:02.946'),(4,32,'2026-06-26 12:51:02.946'),(4,33,'2026-06-26 12:51:02.946'),(5,6,'2026-06-26 12:51:02.950'),(5,31,'2026-06-26 12:51:02.950'),(5,32,'2026-06-26 12:51:02.950'),(5,33,'2026-06-26 12:51:02.950'),(6,21,'2026-06-26 12:51:02.956'),(6,31,'2026-06-26 12:51:02.956'),(6,32,'2026-06-26 12:51:02.956'),(6,33,'2026-06-26 12:51:02.956'),(7,21,'2026-06-26 12:51:02.958'),(7,22,'2026-06-26 12:51:02.958'),(7,31,'2026-06-26 12:51:02.958'),(7,32,'2026-06-26 12:51:02.958'),(7,33,'2026-06-26 12:51:02.958'),(8,22,'2026-06-26 12:51:02.960'),(8,23,'2026-06-26 12:51:02.960'),(8,31,'2026-06-26 12:51:02.960'),(8,32,'2026-06-26 12:51:02.960'),(8,33,'2026-06-26 12:51:02.960'),(9,22,'2026-06-26 12:51:02.963'),(9,23,'2026-06-26 12:51:02.963'),(9,31,'2026-06-26 12:51:02.963'),(9,32,'2026-06-26 12:51:02.963'),(9,33,'2026-06-26 12:51:02.963'),(10,24,'2026-06-26 12:51:02.965'),(10,25,'2026-06-26 12:51:02.965'),(10,31,'2026-06-26 12:51:02.965'),(10,32,'2026-06-26 12:51:02.965'),(10,33,'2026-06-26 12:51:02.965'),(11,24,'2026-06-26 12:51:02.968'),(11,31,'2026-06-26 12:51:02.968'),(11,32,'2026-06-26 12:51:02.968'),(11,33,'2026-06-26 12:51:02.968'),(12,25,'2026-06-26 12:51:02.970'),(12,31,'2026-06-26 12:51:02.970'),(12,32,'2026-06-26 12:51:02.970'),(12,33,'2026-06-26 12:51:02.970'),(13,22,'2026-06-26 12:51:02.972'),(13,31,'2026-06-26 12:51:02.972'),(13,32,'2026-06-26 12:51:02.972'),(13,33,'2026-06-26 12:51:02.972'),(14,30,'2026-06-26 12:51:02.974'),(14,25,'2026-06-26 12:51:02.974'),(14,31,'2026-06-26 12:51:02.974'),(14,32,'2026-06-26 12:51:02.974'),(14,33,'2026-06-26 12:51:02.974'),(15,26,'2026-06-26 12:51:02.976'),(15,25,'2026-06-26 12:51:02.976'),(15,31,'2026-06-26 12:51:02.976'),(15,32,'2026-06-26 12:51:02.976'),(15,33,'2026-06-26 12:51:02.976'),(15,34,'2026-06-26 12:51:02.976'),(16,27,'2026-06-26 12:51:02.978'),(16,28,'2026-06-26 12:51:02.978'),(16,25,'2026-06-26 12:51:02.978'),(16,31,'2026-06-26 12:51:02.978'),(16,32,'2026-06-26 12:51:02.978'),(16,33,'2026-06-26 12:51:02.978'),(16,34,'2026-06-26 12:51:02.978'),(17,25,'2026-06-26 12:51:02.980'),(17,31,'2026-06-26 12:51:02.980'),(17,32,'2026-06-26 12:51:02.980'),(17,33,'2026-06-26 12:51:02.980'),(18,29,'2026-06-26 12:51:02.983'),(18,25,'2026-06-26 12:51:02.983'),(18,31,'2026-06-26 12:51:02.983'),(18,32,'2026-06-26 12:51:02.983'),(18,33,'2026-06-26 12:51:02.983'),(18,34,'2026-06-26 12:51:02.983'),(19,25,'2026-06-26 12:51:02.985'),(19,31,'2026-06-26 12:51:02.985'),(19,32,'2026-06-26 12:51:02.985'),(19,33,'2026-06-26 12:51:02.985'),(20,25,'2026-06-26 12:51:02.987'),(20,31,'2026-06-26 12:51:02.987'),(20,32,'2026-06-26 12:51:02.987'),(20,33,'2026-06-26 12:51:02.987'),(21,25,'2026-06-26 12:51:02.989'),(21,31,'2026-06-26 12:51:02.989'),(21,32,'2026-06-26 12:51:02.989'),(21,33,'2026-06-26 12:51:02.989'),(22,6,'2026-06-26 14:28:29.592'),(22,31,'2026-06-26 14:28:29.592'),(22,32,'2026-06-26 14:28:29.592'),(22,33,'2026-06-26 14:28:29.592'),(23,6,'2026-06-26 14:28:29.597'),(23,31,'2026-06-26 14:28:29.597'),(23,32,'2026-06-26 14:28:29.597'),(23,33,'2026-06-26 14:28:29.597'),(24,6,'2026-06-26 14:28:29.600'),(24,31,'2026-06-26 14:28:29.600'),(24,32,'2026-06-26 14:28:29.600'),(24,33,'2026-06-26 14:28:29.600'),(25,21,'2026-06-26 14:28:29.602'),(25,31,'2026-06-26 14:28:29.602'),(25,32,'2026-06-26 14:28:29.602'),(25,33,'2026-06-26 14:28:29.602'),(26,21,'2026-06-26 14:28:29.605'),(26,22,'2026-06-26 14:28:29.605'),(26,31,'2026-06-26 14:28:29.605'),(26,32,'2026-06-26 14:28:29.605'),(26,33,'2026-06-26 14:28:29.605'),(27,22,'2026-06-26 14:28:29.607'),(27,23,'2026-06-26 14:28:29.607'),(27,31,'2026-06-26 14:28:29.607'),(27,32,'2026-06-26 14:28:29.607'),(27,33,'2026-06-26 14:28:29.607'),(28,22,'2026-06-26 14:28:29.609'),(28,23,'2026-06-26 14:28:29.609'),(28,31,'2026-06-26 14:28:29.609'),(28,32,'2026-06-26 14:28:29.609'),(28,33,'2026-06-26 14:28:29.609'),(29,24,'2026-06-26 14:28:29.611'),(29,25,'2026-06-26 14:28:29.611'),(29,31,'2026-06-26 14:28:29.611'),(29,32,'2026-06-26 14:28:29.611'),(29,33,'2026-06-26 14:28:29.611'),(30,24,'2026-06-26 14:28:29.614'),(30,31,'2026-06-26 14:28:29.614'),(30,32,'2026-06-26 14:28:29.614'),(30,33,'2026-06-26 14:28:29.614'),(31,25,'2026-06-26 14:28:29.616'),(31,31,'2026-06-26 14:28:29.616'),(31,32,'2026-06-26 14:28:29.616'),(31,33,'2026-06-26 14:28:29.616'),(32,22,'2026-06-26 14:28:29.618'),(32,31,'2026-06-26 14:28:29.618'),(32,32,'2026-06-26 14:28:29.618'),(32,33,'2026-06-26 14:28:29.618'),(33,30,'2026-06-26 14:28:29.621'),(33,25,'2026-06-26 14:28:29.621'),(33,31,'2026-06-26 14:28:29.621'),(33,32,'2026-06-26 14:28:29.621'),(33,33,'2026-06-26 14:28:29.621'),(34,26,'2026-06-26 14:28:29.623'),(34,25,'2026-06-26 14:28:29.623'),(34,31,'2026-06-26 14:28:29.623'),(34,32,'2026-06-26 14:28:29.623'),(34,33,'2026-06-26 14:28:29.623'),(34,34,'2026-06-26 14:28:29.623'),(35,27,'2026-06-26 14:28:29.625'),(35,28,'2026-06-26 14:28:29.625'),(35,25,'2026-06-26 14:28:29.625'),(35,31,'2026-06-26 14:28:29.625'),(35,32,'2026-06-26 14:28:29.625'),(35,33,'2026-06-26 14:28:29.625'),(35,34,'2026-06-26 14:28:29.625'),(36,25,'2026-06-26 14:28:29.628'),(36,31,'2026-06-26 14:28:29.628'),(36,32,'2026-06-26 14:28:29.628'),(36,33,'2026-06-26 14:28:29.628'),(37,29,'2026-06-26 14:28:29.630'),(37,25,'2026-06-26 14:28:29.630'),(37,31,'2026-06-26 14:28:29.630'),(37,32,'2026-06-26 14:28:29.630'),(37,33,'2026-06-26 14:28:29.630'),(37,34,'2026-06-26 14:28:29.630'),(38,25,'2026-06-26 14:28:29.633'),(38,31,'2026-06-26 14:28:29.633'),(38,32,'2026-06-26 14:28:29.633'),(38,33,'2026-06-26 14:28:29.633'),(39,25,'2026-06-26 14:28:29.635'),(39,31,'2026-06-26 14:28:29.635'),(39,32,'2026-06-26 14:28:29.635'),(39,33,'2026-06-26 14:28:29.635'),(40,25,'2026-06-26 14:28:29.638'),(40,31,'2026-06-26 14:28:29.638'),(40,32,'2026-06-26 14:28:29.638'),(40,33,'2026-06-26 14:28:29.638');
/*!40000 ALTER TABLE `resource_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resources`
--

DROP TABLE IF EXISTS `resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `cover_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'article',
  `language` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT '1',
  `view_count` int(11) NOT NULL DEFAULT '0',
  `like_count` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `resources_user_id_idx` (`user_id`),
  KEY `resources_type_idx` (`type`),
  KEY `resources_created_at_idx` (`created_at`)
) ENGINE=MyISAM AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resources`
--

LOCK TABLES `resources` WRITE;
/*!40000 ALTER TABLE `resources` DISABLE KEYS */;
INSERT INTO `resources` VALUES (1,1,'React 官方文档','https://react.dev','React 官方最新文档，包含 Hooks、Server Components 等新特性',NULL,NULL,'documentation',NULL,'react.dev',1,0,0,'2026-06-26 12:50:52.473','2026-06-26 12:50:52.473'),(2,1,'TypeScript 入门教程','https://ts.xcatliu.com','TypeScript 中文入门教程，从零开始学习 TypeScript',NULL,NULL,'documentation',NULL,'xcatliu',1,0,0,'2026-06-26 12:50:52.480','2026-06-26 12:50:52.480'),(3,1,'黑马程序员 Python 入门教程','https://www.bilibili.com/video/BV1qW4y1a7fU','900+集，从安装到实战，适合零基础。B站900万+播放。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.929','2026-06-26 12:51:02.929'),(4,1,'小甲鱼 Python 零基础入门','https://www.bilibili.com/video/BV1Yh411o7Sz','风格幽默，适合小白，讲得通俗易懂。B站600万+播放。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.946','2026-06-26 12:51:02.946'),(5,1,'莫烦 Python 基础 & 数据处理','https://www.bilibili.com/video/BV1uJ411k7wy','短小精悍，每集5-10分钟，适合快速上手。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.950','2026-06-26 12:51:02.950'),(6,1,'吴恩达机器学习（中文字幕）','https://www.bilibili.com/video/BV1Pa411X76s','AI入门圣经，中文翻译版，B站直接看。300万+播放。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.956','2026-06-26 12:51:02.956'),(7,1,'李宏毅 机器学习 2025','https://www.bilibili.com/video/BV1Wv411h7kN','台大教授，中文授课，深入浅出，风格有趣。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.958','2026-06-26 12:51:02.958'),(8,1,'沐神 李沐 动手学深度学习 d2l','https://www.bilibili.com/video/BV1JX4y1d7Jg','配合 d2l.ai 在线教材，边看边敲代码。圣经级教程。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.960','2026-06-26 12:51:02.960'),(9,1,'PyTorch 深度学习实战','https://www.bilibili.com/video/BV1L84y147XU','PyTorch 框架入门，实操为主。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.963','2026-06-26 12:51:02.963'),(10,1,'李宏毅 Transformer 详解','https://www.bilibili.com/video/BV1Rc411W7cV','中文讲解 Transformer 架构，从 Self-Attention 到 Multi-Head。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.965','2026-06-26 12:51:02.965'),(11,1,'李沐 论文精读：Attention Is All You Need','https://www.bilibili.com/video/BV1L84y147jD','逐句解读 Transformer 原始论文，讲透每个细节。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.968','2026-06-26 12:51:02.968'),(12,1,'李沐 论文精读：GPT 系列','https://www.bilibili.com/video/BV1L84y1472B','GPT-1/2/3/4 论文精读，理解大模型演进历程。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.970','2026-06-26 12:51:02.970'),(13,1,'3Blue1Brown 深度学习可视化（中文）','https://www.bilibili.com/video/BV1EM4y1s7Bn','神经网络和 Attention 机制的可视化讲解，直观易懂。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.972','2026-06-26 12:51:02.972'),(14,1,'吴恩达 Prompt Engineering 课（中字）','https://www.bilibili.com/video/BV1No4y1t7Zn','和 OpenAI 合作开发，提示词工程入门必修。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.974','2026-06-26 12:51:02.974'),(15,1,'RAG 检索增强生成 实战教程','https://www.bilibili.com/video/BV1L84y147kF','从向量数据库到 RAG 全流程，手把手教你搭建知识库问答。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.976','2026-06-26 12:51:02.976'),(16,1,'LangChain + Agent 开发实战','https://www.bilibili.com/video/BV1L84y1473G','用 LangChain 搭建 AI Agent，实现工具调用、多步推理。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.978','2026-06-26 12:51:02.978'),(17,1,'OpenAI API & Function Calling 教程','https://www.bilibili.com/video/BV1L84y1475H','学会调用大模型 API，实现 Function Calling 和工具集成。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.980','2026-06-26 12:51:02.980'),(18,1,'LoRA 微调大模型实战','https://www.bilibili.com/video/BV1L84y1476J','手把手教你用 LoRA/QLoRA 微调 Qwen、Llama 等开源模型。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.983','2026-06-26 12:51:02.983'),(19,1,'Ollama 本地部署大模型','https://www.bilibili.com/video/BV1L84y1478L','一行命令本地跑 Qwen、Llama、DeepSeek，小白也能上手。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.985','2026-06-26 12:51:02.985'),(20,1,'vLLM 高性能推理部署','https://www.bilibili.com/video/BV1L84y1479M','企业级推理框架，高并发场景必备。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.987','2026-06-26 12:51:02.987'),(21,1,'llama.cpp 模型量化教程','https://www.bilibili.com/video/BV1L84y147aN','把大模型量化到消费级显卡甚至 CPU 上跑。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 12:51:02.989','2026-06-26 12:51:02.989'),(22,1,'黑马程序员 Python 入门教程','https://www.bilibili.com/video/BV1qW4y1a7fU','900+集，从安装到实战，适合零基础。B站900万+播放。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.592','2026-06-26 14:28:29.592'),(23,1,'小甲鱼 Python 零基础入门','https://www.bilibili.com/video/BV1Yh411o7Sz','风格幽默，适合小白，讲得通俗易懂。B站600万+播放。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.597','2026-06-26 14:28:29.597'),(24,1,'莫烦 Python 基础 & 数据处理','https://www.bilibili.com/video/BV1uJ411k7wy','短小精悍，每集5-10分钟，适合快速上手。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.600','2026-06-26 14:28:29.600'),(25,1,'吴恩达机器学习（中文字幕）','https://www.bilibili.com/video/BV1Pa411X76s','AI入门圣经，中文翻译版，B站直接看。300万+播放。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.602','2026-06-26 14:28:29.602'),(26,1,'李宏毅 机器学习 2025','https://www.bilibili.com/video/BV1Wv411h7kN','台大教授，中文授课，深入浅出，风格有趣。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.605','2026-06-26 14:28:29.605'),(27,1,'沐神 李沐 动手学深度学习 d2l','https://www.bilibili.com/video/BV1JX4y1d7Jg','配合 d2l.ai 在线教材，边看边敲代码。圣经级教程。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.607','2026-06-26 14:28:29.607'),(28,1,'PyTorch 深度学习实战','https://www.bilibili.com/video/BV1L84y147XU','PyTorch 框架入门，实操为主。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.609','2026-06-26 14:28:29.609'),(29,1,'李宏毅 Transformer 详解','https://www.bilibili.com/video/BV1Rc411W7cV','中文讲解 Transformer 架构，从 Self-Attention 到 Multi-Head。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.611','2026-06-26 14:28:29.611'),(30,1,'李沐 论文精读：Attention Is All You Need','https://www.bilibili.com/video/BV1L84y147jD','逐句解读 Transformer 原始论文，讲透每个细节。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.614','2026-06-26 14:28:29.614'),(31,1,'李沐 论文精读：GPT 系列','https://www.bilibili.com/video/BV1L84y1472B','GPT-1/2/3/4 论文精读，理解大模型演进历程。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.616','2026-06-26 14:28:29.616'),(32,1,'3Blue1Brown 深度学习可视化（中文）','https://www.bilibili.com/video/BV1EM4y1s7Bn','神经网络和 Attention 机制的可视化讲解，直观易懂。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.618','2026-06-26 14:28:29.618'),(33,1,'吴恩达 Prompt Engineering 课（中字）','https://www.bilibili.com/video/BV1No4y1t7Zn','和 OpenAI 合作开发，提示词工程入门必修。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.621','2026-06-26 14:28:29.621'),(34,1,'RAG 检索增强生成 实战教程','https://www.bilibili.com/video/BV1L84y147kF','从向量数据库到 RAG 全流程，手把手教你搭建知识库问答。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.623','2026-06-26 14:28:29.623'),(35,1,'LangChain + Agent 开发实战','https://www.bilibili.com/video/BV1L84y1473G','用 LangChain 搭建 AI Agent，实现工具调用、多步推理。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.625','2026-06-26 14:28:29.625'),(36,1,'OpenAI API & Function Calling 教程','https://www.bilibili.com/video/BV1L84y1475H','学会调用大模型 API，实现 Function Calling 和工具集成。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.628','2026-06-26 14:28:29.628'),(37,1,'LoRA 微调大模型实战','https://www.bilibili.com/video/BV1L84y1476J','手把手教你用 LoRA/QLoRA 微调 Qwen、Llama 等开源模型。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.630','2026-06-26 14:28:29.630'),(38,1,'Ollama 本地部署大模型','https://www.bilibili.com/video/BV1L84y1478L','一行命令本地跑 Qwen、Llama、DeepSeek，小白也能上手。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.633','2026-06-26 14:28:29.633'),(39,1,'vLLM 高性能推理部署','https://www.bilibili.com/video/BV1L84y1479M','企业级推理框架，高并发场景必备。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.635','2026-06-26 14:28:29.635'),(40,1,'llama.cpp 模型量化教程','https://www.bilibili.com/video/BV1L84y147aN','把大模型量化到消费级显卡甚至 CPU 上跑。',NULL,NULL,'video',NULL,'bilibili',1,0,0,'2026-06-26 14:28:29.638','2026-06-26 14:28:29.638');
/*!40000 ALTER TABLE `resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `search_history`
--

DROP TABLE IF EXISTS `search_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `search_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `keyword` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `search_history_user_id_idx` (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `search_history`
--

LOCK TABLES `search_history` WRITE;
/*!40000 ALTER TABLE `search_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `search_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#1677ff',
  `usage_count` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `tags_name_key` (`name`),
  KEY `tags_name_idx` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'React','#61dafb',0,'2026-06-26 12:50:52.429'),(2,'Vue','#42b883',0,'2026-06-26 12:50:52.434'),(3,'JavaScript','#f7df1e',0,'2026-06-26 12:50:52.436'),(4,'TypeScript','#3178c6',0,'2026-06-26 12:50:52.438'),(5,'Node.js','#339933',0,'2026-06-26 12:50:52.439'),(6,'Python','#3776ab',0,'2026-06-26 12:50:52.441'),(7,'Java','#ed8b00',0,'2026-06-26 12:50:52.443'),(8,'CSS','#1572b6',0,'2026-06-26 12:50:52.445'),(9,'Docker','#2496ed',0,'2026-06-26 12:50:52.447'),(10,'MySQL','#4479a1',0,'2026-06-26 12:50:52.449'),(11,'Redis','#dc382d',0,'2026-06-26 12:50:52.451'),(12,'Git','#f05032',0,'2026-06-26 12:50:52.453'),(13,'Linux','#fcc624',0,'2026-06-26 12:50:52.455'),(14,'算法','#ff6b6b',0,'2026-06-26 12:50:52.456'),(15,'面试','#ffa94d',0,'2026-06-26 12:50:52.458'),(16,'前端','#a855f7',0,'2026-06-26 12:50:52.461'),(17,'后端','#14b8a6',0,'2026-06-26 12:50:52.463'),(18,'全栈','#ec4899',0,'2026-06-26 12:50:52.465'),(19,'GitHub','#333333',0,'2026-06-26 12:50:52.467'),(20,'源码','#6366f1',0,'2026-06-26 12:50:52.468'),(21,'机器学习','#ff6b6b',0,'2026-06-26 12:51:02.872'),(22,'深度学习','#722ed1',0,'2026-06-26 12:51:02.875'),(23,'PyTorch','#ee4c2c',0,'2026-06-26 12:51:02.878'),(24,'Transformer','#faad14',0,'2026-06-26 12:51:02.879'),(25,'LLM','#1677ff',0,'2026-06-26 12:51:02.882'),(26,'RAG','#52c41a',0,'2026-06-26 12:51:02.885'),(27,'Agent','#eb2f96',0,'2026-06-26 12:51:02.887'),(28,'LangChain','#13c2c2',0,'2026-06-26 12:51:02.891'),(29,'LoRA','#fa541c',0,'2026-06-26 12:51:02.896'),(30,'Prompt','#2f54eb',0,'2026-06-26 12:51:02.900'),(31,'B站','#00a1d6',0,'2026-06-26 12:51:02.903'),(32,'免费','#00ff88',0,'2026-06-26 12:51:02.906'),(33,'视频','#00d2ff',0,'2026-06-26 12:51:02.914'),(34,'实战','#ff69b4',0,'2026-06-26 12:51:02.922');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `url_parse_cache`
--

DROP TABLE IF EXISTS `url_parse_cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `url_parse_cache` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url_hash` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parsed_data` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `expires_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `url_parse_cache_url_hash_key` (`url_hash`),
  KEY `url_parse_cache_expires_at_idx` (`expires_at`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `url_parse_cache`
--

LOCK TABLES `url_parse_cache` WRITE;
/*!40000 ALTER TABLE `url_parse_cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `url_parse_cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_key` (`username`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'demo','demo@devvault.com','$2a$10$zKrJkzjIoZyFYnmeIcdgyOXR9qWuMXv7kfEfmYHicEqIIshFrRe5u',NULL,'DevVault Demo User','user','2026-06-26 12:50:52.422','2026-06-26 12:50:52.422'),(2,'BILSON','1092068543@qq.com','$2a$10$i.EFvR6wKoduJagw41GnkOzRqTna8iM594YHebWZmiMI2xE2jY5YG',NULL,NULL,'user','2026-06-26 12:54:04.055','2026-06-26 12:54:04.055'),(3,'test','test@test.com','$2a$10$MlEvZ1vohO4aMdCLYM1TQOY/YxdAu3Sk.PdkL69VXR7qUlqheMw1y',NULL,NULL,'user','2026-06-26 14:26:07.519','2026-06-26 14:26:07.519');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-26 22:32:43
