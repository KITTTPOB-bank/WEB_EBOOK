-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: db_project
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administrator`
--

DROP TABLE IF EXISTS `administrator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrator` (
  `user_id` int(10) NOT NULL,
  `salary` float(8,2) DEFAULT NULL,
  KEY `user_id_admin_idx` (`user_id`),
  CONSTRAINT `user_id_admin` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrator`
--

LOCK TABLES `administrator` WRITE;
/*!40000 ALTER TABLE `administrator` DISABLE KEYS */;
INSERT INTO `administrator` VALUES (7,5000.00);
/*!40000 ALTER TABLE `administrator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `author`
--

DROP TABLE IF EXISTS `author`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `author` (
  `bank_number` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `penname` varchar(255) DEFAULT NULL,
  `user_id` int(10) NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `user_id_authorr` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `author`
--

LOCK TABLES `author` WRITE;
/*!40000 ALTER TABLE `author` DISABLE KEYS */;
INSERT INTO `author` VALUES ('57041226410',' Kittipop Pangtrakoon','HachiBank',5),('5704122666','Tetsuya Kuroko','Kurokoshi',6);
/*!40000 ALTER TABLE `author` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book`
--

DROP TABLE IF EXISTS `book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `book` (
  `book_id` int(10) NOT NULL AUTO_INCREMENT,
  `price` float(8,2) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `desc` text,
  `type` varchar(255) DEFAULT NULL,
  `publish_date` date DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT NULL,
  `user_id` int(10) NOT NULL,
  `admin_id` int(10) DEFAULT NULL,
  `bookcontent` text,
  PRIMARY KEY (`book_id`),
  KEY `user_id_owner_book_idx` (`user_id`),
  KEY `admin_id_book_idx` (`admin_id`),
  CONSTRAINT `admin_id_book` FOREIGN KEY (`admin_id`) REFERENCES `administrator` (`user_id`),
  CONSTRAINT `user_id_owner_book` FOREIGN KEY (`user_id`) REFERENCES `author` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book`
--

LOCK TABLES `book` WRITE;
/*!40000 ALTER TABLE `book` DISABLE KEYS */;
INSERT INTO `book` VALUES (1,150.00,'your talent is mine','blahblah','Action, Fantasy','0000-00-00','https://www.thai-novel.com/wp-content/uploads/2021/11/is-mine03-696x984.jpeg','',5,7,'https://www.nekopost.net/novel/11120/1'),(2,200.00,'เกิดใหม่เป็นไข่มังกร','รวยมากคอมพ์นี้','Action, Adventure, Fantasy','2019-07-14','https://www.osemocphoto.com/collectManga/6534/6534_cover.jpg?0','',5,7,'https://www.nekopost.net/novel/6534/1'),(3,299.00,'นิยามแห่งราตรี','คิดไม่ออก','Action, Adventure, Comedy','2021-09-18','https://www.osemocphoto.com/collectManga/10204/10204_cover.jpg?0','active',6,7,'https://www.nekopost.net/novel/10204/0'),(4,170.00,'ชีวิตเกษตกรในต่างโลก','ทำไมไม่ add','Comedy, Romance, Fantasy','2021-10-09','https://www.osemocphoto.com/collectManga/5106/89686/89686_202012301058_1.jpg','inactive',6,7,'https://www.nekopost.net/novel/11078/1'),(5,129.00,'ราชาโลกเบื้องหลัง','หมดยัง','Action, Comedy, Fantasy','2021-05-08','https://www.osemocphoto.com/collectManga/10820/10820_cover.jpg?1','inactive',5,7,'https://www.nekopost.net/novel/10820/1'),(6,100.00,'เรื่องราวของทั้งสอง Ring Of Tale','มั้ง','Action, Adventure, Comedy, Fantasy','2021-10-03','https://www.osemocphoto.com/collectManga/10146/10146_cover.jpg?0','inactive',5,7,'https://www.nekopost.net/novel/10146/0');
/*!40000 ALTER TABLE `book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` int(10) NOT NULL,
  `create_date` date DEFAULT NULL,
  `total_price` float(8,2) DEFAULT NULL,
  `user_id` int(10) NOT NULL,
  `promotion_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`cart_id`),
  KEY `user_id_cart_idx` (`user_id`),
  KEY `promotion_id_cart_idx` (`promotion_id`),
  CONSTRAINT `promotion_id_cart` FOREIGN KEY (`promotion_id`) REFERENCES `promotion` (`promotion_id`),
  CONSTRAINT `user_id_cart` FOREIGN KEY (`user_id`) REFERENCES `customer` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,'2022-10-03',469.00,2,NULL),(2,'2022-02-01',239.50,4,1),(3,'2022-03-22',10.00,3,3),(4,'2022-02-02',329.00,8,NULL);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
  `item_no` int(10) NOT NULL,
  `book_id` int(10) NOT NULL,
  `price` float(8,2) DEFAULT NULL,
  `cart_id` int(10) NOT NULL,
  PRIMARY KEY (`item_no`,`cart_id`),
  KEY `book_id_cart_item_idx` (`book_id`),
  KEY `cart_id_idx` (`cart_id`),
  CONSTRAINT `book_id_cart_item` FOREIGN KEY (`book_id`) REFERENCES `book` (`book_id`),
  CONSTRAINT `cart_id` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES (1,4,170.00,1),(2,3,299.00,1),(3,2,200.00,2),(4,5,129.00,2),(5,1,150.00,2),(6,6,100.00,3),(7,2,200.00,2),(7,2,200.00,4),(8,5,129.00,4);
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `user_id` int(10) NOT NULL,
  KEY `user_id_idx` (`user_id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1),(2),(3),(4),(5),(6),(8);
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `order_id` int(10) NOT NULL AUTO_INCREMENT,
  `payment_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `payment_id_order_idx` (`payment_id`),
  CONSTRAINT `payment_id_order` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`payment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` int(10) NOT NULL AUTO_INCREMENT,
  `purchase_date` datetime DEFAULT NULL,
  `cart_id` int(10) NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `cart_id_payment_idx` (`cart_id`),
  CONSTRAINT `cart_id_payment` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3230234 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (3230230,'2020-04-16 11:23:12',1),(3230231,'2021-04-16 02:29:23',2),(3230232,'2022-04-16 07:34:12',3),(3230233,'2022-02-02 07:35:12',4);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion`
--

DROP TABLE IF EXISTS `promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion` (
  `promotion_id` int(10) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `desc` text,
  `expire_date` datetime DEFAULT NULL,
  `admin_id` int(10) NOT NULL,
  `promotioncol` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`promotion_id`),
  KEY `admin_id_promo_idx` (`admin_id`),
  CONSTRAINT `admin_id_promo` FOREIGN KEY (`admin_id`) REFERENCES `administrator` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion`
--

LOCK TABLES `promotion` WRITE;
/*!40000 ALTER TABLE `promotion` DISABLE KEYS */;
INSERT INTO `promotion` VALUES (1,'ฉลองเปิดใหม่','ลด50%','2022-03-30 11:50:59',7,NULL),(2,'ลดไปเรื่อย','ลด30%','2022-03-30 10:05:59',7,NULL),(3,'ลดกว่านี้ก็แจกฟรีแล้ว','ลด90%','2022-03-05 10:59:00',7,NULL);
/*!40000 ALTER TABLE `promotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int(10) NOT NULL AUTO_INCREMENT,
  `fname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `sex` enum('Male','Female','Other') DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `age` int(2) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Nottawee','Lamintha','nottawee443@hotmail.com','Male','0000-00-00',22,'notte443','notPassword123'),(2,'Chatchanon','Keawsukkho','63070033@gmail.com','Male','1997-03-24',25,'Minari1997','Jorabador123'),(3,'Ittiporn','Kuljitiwattana','63070190@gmail.com','Male','2001-08-02',21,'IttipornKuljitEiei','Itdiff6969'),(4,'Kaiwin','Naw-in','63070013@gmail.com','Male','2002-03-22',20,'ultraname','ultraPassword555'),(5,'Kittipop','Pangtrakoon','63070010@gmail.com','Male','1992-12-23',30,'BangZaeiei','Mahathep_banker12'),(6,'Tetsuya','Kuroko','kurokolnwza007@gmail.com','Male','1995-10-01',27,'Kuroko007','basket_kuroko'),(7,'Eren','Yeager','ssakeyo223@gmail.com','Male','1995-01-13',27,'eren223','FreedomBehindTheWall223'),(8,'Tangiro','sanmi','Tangiro007@gmail.com','Male','2002-03-15',20,'Tangiro007','Tangiro4321');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-23  6:38:56
