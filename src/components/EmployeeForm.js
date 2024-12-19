import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeeForm.css";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phoneNumber: "",
    department: "",
    dateOfJoining: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const departments = [
    "HR",
    "Engineering",
    "Marketing",
    "Sales",
    "Finance",
    "IT",
    "Opertions",
    "Design",
    "Supply Chain",
    "Business Development",
    "Research and Development (R&D)",
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(
        "https://employeemanagement-fsd-task.onrender.com"
      );
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  const validate = () => {
    let formErrors = {};
    let valid = true;

    if (!formData.name.trim()) {
      formErrors.name = "Name is required";
      valid = false;
    }
    // if (!formData.employeeId || formData.employeeId.length !== 10) {
    //   formErrors.employeeId =
    //     "Employee ID is required and must be exactly 10 characters";
    //   valid = false;
    // }

    const existingEmployeeIds = employees.map((emp) => emp.employeeId);

    if (
      !formData.employeeId ||
      !/^[a-zA-Z0-9]{0,10}$/.test(formData.employeeId)
    ) {
      formErrors.employeeId =
        "Employee ID is required, must be alphanumeric, and cannot exceed 10 characters";
      valid = false;
    }
    // else if (existingEmployeeIds.includes(formData.employeeId)) {
    //   formErrors.employeeId = "Employee ID must be unique";
    //   valid = false;
    // }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.email)) {
      formErrors.email = "Invalid email format";
      valid = false;
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      formErrors.phoneNumber = "Phone number must be 10 digits";
      valid = false;
    }
    if (!formData.department) {
      formErrors.department = "Department is required";
      valid = false;
    }
    const today = new Date().toISOString().split("T")[0];
    if (!formData.dateOfJoining || formData.dateOfJoining > today) {
      formErrors.dateOfJoining = "Date of joining cannot be in the future";
      valid = false;
    }
    if (!formData.role.trim()) {
      formErrors.role = "Role is required";
      valid = false;
    }

    setErrors(formErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (validate()) {
      try {
        let response;
        if (selectedEmployeeId) {
          // Update employee
          response = await axios.put(
            `https://employeemanagement-fsd-task.onrender.com/${selectedEmployeeId}`,
            formData
          );

          setEmployees((prevEmployees) =>
            prevEmployees.map((emp) =>
              emp.employeeId === selectedEmployeeId
                ? { ...emp, ...formData }
                : emp
            )
          );
          alert("Employee updated successfully!");
        } else {
          response = await axios.post(
            "http://localhost:5000/api/employees",
            formData
          );

          setEmployees((prevEmployees) => [
            ...prevEmployees,
            { ...formData, employeeId: response.data.id },
          ]);
          alert("Employee added successfully!");
        }

        handleReset();
      } catch (error) {
        setMessage(
          "Error: " + (error.response?.data?.message || "Something went wrong")
        );
      }
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployeeId(employee.employeeId);
    const formattedDate = new Date(employee.dateOfJoining)
      .toISOString()
      .split("T")[0];

    setFormData({
      ...employee,
      dateOfJoining: formattedDate,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`http://localhost:5000/api/employees/${id}`);
        alert("Employee deleted successfully");
        setEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee.employeeId !== id)
        );
      } catch (error) {
        setMessage("Error deleting employee");
      }
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      employeeId: "",
      email: "",
      phoneNumber: "",
      department: "",
      dateOfJoining: "",
      role: "",
    });
    setErrors({});
    setMessage("");
    setSelectedEmployeeId(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="employee-container">
      <div className="employee-form">
        <h2>{selectedEmployeeId ? "Update Employee" : "Add Employee"}</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <span className="error">{errors.name}</span>}

          <label>Employee ID</label>
          <input
            type="text"
            value={formData.employeeId}
            onChange={(e) =>
              setFormData({ ...formData, employeeId: e.target.value })
            }
          />
          {errors.employeeId && (
            <span className="error">{errors.employeeId}</span>
          )}

          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <label>Phone Number</label>
          <input
            type="text"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
          />
          {errors.phoneNumber && (
            <span className="error">{errors.phoneNumber}</span>
          )}

          <label>Department</label>
          <select
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
          >
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <span className="error">{errors.department}</span>
          )}

          <label>Date of Joining</label>
          <input
            type="date"
            value={formData.dateOfJoining}
            onChange={(e) =>
              setFormData({ ...formData, dateOfJoining: e.target.value })
            }
          />
          {errors.dateOfJoining && (
            <span className="error">{errors.dateOfJoining}</span>
          )}

          <label>Role</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
          {errors.role && <span className="error">{errors.role}</span>}

          <div className="form-buttons">
            <button type="submit">
              {selectedEmployeeId ? "Update" : "Submit"}
            </button>
            <button type="button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="employee-list">
        <h3>Employee List</h3>
        {employees.length === 0 ? (
          <p>No employees found</p>
        ) : (
          <table className="employee-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Department</th>
                <th>Date of Joining</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.employeeId}>
                  <td>{employee.name}</td>
                  <td>{employee.employeeId}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phoneNumber}</td>
                  <td>{employee.department}</td>
                  <td>{formatDate(employee.dateOfJoining)}</td>
                  <td>{employee.role}</td>
                  <td>
                    <button onClick={() => handleEdit(employee)}>Edit</button>
                    <button onClick={() => handleDelete(employee.employeeId)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeeForm;
