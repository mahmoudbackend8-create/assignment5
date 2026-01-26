import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "retailshop",
});

const createTables = async (req, res) => {
  await connection.execute(`
    CREATE TABLE Suppliers(
    SupplierId int PRIMARY KEY AUTO_INCREMENT,
    SupplierName TEXT(100),
    ContactNumber TEXT(100)
)
  `);

  await connection.execute(`
    CREATE TABLE Products(
    ProductId INT AUTO_INCREMENT PRIMARY KEY,
    productName TEXT(100),
    Price DECIMAL(10,2),
    StockQuantity INT,
    SuppllierId INT ,
    FOREIGN KEY(SuppllierId) REFERENCES Suppliers(SuppllierId)
    )
  `);

  await connection.execute(`
    CREATE TABLE Sales(
    SaleId int AUTO_INCREMENT PRIMARY KEY,
    ProductId INT ,
    QuantitySold INT,
    SaleDate DATE,
    FOREIGN KEY(ProductId) REFERENCES products(ProductId)
)

  `);

  res.json({ msg: "Tables created" });
};

const addSupplier = async (req, res) => {
  const { name, contact } = req.body;
  await connection.execute(
    "INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?,?)",
    [name, contact],
  );
  res.json({ msg: "Supplier added" });
};

const addProducts = async (req, res) => {
  const products = req.body;
  for (const p of products) {
    await connection.execute(
      `INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID)
       VALUES (?,?,?,?)`,
      [p.name, p.price, p.stock, p.supplierId],
    );
  }
  res.json({ msg: "Products added" });
};

const addSale = async (req, res) => {
  const { productId, quantity, date } = req.body;
  await connection.execute(
    "INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?,?,?)",
    [productId, quantity, date],
  );
  res.json({ msg: "Sale added" });
};

const updateBreadPrice = async (req, res) => {
  await connection.execute(
    "UPDATE Products SET Price = 25 WHERE ProductName = 'Bread'",
  );
  res.json({ msg: "Price updated" });
};

const deleteEggs = async (req, res) => {
  await connection.execute("DELETE FROM Products WHERE ProductName = 'Eggs'");
  res.json({ msg: "Eggs deleted" });
};

const totalSold = async (req, res) => {
  const [rows] = await connection.execute(`
    SELECT p.ProductName, SUM(s.QuantitySold) AS TotalSold
    FROM Products p
    LEFT JOIN Sales s ON p.ProductID = s.ProductID
    GROUP BY p.ProductID
  `);
  res.json(rows);
};

const highestStock = async (req, res) => {
  const [rows] = await connection.execute(`
    SELECT ProductName, StockQuantity
    FROM Products
    ORDER BY StockQuantity DESC
    LIMIT 1
  `);
  res.json(rows[0]);
};

const suppliersStart = async (req, res) => {
  const [rows] = await connection.execute(`
    SELECT * FROM Suppliers
    WHERE SupplierName LIKE 'F%'
  `);
  res.json(rows);
};

const productsNotSold = async (req, res) => {
  const [rows] = await connection.execute(`
    SELECT p.ProductName
    FROM Products p
    LEFT JOIN Sales s ON p.ProductID = s.ProductID
    WHERE s.SaleID IS NULL
  `);
  res.json(rows);
};

const allSalesProduct = async (req, res) => {
  const [rows] = await connection.execute(`
    SELECT p.ProductName, s.QuantitySold, s.SaleDate
    FROM Sales s
    JOIN Products p ON s.ProductID = p.ProductID
  `);
  res.json(rows);
};

const createStoreManager = async (req, res) => {
  await connection.execute(`
    CREATE USER 'store_manager'@'MAHMOUD'
    IDENTIFIED BY '1234'
  `);

  res.json({ msg: "created" });
};

const grantDeleteOnSales = async (req, res) => {
  await connection.execute(`
    GRANT DELETE
    ON retail_db.Sales
   
  `);

  res.json({ msg: "DELETED" });
};
