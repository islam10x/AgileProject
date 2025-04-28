import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
} from "lucide-react";
import "./newemployees.css";
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "../services/employeesProvider";
import { toast } from "react-toastify";
import Spinner from "../Components/Spinner";

export function NewEmployees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => await getEmployees(),
    onSuccess: (data) => {
      console.log(data);
      toast.success("Employees fetched successfully");
    },
    onError: (err) => {
      toast.error("Failed to fetch employees");
      console.log(err);
    },
  });

  if (isLoading) return <Spinner />;
  if (!employees) return <h1>No employees</h1>;

  const departments = [
    "All",
    "Engineering",
    "Product",
    "Marketing",
    "Sales",
    "Design",
    "Human Resources",
  ];

  const filteredEmployees = employees.filter(
    (employee) =>
      (selectedDepartment === "All" ||
        employee.department === selectedDepartment) &&
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="employees-container">
      <div className="employees-header">
        <div className="employees-title">
          <Users size={24} />
          <h1>Employees Directory</h1>
        </div>

        <div className="employees-actions">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-box">
            <Filter size={16} />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <button className="add-employee-btn">+ Add Employee</button>
        </div>
      </div>

      <div className="employees-table-container">
        <table className="employees-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Contact</th>
              <th>Hire Date</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td className="employee-info">
                  {employee.image ? (
                    <img
                      src={employee.image}
                      alt={employee.name}
                      className="employee-avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/fallback-avatar.png"; // fallback image
                      }}
                    />
                  ) : (
                    <User size={40} />
                  )}

                  <div>
                    <div className="employee-name">{employee.name}</div>
                    <div className="employee-role">{employee.role}</div>
                  </div>
                </td>
                <td>{employee.department}</td>
                <td>
                  <div className="employee-contact">
                    <div className="contact-item">
                      <Mail size={14} />
                      <span>{employee.email}</span>
                    </div>
                    <div className="contact-item">
                      <Phone size={14} />
                      <span>{employee.phone}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="hire-date">
                    <Calendar size={14} />
                    <span>{employee.hireDate}</span>
                  </div>
                </td>
                <td>
                  <div className="location">
                    <MapPin size={14} />
                    <span>{employee.location}</span>
                  </div>
                </td>
                <td>
                  <span
                    className={`status-badge ${
                      employee.status === "Active"
                        ? "active"
                        : employee.status === "Probation"
                        ? "probation"
                        : "inactive"
                    }`}
                  >
                    {employee.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default NewEmployees;
