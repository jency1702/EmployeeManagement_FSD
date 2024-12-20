// require("dotenv").config();

// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");
// const app = express();
// const port = 5000;

// // Middleware to handle JSON requests
// app.use(express.json());
// app.use(cors());

// // MySQL connection setup using environment variables
// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database:", err.stack);
//     return;
//   }
//   console.log("Connected to the database");
// });

// // Endpoint to get all employees
// app.get("/api/employees", (req, res) => {
//   connection.query("SELECT * FROM employees", (err, results) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }

//     const modifiedResults = results.map((employee) => ({
//       ...employee,
//       _id: employee.employeeId,
//     }));
//     res.json(modifiedResults);
//   });
// });

// // Endpoint to add a new employee
// app.post("/api/employees", (req, res) => {
//   const {
//     name,
//     employeeId,
//     email,
//     phoneNumber,
//     department,
//     dateOfJoining,
//     role,
//   } = req.body;

//   connection.query(
//     "INSERT INTO employees (name, employeeId, email, phoneNumber, department, dateOfJoining, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
//     [name, employeeId, email, phoneNumber, department, dateOfJoining, role],
//     (err, result) => {
//       if (err) {
//         res.status(500).json({ error: err.message });
//         return;
//       }
//       res.json({ message: "Employee added successfully", id: result.insertId });
//     }
//   );
// });

// app.put("/api/employees/:id", (req, res) => {
//   const employeeId = req.params.id;
//   const { name, email, phoneNumber, department, dateOfJoining, role } =
//     req.body;

//   if (
//     !name ||
//     !email ||
//     !phoneNumber ||
//     !department ||
//     !dateOfJoining ||
//     !role
//   ) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   connection.query(
//     "UPDATE employees SET name = ?, email = ?, phoneNumber = ?, department = ?, dateOfJoining = ?, role = ? WHERE employeeId = ?",
//     [name, email, phoneNumber, department, dateOfJoining, role, employeeId],
//     (err, result) => {
//       if (err) {
//         res.status(500).json({ error: err.message });
//         return;
//       }

//       if (result.affectedRows === 0) {
//         res.status(404).json({ message: "Employee not found" });
//       } else {
//         res.json({ message: "Employee updated successfully" });
//       }
//     }
//   );
// });

// app.delete("/api/employees/:id", (req, res) => {
//   const employeeId = req.params.id;

//   connection.query(
//     "DELETE FROM employees WHERE employeeId = ?",
//     [employeeId],
//     (err, result) => {
//       if (err) {
//         res.status(500).json({ error: err.message });
//         return;
//       }
//       if (result.affectedRows === 0) {
//         res.status(404).json({ message: "Employee not found" });
//       } else {
//         res.json({ message: "Employee deleted successfully" });
//       }
//     }
//   );
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Backend server running on http://localhost:${port}`);
// });

require("dotenv").config(); // Loads environment variables from a .env file

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = 5000; // Define the port

// Middleware to handle JSON requests
app.use(express.json());
app.use(cors()); // Enable CORS for cross-origin requests

// MySQL connection setup using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the database");
});

// Endpoint to get all employees
app.get("/api/employees", (req, res) => {
  connection.query("SELECT * FROM employees", (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Add `_id` for MongoDB-like behavior
    const modifiedResults = results.map((employee) => ({
      ...employee,
      _id: employee.employee_id, // Mapping employee_id to _id
    }));

    res.json(modifiedResults);
  });
});

// Endpoint to add a new employee
app.post("/api/employees", (req, res) => {
  const {
    name,
    email,
    phone_number, // These keys should match your table's schema
    department,
    date_of_joining,
    role,
  } = req.body;

  connection.query(
    "INSERT INTO employees (name, email, phone_number, department, date_of_joining, role) VALUES (?, ?, ?, ?, ?, ?)",
    [name, email, phone_number, department, date_of_joining, role],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Employee added successfully", id: result.insertId });
    }
  );
});

// Endpoint to update an employee
app.put("/api/employees/:id", (req, res) => {
  const employeeId = req.params.id;
  const { name, email, phone_number, department, date_of_joining, role } =
    req.body;

  if (
    !name ||
    !email ||
    !phone_number ||
    !department ||
    !date_of_joining ||
    !role
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  connection.query(
    "UPDATE employees SET name = ?, email = ?, phone_number = ?, department = ?, date_of_joining = ?, role = ? WHERE employee_id = ?",
    [name, email, phone_number, department, date_of_joining, role, employeeId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Employee not found" });
      } else {
        res.json({ message: "Employee updated successfully" });
      }
    }
  );
});

// Endpoint to delete an employee
app.delete("/api/employees/:id", (req, res) => {
  const employeeId = req.params.id;

  connection.query(
    "DELETE FROM employees WHERE employee_id = ?",
    [employeeId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (result.affectedRows === 0) {
        res.status(404).json({ message: "Employee not found" });
      } else {
        res.json({ message: "Employee deleted successfully" });
      }
    }
  );
});

// Start the server and listen on port 5000
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
