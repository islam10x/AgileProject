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
  }); // <--- Add this closing bracket!
  if (isLoading) return <Spinner />;
  if (!employees) return <h1>No employees</h1>;
  // const employees = [
  //   {
  //     id: 1,
  //     name: "Sarah Johnson",
  //     role: "Senior Developer",
  //     department: "Engineering",
  //     email: "sarah.j@company.com",
  //     phone: "555-123-4567",
  //     hireDate: "Jan 10, 2023",
  //     location: "New York, NY",
  //     image: "/api/placeholder/40/40",
  //     status: "Active",
  //   },
  //   {
  //     id: 2,
  //     name: "Michael Chen",
  //     role: "Product Manager",
  //     department: "Product",
  //     email: "michael.c@company.com",
  //     phone: "555-234-5678",
  //     hireDate: "Mar 15, 2022",
  //     location: "San Francisco, CA",
  //     image: "/api/placeholder/40/40",
  //     status: "Active",
  //   },
  //   {
  //     id: 3,
  //     name: "Emily Davis",
  //     role: "Marketing Lead",
  //     department: "Marketing",
  //     email: "emily.d@company.com",
  //     phone: "555-345-6789",
  //     hireDate: "Nov 2, 2022",
  //     location: "Chicago, IL",
  //     image: "/api/placeholder/40/40",
  //     status: "Active",
  //   },
  //   {
  //     id: 4,
  //     name: "James Smith",
  //     role: "Sales Representative",
  //     department: "Sales",
  //     email: "james.s@company.com",
  //     phone: "555-456-7890",
  //     hireDate: "Feb 20, 2023",
  //     location: "Austin, TX",
  //     image: "/api/placeholder/40/40",
  //     status: "Probation",
  //   },
  //   {
  //     id: 5,
  //     name: "Lisa Zhang",
  //     role: "UX Designer",
  //     department: "Design",
  //     email: "lisa.z@company.com",
  //     phone: "555-567-8901",
  //     hireDate: "Apr 5, 2022",
  //     location: "Seattle, WA",
  //     image: "/api/placeholder/40/40",
  //     status: "Active",
  //   },
  //   {
  //     id: 6,
  //     name: "Robert Taylor",
  //     role: "HR Specialist",
  //     department: "Human Resources",
  //     email: "robert.t@company.com",
  //     phone: "555-678-9012",
  //     hireDate: "Sep 12, 2021",
  //     location: "Boston, MA",
  //     image: "/api/placeholder/40/40",
  //     status: "Active",
  //   },
  //   {
  //     id: 7,
  //     name: "David Wilson",
  //     role: "Backend Developer",
  //     department: "Engineering",
  //     email: "david.w@company.com",
  //     phone: "555-789-0123",
  //     hireDate: "Jul 7, 2022",
  //     location: "Portland, OR",
  //     image: "/api/placeholder/40/40",
  //     status: "Active",
  //   },
  // ];

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

      <div className="employees-footer">
        <div className="pagination">
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <span>...</span>
          <button className="pagination-btn">8</button>
        </div>
        <div className="showing-info">
          Showing {filteredEmployees.length} of {employees.length} employees
        </div>
      </div>
    </div>
  );
}

export default NewEmployees;
