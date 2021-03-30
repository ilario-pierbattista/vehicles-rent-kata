drop database vehicles_rent;

create database vehicles_rent;
use vehicles_rent;

CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plate` varchar(20) NOT NULL,
  `modelName` varchar(60) not null,
  `type` varchar(20) NOT NULL,
  `engineCapacity` int(11) DEFAULT NULL,
  `seats` int(11) default null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

insert into `vehicles` (`plate`, `modelName`, `type`, `engineCapacity`, `seats`) 
values 
('AA123BB', 'Fiat Panda 1.2 Natural Power', 'car', null, 4),
('ER12234', 'Honda a caso', 'moto', 800, null)
