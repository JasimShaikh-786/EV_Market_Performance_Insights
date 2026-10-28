-- ============================================================
-- Electric Vehicle Market Performance & Insights
-- Database Schema + Data Population
-- Author: EV Market Analytics Project
-- Date: 2026-10-28
-- ============================================================

-- Create and use the EV database
CREATE DATABASE IF NOT EXISTS ev_market_db;
USE ev_market_db;

-- ============================================================
-- TABLE: ev_vehicles
-- ============================================================
DROP TABLE IF EXISTS ev_vehicles;
CREATE TABLE ev_vehicles (
    Vehicle_ID      VARCHAR(10)     PRIMARY KEY,
    Brand           VARCHAR(50)     NOT NULL,
    Model           VARCHAR(100)    NOT NULL,
    Category        VARCHAR(50)     NOT NULL,
    Year            INT             NOT NULL,
    Battery_Tech    VARCHAR(30)     NOT NULL,
    Battery_Capacity_kWh    DECIMAL(6,2),
    Driving_Range_km        INT,
    Charging_Speed_kW       INT,
    Price_USD               DECIMAL(10,2),
    Annual_Sales            INT,
    Market_Share_Percent    DECIMAL(5,2),
    Manufacturing_Country   VARCHAR(50),
    Customer_Rating         DECIMAL(3,1),
    Lifespan_Years          INT,
    CO2_Saved_kg_per_year   INT
);

