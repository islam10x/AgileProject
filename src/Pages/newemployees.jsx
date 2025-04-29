import { useEffect, useState, useRef } from "react";
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
  X,
  Edit,
  Trash,
} from "lucide-react";
import "./newemployees.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getEmployees, 
  promoteToEmployee, 
  getCandidates, 
  updateEmployee, 
  deleteEmployee 
} from "../services/employeesProvider";
import { toast } from "react-toastify";
import Spinner from "../Components/Spinner";

export function NewEmployees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateSearchTerm, setCandidateSearchTerm] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newSalary, setNewSalary] = useState("");
  
  // For employee actions
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [actionMenuPosition, setActionMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    location: "",
    status: "",
    salary: ""
  });
  
  const actionMenuRef = useRef(null);
  const queryClient = useQueryClient();

  // Click outside handler for action menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setShowActionMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch employees
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

  // Fetch candidates
  const { data: candidates, isLoading: isCandidatesLoading } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => await getCandidates(),
    enabled: showCandidateModal, // Only fetch when modal is open
    onSuccess: (data) => {
      console.log("Candidates:", data);
    },
    onError: (err) => {
      toast.error("Failed to fetch candidates");
      console.log(err);
    },
  });

  // Mutation for promoting candidate to employee
  const promoteMutation = useMutation({
    mutationFn: async ({userId, department, salary}) => {
      return await promoteToEmployee(userId, department, salary);
    },
    onSuccess: () => {
      toast.success("Candidate promoted to employee successfully!");
      // Reset form
      setSelectedCandidate(null);
      setNewDepartment("");
      setNewSalary("");
      setShowCandidateModal(false);
      // Refetch employees data
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
    onError: (err) => {
      toast.error("Failed to promote candidate");
      console.log(err);
    }
  });
  
  // Mutation for updating employee information
  const updateMutation = useMutation({
    mutationFn: async (employeeData) => {
      return await updateEmployee(employeeData);
    },
    onSuccess: () => {
      toast.success("Employee information updated successfully!");
      setShowEditModal(false);
      // Refetch employees data
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (err) => {
      toast.error("Failed to update employee information");
      console.log(err);
    }
  });
  
  // Mutation for deleting employee
  const deleteMutation = useMutation({
    mutationFn: async (employeeId) => {
      return await deleteEmployee(employeeId);
    },
    onSuccess: () => {
      toast.success("Employee deleted successfully!");
      setShowDeleteConfirm(false);
      // Refetch employees data
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (err) => {
      toast.error("Failed to delete employee");
      console.log(err);
    }
  });

  const handlePromoteCandidate = () => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate");
      return;
    }
    
    if (!newDepartment) {
      toast.error("Please select a department");
      return;
    }
    
    if (!newSalary || isNaN(parseFloat(newSalary))) {
      toast.error("Please enter a valid salary");
      return;
    }
    
    promoteMutation.mutate({
      userId: selectedCandidate.id,
      department: newDepartment,
      salary: parseFloat(newSalary)
    });
  };
  
  const handleActionClick = (e, employee) => {
    e.stopPropagation();
    
    // Get button position
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Set action menu position
    setActionMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX - 100 // Position menu to the left of the button
    });
    
    setSelectedEmployee(employee);
    setShowActionMenu(true);
  };
  
  const handleEditClick = () => {
    setShowActionMenu(false);
    
    // Set edit form data
    setEditFormData({
      id: selectedEmployee.id,
      name: selectedEmployee.name,
      email: selectedEmployee.email,
      phone: selectedEmployee.phone,
      department: selectedEmployee.department,
      location: selectedEmployee.location,
      status: selectedEmployee.status,
      salary: selectedEmployee.salary || ""
    });
    
    setShowEditModal(true);
  };
  
  const handleDeleteClick = () => {
    setShowActionMenu(false);
    setShowDeleteConfirm(true);
  };
  
  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    if (!editFormData.name || !editFormData.email || !editFormData.phone || !editFormData.location || !editFormData.salary) {
      toast.error("Please fill all required fields");
      return;
    }
    
    updateMutation.mutate(editFormData);
  };
  
  const handleDeleteConfirm = () => {
    if (selectedEmployee) {
      deleteMutation.mutate(selectedEmployee.id);
    }
  };
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
  
  const statusOptions = ["Active", "Probation", "Inactive"];

  const filteredEmployees = employees.filter(
    (employee) =>
      (selectedDepartment === "All" ||
        employee.department === selectedDepartment) &&
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCandidates = candidates?.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(candidateSearchTerm.toLowerCase())
  ) || [];

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

          <button 
            className="add-employee-btn"
            onClick={() => setShowCandidateModal(true)}
          >
            + Add Employee
          </button>
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
                  <button 
                    className="action-btn"
                    onClick={(e) => handleActionClick(e, employee)}
                  >
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Candidate Selection Modal */}
      {showCandidateModal && (
        <div className="modal-overlay">
          <div className="candidate-modal">
            <div className="modal-header">
              <h2>Select Candidate to Promote</h2>
              <button 
                className="close-btn"
                onClick={() => setShowCandidateModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="modal-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search candidates..."
                value={candidateSearchTerm}
                onChange={(e) => setCandidateSearchTerm(e.target.value)}
              />
            </div>

            <div className="candidates-list">
              {isCandidatesLoading ? (
                <Spinner />
              ) : filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => (
                  <div 
                    key={candidate.id} 
                    className={`candidate-item ${selectedCandidate?.id === candidate.id ? 'selected' : ''}`}
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    <div className="candidate-info">
                      {candidate.image ? (
                        <img
                          src={candidate.image}
                          alt={candidate.name}
                          className="candidate-avatar"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/fallback-avatar.png";
                          }}
                        />
                      ) : (
                        <User size={40} />
                      )}
                      <div>
                        <div className="candidate-name">{candidate.name}</div>
                        <div className="candidate-email">{candidate.email}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-candidates">No candidates found</div>
              )}
            </div>

            {selectedCandidate && (
              <div className="promotion-form">
                <h3>Promote {selectedCandidate.name}</h3>
                
                <div className="form-group">
                  <label htmlFor="department">Department</label>
                  <select
                    id="department"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select Department</option>
                    {departments.filter(dept => dept !== "All").map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="salary">Salary</label>
                  <input
                    type="number"
                    id="salary"
                    placeholder="Enter salary"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    required
                  />
                </div>

                <button 
                  className="promote-btn"
                  onClick={handlePromoteCandidate}
                  disabled={promoteMutation.isPending}
                >
                  {promoteMutation.isPending ? "Promoting..." : "Promote to Employee"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Action Menu */}
      {showActionMenu && (
        <div 
          className="action-menu"
          style={{ top: actionMenuPosition.top, left: actionMenuPosition.left }}
          ref={actionMenuRef}
        >
          <button onClick={handleEditClick} className="action-menu-item">
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button onClick={handleDeleteClick} className="action-menu-item delete">
            <Trash size={16} />
            <span>Delete</span>
          </button>
        </div>
      )}
      
      {/* Edit Employee Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="candidate-modal">
            <div className="modal-header">
              <h2>Edit Employee</h2>
              <button 
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={editFormData.phone}
                  onChange={handleEditChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  value={editFormData.department}
                  onChange={handleEditChange}
                  required
                >
                  <option value="" disabled>Select Department</option>
                  {departments.filter(dept => dept !== "All").map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={editFormData.location}
                  onChange={handleEditChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditChange}
                  required
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="salary">Salary</label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={editFormData.salary}
                  onChange={handleEditChange}
                />
              </div>
              
              <button 
                type="submit" 
                className="update-btn"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Updating..." : "Update Employee"}
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="modal-header">
              <h2>Delete Employee</h2>
              <button 
                className="close-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="delete-content">
              <p>Are you sure you want to delete <strong>{selectedEmployee?.name}</strong>?</p>
              <p>This action cannot be undone.</p>
              
              <div className="delete-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="delete-confirm-btn"
                  onClick={handleDeleteConfirm}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewEmployees;