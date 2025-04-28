import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  UserCheck,
  CalendarDays,
  Clock8,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  MoreVertical
} from "lucide-react";
import { useState, useEffect } from "react";
import "./newleavemanagement.css";
import { toast } from "react-toastify";
import { 
  getLeaveRequestStatus, 
  requestLeaveApplication, 
  getRequests, 
  getAllRequests,
  getUserLeaveBalance,
  updateLeaveRequestStatus
} from "../services/leaveRequestProvider";
import { fetchCurrentUser } from "../services/authProvider";
import Spinner from "../Components/Spinner";

function LeaveRequestCard({
  requestId,
  employee,
  type,
  status,
  dates,
  submitted,
  icon: Icon,
  canEdit = false,
  onStatusChange
}) {
  const [showActions, setShowActions] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const statusClasses = {
    pending: "status-pending",
    approved: "status-approved",
    rejected: "status-rejected",
    cancelled: "status-rejected" // reuse rejected style for cancelled
  };
  
  const handleAction = async (newStatus) => {
    try {
      setIsUpdating(true);
      await onStatusChange(requestId, newStatus);
      setShowActions(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="leave-request-card">
      <div className="request-icon">
        <Icon />
      </div>
      <div className="request-details">
        <h4 className="employee-name">{employee}</h4>
        <p className="leave-type">{type}</p>
        <p className="leave-dates">{dates}</p>
        <p className="submitted-date">Submitted: {submitted}</p>
      </div>
      <div className={`request-status ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
      
      {canEdit && status === "pending" && (
        <div className="request-actions">
          <button 
            className="action-button"
            onClick={() => setShowActions(!showActions)}
            disabled={isUpdating}
          >
            <MoreVertical size={18} />
          </button>
          
          {showActions && (
            <div className="action-dropdown">
              <button
                className="action-item approve"
                onClick={() => handleAction("approved")}
                disabled={isUpdating}
              >
                <Check size={16} />
                Approve
              </button>
              <button
                className="action-item reject"
                onClick={() => handleAction("rejected")}
                disabled={isUpdating}
              >
                <X size={16} />
                Reject
              </button>
              {employee === "You" && (
                <button
                  className="action-item cancel"
                  onClick={() => handleAction("cancelled")}
                  disabled={isUpdating}
                >
                  <AlertCircle size={16} />
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LeaveBalanceCard({ category, used, total, icon: Icon }) {
  const percentUsed = (used / total) * 100;
  
  return (
    <div className="leave-balance-card">
      <div className="balance-header">
        <div className="balance-icon">
          <Icon />
        </div>
        <span className="balance-value">{used}/{total} days</span>
      </div>
      <p className="balance-category">{category}</p>
      <div className="balance-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${percentUsed}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function LeaveRequestForm({ selectedDate, onClose, onSubmit }) {
  const [leaveType, setLeaveType] = useState("annual");
  const [endDate, setEndDate] = useState(selectedDate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Format date for display and input fields
  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      const user = await fetchCurrentUser();
      
      if (!user || !user.id) {
        toast.error("User information not available");
        return;
      }
      
      await requestLeaveApplication({
        userId: user.id,
        startDate: formatDateForInput(selectedDate),
        endDate: formatDateForInput(new Date(endDate)),
        type: leaveType
      });
      
      onSubmit();
      toast.success("Leave request submitted successfully");
    } catch (error) {
      toast.error("Failed to submit leave request");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="leave-request-form-overlay">
      <div className="leave-request-form">
        <div className="form-header">
          <h3>New Leave Request</h3>
          <button className="close-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Start Date</label>
            <div className="date-display">{formatDateForDisplay(selectedDate)}</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="leaveType">Leave Type</label>
            <select 
              id="leaveType" 
              value={leaveType} 
              onChange={(e) => setLeaveType(e.target.value)}
              className="form-control"
            >
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="personal">Personal Leave</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input 
              type="date" 
              id="endDate"
              className="form-control"
              value={formatDateForInput(new Date(endDate))}
              min={formatDateForInput(selectedDate)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TheCalendar({ currentDate, onPrevMonth, onNextMonth, onDayClick, userRequests }) {
  // Get month data
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long' });
  
  // Calculate days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  // Calculate today
  const today = new Date();
  const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
  const currentDay = today.getDate();
  
  // Format a date as YYYY-MM-DD for comparison with request dates
  const formatDateString = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  // Check if a day has a leave request
  const getDayStatus = (day) => {
    if (!userRequests || userRequests.length === 0) return null;
    
    const dateStr = formatDateString(year, month, day);
    const dateToCheck = new Date(dateStr);
    
    for (const req of userRequests) {
      const start = new Date(req.start);
      const end = new Date(req.end);
      
      // Reset time parts for accurate date comparison
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      dateToCheck.setHours(0, 0, 0, 0);
      
      if (dateToCheck >= start && dateToCheck <= end) {
        return req.status;
      }
    }
    
    return null;
  };
  
  // Example data for holidays (would come from props in a real app)
  // In production, you'd fetch this from your backend or a holidays API
  const holidays = [
    new Date(year, month, 15).getDate(),  // Example holiday
    // Add more holidays as needed
  ];
  
  // Create calendar grid with empty cells for proper alignment
  const calendarDays = [];
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const dayStatus = getDayStatus(day);
    
    let classNames = "calendar-day";
    if (isWeekend) classNames += " weekend";
    if (dayStatus === "approved") classNames += " leave-approved";
    if (dayStatus === "pending") classNames += " leave-pending";
    if (dayStatus === "rejected") classNames += " leave-rejected";
    if (isCurrentMonth && day === currentDay) classNames += " today";
    if (holidays.includes(day)) classNames += " holiday";
    
    // Only allow clicking on future dates that are not weekends or holidays
    const isPastDate = date < today;
    const isSelectable = !isWeekend && !holidays.includes(day) && !isPastDate;
    
    calendarDays.push(
      <div 
        key={day} 
        className={classNames}
        onClick={() => isSelectable && onDayClick(new Date(year, month, day))}
        style={{ cursor: isSelectable ? 'pointer' : 'default' }}
      >
        <span className="day-number">{day}</span>
      </div>
    );
  }
  
  return (
    <div className="calendar-overview">
      <div className="month-header">
        <button className="month-nav-button" onClick={onPrevMonth}>
          <ChevronLeft size={18} />
        </button>
        <h3>{monthName} {year}</h3>
        <button className="month-nav-button" onClick={onNextMonth}>
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="calendar-grid">
        <div className="weekday-header">Sun</div>
        <div className="weekday-header">Mon</div>
        <div className="weekday-header">Tue</div>
        <div className="weekday-header">Wed</div>
        <div className="weekday-header">Thu</div>
        <div className="weekday-header">Fri</div>
        <div className="weekday-header">Sat</div>
        {calendarDays}
      </div>
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color today"></span>
          <span>Today</span>
        </div>
        <div className="legend-item">
          <span className="legend-color leave-approved"></span>
          <span>Approved Leave</span>
        </div>
        <div className="legend-item">
          <span className="legend-color leave-pending"></span>
          <span>Pending Leave</span>
        </div>
        <div className="legend-item">
          <span className="legend-color weekend"></span>
          <span>Weekend</span>
        </div>
        <div className="legend-item">
          <span className="legend-color holiday"></span>
          <span>Holiday</span>
        </div>
      </div>
    </div>
  );
}

export function NewLeaveManagement() {
  // State for tracking current displayed month
  const [currentDate, setCurrentDate] = useState(new Date());
  // State for handling the leave request form
  const [selectedDate, setSelectedDate] = useState(null);
  // State for user's leave requests
  const [userRequests, setUserRequests] = useState([]);
  // State for pending and approved requests
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const user =fetchCurrentUser();
  const [userRole, setUserRole] = useState(user.role);
  // State for team requests (for managers)
  const [teamRequests, setTeamRequests] = useState([]);
  // State for leave balances
  const [leaveBalances, setLeaveBalances] = useState({
    annual: { used: 0, total: 25 },
    sick: { used: 0, total: 10 },
    personal: { used: 0, total: 5 }
  });
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  
  // Handlers for month navigation
  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() - 1);
      return newDate;
    });
  };
  
  const goToNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + 1);
      return newDate;
    });
  };
  
  // Handler for clicking on a calendar day
  const handleDayClick = (date) => {
    setSelectedDate(date);
  };
  
  // Handler for closing the leave request form
  const handleCloseForm = () => {
    setSelectedDate(null);
  };
  
  // Handler for submitting a leave request
  const handleSubmitLeaveRequest = () => {
    // Close the form
    setSelectedDate(null);
    
    // Refresh leave requests data
    fetchUserData();
  };
  
  // Function to handle status change
  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await updateLeaveRequestStatus(requestId, newStatus);
      toast.success(`Leave request ${newStatus} successfully`);
      
      // Refresh data to show updated status
      fetchUserData();
    } catch (error) {
      toast.error(`Failed to update request: ${error.message}`);
      console.error("Error updating request:", error);
    }
  };
  
  // Function to fetch team requests for managers
  const fetchTeamRequests = async () => {
    try {
      const user = await fetchCurrentUser();
      
      if (!user || !user.role) {
        return;
      }
      
      // Only fetch team requests if the user is a manager
      if (user.role === "hr" || user.role === "admin") {
        setUserRole(user.role);
        
        // Get all requests
        const allRequests = await getAllRequests();
        
        // Filter out the current user's requests
        const filteredRequests = allRequests.filter(req => req.userId !== user.id);
        
        // Set team requests
        setTeamRequests(filteredRequests);
      }
    } catch (error) {
      console.error("Error fetching team requests:", error);
    }
  };
  
  // Function to fetch user's leave requests and balances
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const user = await fetchCurrentUser();
      
      if (!user || !user.id) {
        toast.error("User information not available");
        return;
      }
      
      // Fetch leave requests
      const requests = await getRequests(user.id);
      
      // Update user requests state
      setUserRequests(requests);
      
      // Filter requests for display
      setPendingRequests(requests.filter(req => req.status === "pending"));
      setApprovedRequests(requests.filter(req => req.status === "approved"));
      
      // Fetch leave balances
      try {
        const balances = await getUserLeaveBalance(user.id);
        setLeaveBalances(balances);
      } catch (error) {
        console.error("Error fetching leave balances:", error);
        // Keep default values if there's an error
      }
      
      // Fetch team requests if user is a manager
      await fetchTeamRequests();
    } catch (error) {
      toast.error("Failed to fetch user data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add CSS styles for action buttons
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = newStyles;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  
  // Fetch leave requests when component mounts
  useEffect(() => {
    fetchUserData();
  }, []);
  
  // Example function to format date ranges for display
  const formatDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return "Invalid dates";
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "Invalid dates";
    }
    
    const formatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const startFormatted = start.toLocaleDateString('en-US', formatOptions);
    
    if (startDate === endDate) {
      return startFormatted;
    }
    
    const endFormatted = end.toLocaleDateString('en-US', formatOptions);
    return `${startFormatted} - ${endFormatted}`;
  };
  
  if (isLoading) {
    return <Spinner/>;
  }
  
  return (
    <div className="leave-dashboard">
      <h1 className="page-title">Leave Management</h1>
      
      <div className="leave-stats-grid">
        <LeaveBalanceCard
          category="Annual Leave"
          used={leaveBalances.annual.used}
          total={leaveBalances.annual.total}
          icon={Calendar}
        />
        <LeaveBalanceCard
          category="Sick Leave"
          used={leaveBalances.sick.used}
          total={leaveBalances.sick.total}
          icon={Clock8}
        />
        <LeaveBalanceCard
          category="Personal Leave"
          used={leaveBalances.personal.used}
          total={leaveBalances.personal.total}
          icon={UserCheck}
        />
      </div>

      <div className="leave-dashboard-grid">
        {/* Pending Requests */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Pending Requests</h2>
            <AlertCircle />
          </div>
          <div className="leave-requests-list">
            {pendingRequests.length > 0 ? (
              pendingRequests.map((request, index) => (
                <LeaveRequestCard
                  key={request.id || index}
                  requestId={request.id}
                  employee="You"
                  type={request.type || "Annual Leave"}
                  status="pending"
                  dates={formatDateRange(request.start, request.end)}
                  submitted={new Date(request.created_at || Date.now()).toLocaleDateString()}
                  icon={Calendar}
                  canEdit={true} // Allow editing your own requests
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <p className="no-requests-message">No pending requests</p>
            )}
          </div>
        </div>

        {/* Approved Leave */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Approved Leave</h2>
            <CheckCircle />
          </div>
          <div className="leave-requests-list">
            {approvedRequests.length > 0 ? (
              approvedRequests.map((request, index) => (
                <LeaveRequestCard
                  key={request.id || index}
                  requestId={request.id}
                  employee="You"
                  type={request.type || "Annual Leave"}
                  status="approved"
                  dates={formatDateRange(request.start, request.end)}
                  submitted={new Date(request.created_at || Date.now()).toLocaleDateString()}
                  icon={Calendar}
                  canEdit={false} // Approved requests can't be edited
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <p className="no-requests-message">No approved requests</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Team Requests for Managers */}
      {userRole === "hr" && (
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Team Requests</h2>
            <UserCheck />
          </div>
          <div className="leave-requests-list">
            {teamRequests && teamRequests.length > 0 ? (
              teamRequests.map((request, index) => (
                <LeaveRequestCard
                  key={request.id || index}
                  requestId={request.id}
                  employee={`${request.Users?.name || 'Employee'} ${request.Users?.last_name || ''}`}
                  type={request.type || "Annual Leave"}
                  status={request.status}
                  dates={formatDateRange(request.start, request.end)}
                  submitted={new Date(request.created_at || Date.now()).toLocaleDateString()}
                  icon={Calendar}
                  canEdit={request.status === "pending"} // Only pending can be edited
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <p className="no-requests-message">No team requests</p>
            )}
          </div>
        </div>
      )}

      {/* Team Calendar */}
      <div className="dashboard-card calendar-card">
        <div className="card-header">
          <h2>Team Availability</h2>
          <CalendarDays />
        </div>
        <TheCalendar 
          currentDate={currentDate}
          onPrevMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onDayClick={handleDayClick}
          userRequests={userRequests}
        />
      </div>
      
      {/* Leave Request Form Modal */}
      {selectedDate && (
        <LeaveRequestForm 
          selectedDate={selectedDate}
          onClose={handleCloseForm}
          onSubmit={handleSubmitLeaveRequest}
        />
      )}
    </div>
  );
}

const newStyles = `
.request-actions {
  position: relative;
  margin-left: 8px;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  color: #666;
}

.action-button:hover {
  background: #f0f0f0;
  color: #333;
}

.action-dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-radius: 4px;
  width: 120px;
  z-index: 10;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
}

.action-item:hover {
  background: #f5f5f5;
}

.action-item.approve {
  color: #22c55e;
}

.action-item.reject, .action-item.cancel {
  color: #ef4444;
}
`;

export default NewLeaveManagement;