-- ============================================================
-- DATA INSERTION
-- ============================================================
INSERT INTO ev_vehicles VALUES
('EV001','Tesla','Model 3','Sedan',2023,'NCA',82,576,250,42990,453450,18.2,'USA',4.7,10,2300),
('EV002','Tesla','Model Y','SUV',2023,'NCA',75,531,250,52990,604000,24.3,'USA',4.8,10,2100),
('EV003','Tesla','Model S','Sedan',2023,'NCA',100,652,250,89990,71245,2.9,'USA',4.9,12,2600),
('EV004','Tesla','Model X','SUV',2023,'NCA',100,560,250,109990,35000,1.4,'USA',4.8,12,2400),
('EV005','BYD','Atto 3','SUV',2023,'LFP',60,480,80,38000,243000,9.8,'China',4.3,10,1900),
('EV006','BYD','Han EV','Sedan',2023,'LFP',85,605,120,45000,187000,7.5,'China',4.4,10,2350),
('EV007','BYD','Dolphin','Hatchback',2023,'LFP',44,427,60,28000,164000,6.6,'China',4.2,8,1700),
('EV008','BYD','Tang EV','SUV',2023,'LFP',108,700,110,55000,92000,3.7,'China',4.3,10,2800),
('EV009','Volkswagen','ID.4','SUV',2023,'NMC',77,522,135,43995,141000,5.7,'Germany',4.4,10,2050),
('EV010','Volkswagen','ID.3','Hatchback',2023,'NMC',58,426,130,39995,88000,3.5,'Germany',4.3,9,1680),
('EV011','Volkswagen','ID.6','SUV',2023,'NMC',84,588,135,52000,34000,1.4,'Germany',4.2,10,2300),
('EV012','Hyundai','IONIQ 5','SUV',2023,'NMC',77,508,230,43450,106000,4.3,'South Korea',4.6,10,2000),
('EV013','Hyundai','IONIQ 6','Sedan',2023,'NMC',77,614,230,38615,54000,2.2,'South Korea',4.7,10,2400),
('EV014','Kia','EV6','SUV',2023,'NMC',77,528,230,42600,91000,3.7,'South Korea',4.6,10,2100),
('EV015','Kia','EV9','SUV',2023,'NMC',99,541,230,54900,38000,1.5,'South Korea',4.5,10,2050),
('EV016','Rivian','R1T','Truck',2023,'NMC',135,515,216,67500,14265,0.6,'USA',4.5,10,2200),
('EV017','Rivian','R1S','SUV',2023,'NMC',135,516,216,78000,11000,0.4,'USA',4.6,10,2150),
('EV018','GM','Chevrolet Bolt','Hatchback',2023,'NMC',65,417,80,26500,63000,2.5,'USA',4.1,9,1650),
('EV019','GM','Cadillac LYRIQ','SUV',2023,'NMC',102,530,190,62990,23000,0.9,'USA',4.4,10,2100),
('EV020','Ford','Mustang Mach-E','SUV',2023,'NMC',91,483,150,43995,53000,2.1,'USA',4.3,10,1900),
('EV021','Ford','F-150 Lightning','Truck',2023,'NMC',131,515,150,49995,25000,1.0,'USA',4.4,10,2300),
('EV022','NIO','ET5','Sedan',2023,'Solid-State',75,1000,130,52000,55000,2.2,'China',4.8,10,2400),
('EV023','NIO','ES6','SUV',2023,'NMC',75,580,130,58000,43000,1.7,'China',4.7,10,2200),
('EV024','Xpeng','P7','Sedan',2023,'NMC',80,670,80,38000,32000,1.3,'China',4.4,9,2500),
('EV025','Xpeng','G9','SUV',2023,'NMC',98,570,480,52000,28000,1.1,'China',4.3,9,2250),
('EV026','Mercedes','EQS','Sedan',2023,'NMC',107,857,200,104400,25000,1.0,'Germany',4.9,12,3200),
('EV027','Mercedes','EQB','SUV',2023,'NMC',66,426,100,53000,36000,1.4,'Germany',4.5,10,1680),
('EV028','BMW','iX','SUV',2023,'NMC',111,630,200,87100,34000,1.4,'Germany',4.6,10,2500),
('EV029','BMW','i4','Sedan',2023,'NMC',83,590,205,55900,55000,2.2,'Germany',4.7,10,2300),
('EV030','Audi','Q4 e-tron','SUV',2023,'NMC',77,530,135,49000,47000,1.9,'Germany',4.4,10,2100),
('EV031','Polestar','Polestar 2','Sedan',2023,'NMC',78,540,205,45900,34000,1.4,'Sweden',4.6,10,2150),
('EV032','Lucid','Air','Sedan',2023,'NCA',118,837,924,138000,6200,0.2,'USA',4.8,12,3200),
('EV033','Zeekr','001','Hatchback',2023,'NMC',100,1032,200,42000,31000,1.2,'China',4.5,9,2600),
('EV034','SAIC','MG4','Hatchback',2023,'LFP',64,450,135,32000,78000,3.1,'China',4.2,8,1800),
('EV035','Renault','Megane E-Tech','Hatchback',2023,'NMC',60,450,130,37000,45000,1.8,'France',4.3,9,1800),
('EV036','Nissan','Leaf','Hatchback',2022,'NMC',40,270,50,27400,51000,2.0,'Japan',4.0,8,1100),
('EV037','Nissan','Ariya','SUV',2023,'NMC',87,533,130,45000,34000,1.4,'Japan',4.4,10,2100),
('EV038','Toyota','bZ4X','SUV',2023,'NMC',72,500,150,43000,30000,1.2,'Japan',4.2,10,1970),
('EV039','Honda','Prologue','SUV',2023,'NMC',85,476,150,47400,18000,0.7,'Japan',4.1,10,1880),
('EV040','Stellantis','Fiat 500e','Hatchback',2023,'NMC',37,320,85,34000,42000,1.7,'Italy',4.3,8,1270),
('EV041','Tesla','Cybertruck','Truck',2023,'NCA',123,547,250,60990,9000,0.4,'USA',4.5,10,2200),
('EV042','BYD','Seal','Sedan',2023,'LFP',82,700,120,42000,94000,3.8,'China',4.5,10,2750),
('EV043','BYD','Song Plus','SUV',2023,'LFP',87,600,110,38000,156000,6.3,'China',4.4,10,2350),
('EV044','Zeekr','X','SUV',2023,'NMC',66,560,180,29000,22000,0.9,'China',4.4,8,2200),
('EV045','Li Auto','L9','SUV',2023,'NMC',44,1315,100,65000,76000,3.1,'China',4.6,9,1800),
('EV046','AITO','M7','SUV',2023,'NMC',40,1200,100,48000,94000,3.8,'China',4.5,9,1750),
('EV047','GM','GMC Hummer EV','Truck',2023,'NMC',212,563,350,79995,14000,0.6,'USA',4.4,10,2200),
('EV048','Volkswagen','ID.5','SUV',2023,'NMC',77,520,135,50000,41000,1.6,'Germany',4.3,10,2050),
('EV049','Stellantis','Jeep Avenger','SUV',2023,'NMC',54,400,100,41000,38000,1.5,'France',4.2,9,1580),
('EV050','Hyundai','Kona Electric','Hatchback',2023,'NMC',64,490,102,35000,47000,1.9,'South Korea',4.3,9,1940);

