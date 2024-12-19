// // server.js

// // Import dependencies
// const express = require("express");
// const { createClient } = require("@supabase/supabase-js");
// const cors = require("cors");
// require("dotenv").config();

// // Initialize the express app
// const app = express();

// // Middleware setup
// app.use(cors({ origin: "http://localhost:3000" })); // Adjust the frontend URL if necessary
// app.use(express.json()); // To parse JSON request bodies

// // Initialize Supabase client with environment variables
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_KEY;
// const supabase = createClient(supabaseUrl, supabaseKey);

// // Endpoint to get all employees
// app.get("/api/employees", async (req, res) => {
//   try {
//     const { data, error } = await supabase.from("employees").select("*");

//     if (error) {
//       console.error("Error fetching employees:", error);
//       return res.status(500).json({ error: error.message });
//     }

//     res.json(data); // Respond with the data from the database
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Endpoint to add a new employee
// app.post("/api/employees", async (req, res) => {
//   const {
//     name,
//     employeeId,
//     email,
//     phoneNumber,
//     department,
//     dateOfJoining,
//     role,
//   } = req.body;

//   if (
//     !name ||
//     !employeeId ||
//     !email ||
//     !phoneNumber ||
//     !department ||
//     !dateOfJoining ||
//     !role
//   ) {
//     return res.status(400).json({ error: "All fields are required" });
//   }

//   try {
//     const { data, error } = await supabase
//       .from("employees")
//       .insert([
//         {
//           name,
//           employeeId,
//           email,
//           phoneNumber,
//           department,
//           dateOfJoining,
//           role,
//         },
//       ]);

//     if (error) {
//       console.error("Error adding employee:", error);
//       return res.status(500).json({ error: error.message });
//     }

//     res
//       .status(201)
//       .json({ message: "Employee added successfully", data: data[0] });
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Endpoint to update an existing employee's data
// app.put("/api/employees/:id", async (req, res) => {
//   const { id } = req.params;
//   const { name, email, phoneNumber, department, dateOfJoining, role } =
//     req.body;

//   try {
//     const { data, error } = await supabase
//       .from("employees")
//       .update({ name, email, phoneNumber, department, dateOfJoining, role })
//       .eq("id", id);

//     if (error) {
//       console.error("Error updating employee:", error);
//       return res.status(500).json({ error: error.message });
//     }

//     if (data.length === 0) {
//       return res.status(404).json({ error: "Employee not found" });
//     }

//     res.json({ message: "Employee updated successfully", data: data[0] });
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Endpoint to delete an employee
// app.delete("/api/employees/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const { data, error } = await supabase
//       .from("employees")
//       .delete()
//       .eq("id", id);

//     if (error) {
//       console.error("Error deleting employee:", error);
//       return res.status(500).json({ error: error.message });
//     }

//     if (data.length === 0) {
//       return res.status(404).json({ error: "Employee not found" });
//     }

//     res.json({ message: "Employee deleted successfully" });
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = 5000;

// Middleware to handle JSON requests
app.use(express.json());
app.use(cors());

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
      _id: employee.employeeId,
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
