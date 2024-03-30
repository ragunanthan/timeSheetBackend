-- Create User table
CREATE TABLE `User` (
  `User_ID` INT NOT NULL AUTO_INCREMENT,
  `Username` VARCHAR(50) NOT NULL,
  `Email` VARCHAR(60) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`User_ID`)
);

-- Insert data into User table
INSERT INTO `User` (`User_ID`, `Username`, `Email`, `Password`) VALUES 
(1, 'Nan', 'nan@gmail.com', '12345'),
(2, 'Jan', 'jan@gmail.com', '12345');


-- Create Type table
CREATE TABLE `Type` (
  `Type_ID` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(50) NOT NULL,
  `Price` DECIMAL(8,2) NOT NULL,
  `IsActive` TINYINT NOT NULL,
  PRIMARY KEY (`Type_ID`)
);

-- Insert data into Type table
INSERT INTO `Type` (`Type_ID`, `Name`, `Price`, `IsActive`) VALUES 
(1, 'Nan', '120.00', 1),
(2, 'Jan', '120.00', 1);

-- Create Project table
CREATE TABLE `Project` (
  `Project_ID` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(60) NOT NULL,
  `Owner` VARCHAR(60) NOT NULL,
  `CreatedDate` DATETIME NOT NULL,
  PRIMARY KEY (`Project_ID`)
);

-- Insert data into Project table
INSERT INTO `Project` (`Project_ID`, `Name`, `Owner`, `CreatedDate`) VALUES 
(1, 'Nan', 'Nan', '2024-03-28'),
(2, 'Jan', 'Jan', '2024-03-28');


-- Create Timesheet table
CREATE TABLE `Timesheet` (
  `Timesheet_ID` INT NOT NULL AUTO_INCREMENT,
  `Date` DATETIME NOT NULL,
  `Description` VARCHAR(250) NOT NULL,
  `Type_ID` INT NOT NULL,
  `User_ID` INT NOT NULL,
  `Project_ID` INT NOT NULL,
  PRIMARY KEY (`Timesheet_ID`)
);

-- Add foreign key constraints after creating all referenced tables
ALTER TABLE `Timesheet`
ADD CONSTRAINT `fk_timesheet_type` FOREIGN KEY (`Type_ID`) REFERENCES `Type`(`Type_ID`),
ADD CONSTRAINT `fk_timesheet_user` FOREIGN KEY (`User_ID`) REFERENCES `User`(`User_ID`),
ADD CONSTRAINT `fk_timesheet_project` FOREIGN KEY (`Project_ID`) REFERENCES `Project`(`Project_ID`);


-- Insert data into Timesheet table
INSERT INTO `Timesheet` (`Timesheet_ID`, `Date`, `Description`, `Type_ID`, `User_ID`, `Project_ID`) VALUES 
(1, '2024-03-28', 'Created sql schema', 1, 1, 1),
(2, '2024-03-28', 'Created sql table', 2, 2, 2);
