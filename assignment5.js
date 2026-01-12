//#part3
//1//

// CREATE TABLE Products(
//     ProductId INT AUTO_INCREMENT PRIMARY KEY,
//     productName TEXT(100),
//     Price DECIMAL(10,2),
//     StockQuantity INT,
//     SuppllierId INT ,
//     FOREIGN KEY(SuppllierId) REFERENCES Suppliers(SuppllierId)
//     )


// CREATE TABLE Suppliers(
//     SupplierId int PRIMARY KEY AUTO_INCREMENT,
//     SupplierName TEXT(100),
//     ContactNumber TEXT(100)
// )


// CREATE TABLE Sales(
// SaleId int AUTO_INCREMENT PRIMARY KEY,
//     ProductId INT ,
//     QuantitySold INT,
//     SaleDate DATE,
//     FOREIGN KEY(ProductId) REFERENCES products(ProductId)
// )

//2//
//ALTER TABLE products ADD Category VARCHAR(100)

//3//
// ALTER TABLE products DROP Category

//4//
//ALTER TABLE suppliers MODIFY ContactNumber VARCHAR(100)


//5//
//ALTER TABLE products MODIFY ProductName VARCHAR(100) NOT NULL

//6//
//A // 
// //INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES ('FreshFood', '01001234567');

//b
//INSERT INTO products(productName,price,stockQuantity,supplierId)
//VALUES
//("Milk",15.00,50,1),("Bread",10.00,30,1),("Eggs",20.00,40,1)

//c
//INSERT INTO sales (productId,QuantitySold,saleDate) 
//VALUES
//(1,2,'2025-05-20')

//7//
// UPDATE products SET Price=25 WHERE ProductName="Bread"

//8//
//DELETE FROM products WHERE ProductName="Eggs"

//9//
// SELECT p.productName, SUM(s.QuantitySold) AS totalQuantitySold
// FROM sales AS s
// JOIN products AS p
// on s.productId=p.productId
// GROUP BY p.productName

//10//
// SELECT *
// FROM products
// WHERE stockQuantity= (SELECT MAX(stockQuantity) FROM products)

//11//
//SELECT * FROM suppliers WHERE SupplierName LIKE "f%"

//12
// SELECT *
// FROM products AS p
// LEFT JOIN sales AS s
// ON p.productId = s.productId
// WHERE s.productId IS NULL

//13
// SELECT P.productName , s.saleDate
// FROM products AS p
// JOIN sales AS s
// ON p.productId = s.productId;

//14
/*

CREATE USER 'store_manager'@'localhost' IDENTIFIED BY 'password123';
GRANT SELECT, INSERT, UPDATE
ON *.*
TO 'store_manager'@'localhost';
FLUSH PRIVILEGES;



*/

//15
/*
REVOKE UPDATE ON store_db.* FROM 'store_manager'@'localhost';
FLUSH PRIVILEGES;

 */

//16
/*


GRANT DELETE ON store_db.Sales TO 'store_manager'@'localhost';
FLUSH PRIVILEGES;

*/



//BONUS // 
// # Write your MySQL query statement below
// SELECT 
//     v.customer_id,
//     COUNT(*) AS count_no_trans
// FROM Visits v
// LEFT JOIN Transactions t
//     ON v.visit_id = t.visit_id
// WHERE t.transaction_id IS NULL
// GROUP BY v.customer_id;

//#endpart3