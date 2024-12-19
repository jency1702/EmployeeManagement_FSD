// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");
// const app = express();
// const port = 5000;

// // Middleware to handle JSON requests
// app.use(express.json());
// app.use(cors());

// // MySQL connection setup
// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Jency@17022005",
//   database: "employee_management",
// });

// connection.connect((err) => {
//   if (err) {
//     console.error("Error connecting to the database:", err.stack);
//     return;
//   }
//   console.log("Connected to the database");
// });

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

// app.listen(port, () => {
//   console.log(`Backend server running on http://localhost:${port}`);
// });

require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = 5000;

// Middleware to handle JSON requests
app.use(express.json());
app.use(
  cors({
    origin: "https://employee-management-fsd-dtbf.vercel.app/",
    credentials: true,
  })
);

// MySQL connection setup using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

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

    const modifiedResults = results.map((employee) => ({
      ...employee,
    }));
    res.json(modifiedResults);
  });
});

// Endpoint to add a new employee
app.post("/api/employees", (req, res) => {
  const {
    name,
    employeeId,
    email,
    phoneNumber,
    department,
    dateOfJoining,
    role,
  } = req.body;

  connection.query(
    "INSERT INTO employees (name, employeeId, email, phoneNumber, department, dateOfJoining, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [name, employeeId, email, phoneNumber, department, dateOfJoining, role],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Employee added successfully", id: result.insertId });
    }
  );
});

app.put("/api/employees/:id", (req, res) => {
  const employeeId = req.params.id;
  const { name, email, phoneNumber, department, dateOfJoining, role } =
    req.body;

  if (
    !name ||
    !email ||
    !phoneNumber ||
    !department ||
    !dateOfJoining ||
    !role
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  connection.query(
    "UPDATE employees SET name = ?, email = ?, phoneNumber = ?, department = ?, dateOfJoining = ?, role = ? WHERE employeeId = ?",
    [name, email, phoneNumber, department, dateOfJoining, role, employeeId],
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

app.delete("/api/employees/:id", (req, res) => {
  const employeeId = req.params.id;

  connection.query(
    "DELETE FROM employees WHERE employeeId = ?",
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

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
