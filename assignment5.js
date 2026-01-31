import mysql from "mysql2/promise";
import express from "express";
const app = new express();
const port = 3000;
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "retailshop",
});
connection.connect((err) => {
  if (err) {
    console.log("DB ERROR");

    console.log(err);
  } else {
    console.log("DB CONNECTED");
  }
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

app.post("/addSupplier", (req, res) => {
  const { SupplierName, ContactNumber } = req.body;
  const addSupp = `
  INSERT INTO suppliers(SupplierName,ContactNumber)
  VALUES
  (?,?)
  `;
  connection.execute(addSupp, [SupplierName, ContactNumber], (err, result) => {
    if (err) {
      return res.status(500).json({ ErrMSG: "error", err });
    }
    return res.status(201).json({ MSG: "supplier Add", result });
  });
});

app.post("/addProduct", (req, res) => {
  const { ProductName, Price, StockQuantity, SupplierID } = req.body;

  const addProduct = `
    INSERT INTO products (ProductName, Price, StockQuantity, SupplierID)
    VALUES (?,?,?,?)
  `;

  connection.execute(
    addProduct,
    [ProductName, Price, StockQuantity, SupplierID],
    (err, result) => {
      if (err) {
        return res.status(500).json({ ErrMSG: "error", err });
      }
      res.status(201).json({ MSG: "product added", result });
    }
  );
});


app.post("/addSale", (req, res) => {
  const { ProductID, Quantity, SaleDate } = req.body;

  const addSale = `
    INSERT INTO sales (ProductID, Quantity, SaleDate)
    VALUES (?,?,?)
  `;

  connection.execute(addSale, [ProductID, Quantity, SaleDate], (err, result) => {
    if (err) {
      return res.status(500).json({ ErrMSG: "error", err });
    }
    res.status(201).json({ MSG: "sale added", result });
  });
});


app.patch("/updateBreadPrice", (req, res) => {
  const updateBreadPrice = `
    UPDATE products
    SET Price = 25.00
    WHERE ProductName = 'Bread'
  `;

  connection.execute(updateBreadPrice, (err, result) => {
    if (err) {
      return res.status(500).json({ ErrMSG: "error", err });
    }
    res.json({ MSG: "Bread price updated", result });
  });
});


app.delete("/deleteEggs", (req, res) => {
  const deleteEggs = `
    DELETE FROM products
    WHERE ProductName = 'Eggs'
  `;

  connection.execute(deleteEggs, (err, result) => {
    if (err) {
      return res.status(500).json({ ErrMSG: "error", err });
    }
    res.json({ MSG: "Eggs deleted", result });
  });
});


app.get("/totalSold", (req, res) => {
  const totalSold = `
    SELECT p.ProductName, SUM(s.Quantity) AS TotalSold
    FROM products p
    JOIN sales s ON p.ProductID = s.ProductID
    GROUP BY p.ProductName
  `;

  connection.execute(totalSold, (err, result) => {
    if (err) {
      return res.status(500).json({ ErrMSG: "error", err });
    }
    res.json(result);
  });
});


app.get("/highestStock", (req, res) => {
  const highestStock = `
    SELECT *
    FROM products
    ORDER BY StockQuantity DESC
    LIMIT 1
  `;

  connection.execute(highestStock, (err, result) => {
    if (err) {
      return res.status(500).json({ ErrMSG: "error", err });
    }
    res.json(result);
  });
});


app.get("/suppliersStartWithF", (req, res) => {
  const suppliersStartWithF = `
    SELECT *
    FROM suppliers
    WHERE SupplierName LIKE 'F%'
  `;

  connection.execute(suppliersStartWithF, (err, result) => {
    if (err) {
      return res.status(500).json({ ErrMSG: "error", err });
    }
    res.json(result);
  });
});


app.get("/productsNeverSold", (req, res) => {
  const productsNeverSold = `
    SELECT p.*
    FROM products p
    LEFT JOIN sales s ON p.ProductID = s.ProductID
    WHERE s.ProductID IS NULL
  `;

  connection.execute(productsNeverSold, (err, result) => {
    if (err) {
      return res.status(500).json({ ErrMSG: "error", err });
    }
    res.json(result);
  });
});


app.get("/salesDetails", (req, res) => {
  const salesDetails = `
    SELECT p.ProductName, s.Quantity, s.SaleDate
    FROM sales s
    JOIN products p ON s.ProductID = p.ProductID
  `;

  connection.execute(salesDetails, (err, result) => {
    if (err) {
      return res.status(500).json({ ErrMSG: "error", err });
    }
    res.json(result);
  });
});


app.post("/createStoreManager", (req, res) => {
  const createUserQuery = `
    CREATE USER IF NOT EXISTS 'store_manager'@'localhost'
    IDENTIFIED BY '1234'
  `;

  connection.execute(createUserQuery, (err) => {
    if (err) {
      return res.status(500).json({ ErrMSG: "error creating user", err });
    }

    const grantQuery = `
      GRANT SELECT, INSERT, UPDATE
      ON retail_db.*
      TO 'store_manager'@'localhost'
    `;

    connection.execute(grantQuery, (err2, result) => {
      if (err2) {
        return res.status(500).json({ ErrMSG: "error granting permissions", err2 });
      }

      res.json({ MSG: "store_manager created & permissions granted", result });
    });
  });
});


app.post("/revokeUpdateFromStoreManager", (req, res) => {
  const revokeQuery = `
    REVOKE UPDATE
    ON retail_db.*
    FROM 'store_manager'@'localhost'
  `;

  connection.execute(revokeQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ ErrMSG: "error", err });
    }

    res.json({ MSG: "UPDATE permission revoked", result });
  });
});



app.post("/grantDeleteOnSales", (req, res) => {
  const grantDeleteQuery = `
    GRANT DELETE
    ON retail_db.Sales
    TO 'store_manager'@'localhost'
  `;

  connection.execute(grantDeleteQuery, (err, result) => {
    if (err) {
      return res.status(500).json({ ErrMSG: "error", err });
    }

    res.json({ MSG: "DELETE permission granted on Sales table", result });
  });
});


app.listen(port, () => {
  console.log(`server is running on port::${port}`);
});
