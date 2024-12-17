// import React from "react";
// import axios from "axios";

// const EmployeeList = ({ employees }) => {
//   const handleDelete = async (employeeId) => {
//     try {
//       await axios.delete(`/api/employees/${employeeId}`);
//       alert("Employee deleted successfully");
//       // Refresh or re-fetch employee list after deletion
//     } catch (error) {
//       alert("Error deleting employee");
//     }
//   };

//   return (
//     <div>
//       <h2>Employee List</h2>
//       <ul>
//         {employees.map((employee) => (
//           <li key={employee._id}>
//             {employee.name} - {employee.email}
//             <button onClick={() => handleDelete(employee._id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default EmployeeList;
