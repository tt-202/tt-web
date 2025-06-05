-- Create and use database
CREATE DATABASE IF NOT EXISTS COP4331;
USE COP4331;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
  ID INT NOT NULL AUTO_INCREMENT,
  DateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  DateLastLoggedIn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FirstName VARCHAR(50) NOT NULL DEFAULT '',
  LastName VARCHAR(50) NOT NULL DEFAULT '',
  Login VARCHAR(50) NOT NULL DEFAULT '',
  Password VARCHAR(50) NOT NULL DEFAULT '',
  PRIMARY KEY (ID),
  UNIQUE (Login)
) ENGINE = InnoDB;

-- Create Contacts table
CREATE TABLE IF NOT EXISTS Contacts (
  ID INT NOT NULL AUTO_INCREMENT,
  FirstName VARCHAR(50) NOT NULL DEFAULT '',
  LastName VARCHAR(50) NOT NULL DEFAULT '',
  Phone VARCHAR(50) NOT NULL DEFAULT '',
  Email VARCHAR(50) NOT NULL DEFAULT '',
  UserID INT NOT NULL DEFAULT 0,
  PRIMARY KEY (ID),
  FOREIGN KEY (UserID) REFERENCES Users(ID) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Sample user data with MD5 hashed passwords
INSERT INTO Users (FirstName, LastName, Login, Password) VALUES
('Rick', 'Leinecker', 'RickL', MD5('COP4331')),
('Test', 'Dummy', 'tester', MD5('password')),
('Sam', 'Huang', 'SamH', MD5('test'));

-- Sample contacts for RickL (UserID 1)
INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES
('Oscar', 'Rodriguez', '321-456-7890', 'os12345@ucf.edu', 1),
('Kensley', 'Cadet', '407-420-4545', 'ke54321@ucf.edu', 1),
('Simeon', 'Feliz', '305-789-0123', 'si78901@ucf.edu', 1),
('Max', 'Whitaker', '654-982-4321', 'ma34598@ucf.edu', 1),
('Ify', 'Okafor', '954-123-7575', 'if43871@ucf.edu', 1);

-- Sample contacts for SamH (UserID 3)
INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES
('Oscar', 'Rodriguez', '321-456-7890', 'os12345@ucf.edu', 3),
('Kensley', 'Cadet', '407-420-4545', 'ke54321@ucf.edu', 3),
('Simeon', 'Feliz', '305-789-0123', 'si78901@ucf.edu', 3),
('Max', 'Whitaker', '654-982-4321', 'ma34598@ucf.edu', 3),
('Ify', 'Okafor', '954-123-7575', 'if43871@ucf.edu', 3);

-- Create Dev user and grant privileges
CREATE USER IF NOT EXISTS 'Dev'@'%' IDENTIFIED BY 'WeLoveCOP4331';
GRANT ALL PRIVILEGES ON COP4331.* TO 'Dev'@'%';
FLUSH PRIVILEGES;