-- ============================================================
-- ANALYTICAL SQL QUERIES
-- ============================================================

-- 1. Total Annual Sales by Brand
SELECT Brand,
       SUM(Annual_Sales) AS Total_Sales,
       ROUND(SUM(Market_Share_Percent), 2) AS Total_Market_Share
FROM ev_vehicles
GROUP BY Brand
ORDER BY Total_Sales DESC;

-- 2. Average Driving Range by Vehicle Category
SELECT Category,
       ROUND(AVG(Driving_Range_km), 1) AS Avg_Range_km,
       COUNT(*) AS Model_Count
FROM ev_vehicles
GROUP BY Category
ORDER BY Avg_Range_km DESC;

-- 3. Battery Technology Market Distribution
SELECT Battery_Tech,
       COUNT(*) AS Vehicle_Count,
       SUM(Annual_Sales) AS Total_Sales,
       ROUND(AVG(Driving_Range_km), 1) AS Avg_Range_km,
       ROUND(AVG(Battery_Capacity_kWh), 1) AS Avg_Capacity_kWh
FROM ev_vehicles
GROUP BY Battery_Tech
ORDER BY Total_Sales DESC;

-- 4. Manufacturing Country Distribution
SELECT Manufacturing_Country,
       COUNT(*) AS Model_Count,
       SUM(Annual_Sales) AS Total_Sales,
       ROUND(AVG(Customer_Rating), 2) AS Avg_Rating
FROM ev_vehicles
GROUP BY Manufacturing_Country
ORDER BY Total_Sales DESC;

-- 5. Top 10 Best-Selling Models
SELECT Brand, Model, Category, Annual_Sales,
       Market_Share_Percent, Customer_Rating, Driving_Range_km
FROM ev_vehicles
ORDER BY Annual_Sales DESC
LIMIT 10;

-- 6. Customer Satisfaction vs Price Analysis
SELECT Brand, Model, Price_USD, Customer_Rating,
       Annual_Sales, Driving_Range_km, Battery_Tech
FROM ev_vehicles
ORDER BY Customer_Rating DESC, Annual_Sales DESC;

-- 7. CO2 Impact Analysis by Category
SELECT Category,
       SUM(Annual_Sales * CO2_Saved_kg_per_year) AS Total_CO2_Saved_kg,
       ROUND(AVG(CO2_Saved_kg_per_year), 0) AS Avg_CO2_Saved_per_vehicle
FROM ev_vehicles
GROUP BY Category
ORDER BY Total_CO2_Saved_kg DESC;

-- 8. Price Segment Analysis
SELECT
    CASE
        WHEN Price_USD < 35000 THEN 'Budget (<$35K)'
        WHEN Price_USD BETWEEN 35000 AND 55000 THEN 'Mid-Range ($35K-$55K)'
        WHEN Price_USD BETWEEN 55001 AND 90000 THEN 'Premium ($55K-$90K)'
        ELSE 'Luxury (>$90K)'
    END AS Price_Segment,
    COUNT(*) AS Model_Count,
    SUM(Annual_Sales) AS Total_Sales,
    ROUND(AVG(Customer_Rating), 2) AS Avg_Rating,
    ROUND(AVG(Driving_Range_km), 1) AS Avg_Range_km
FROM ev_vehicles
GROUP BY Price_Segment
ORDER BY Total_Sales DESC;

-- 9. High-Growth Market Segments (high sales + high rating)
SELECT Brand, Model, Category, Annual_Sales, Customer_Rating,
       Market_Share_Percent, Battery_Tech, Manufacturing_Country
FROM ev_vehicles
WHERE Customer_Rating >= 4.5 AND Annual_Sales >= 50000
ORDER BY Annual_Sales DESC;

-- 10. Performance Testing View - Volume of Data
SELECT 
    COUNT(*) AS Total_Records,
    COUNT(DISTINCT Brand) AS Total_Brands,
    COUNT(DISTINCT Category) AS Total_Categories,
    COUNT(DISTINCT Battery_Tech) AS Total_Battery_Types,
    COUNT(DISTINCT Manufacturing_Country) AS Total_Countries,
    SUM(Annual_Sales) AS Total_Market_Sales,
    ROUND(AVG(Customer_Rating), 2) AS Overall_Avg_Rating
FROM ev_vehicles;
