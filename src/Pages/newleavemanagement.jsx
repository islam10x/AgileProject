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
} from "lucide-react";
import { useState } from "react";
import "./newleavemanagement.css";

function LeaveRequestCard({ employee, type, status, dates, submitted, icon: Icon }) {
  const statusClasses = {
    pending: "status-pending",
    approved: "status-approved",
    rejected: "status-rejected",
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

function TheCalendar({ currentDate, onPrevMonth, onNextMonth }) {
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
  
  // Example data for visualization (would come from props in a real app)
  const approvedLeaveDays = [8, 9, 10];
  const holidays = [15];
  
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
    
    let classNames = "calendar-day";
    if (isWeekend) classNames += " weekend";
    if (approvedLeaveDays.includes(day)) classNames += " leave-approved";
    if (isCurrentMonth && day === currentDay) classNames += " today";
    if (holidays.includes(day)) classNames += " holiday";
    
    calendarDays.push(
      <div key={day} className={classNames}>
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
  
  return (
    <div className="leave-dashboard">
      <h1 className="page-title">Leave Management</h1>
      
      <div className="leave-stats-grid">
        <LeaveBalanceCard
          category="Annual Leave"
          used={12}
          total={25}
          icon={Calendar}
        />
        <LeaveBalanceCard
          category="Sick Leave"
          used={3}
          total={10}
          icon={Clock8}
        />
        <LeaveBalanceCard
          category="Personal Leave"
          used={2}
          total={5}
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
            <LeaveRequestCard
              employee="John Smith"
              type="Annual Leave"
              status="pending"
              dates="May 15 - May 20, 2025"
              submitted="Apr 10, 2025"
              icon={Calendar}
            />
            <LeaveRequestCard
              employee="Lisa Parker"
              type="Sick Leave"
              status="pending"
              dates="Apr 28, 2025"
              submitted="Apr 20, 2025"
              icon={Clock8}
            />
          </div>
        </div>

        {/* Approved Leave */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Approved Leave</h2>
            <CheckCircle />
          </div>
          <div className="leave-requests-list">
            <LeaveRequestCard
              employee="Sarah Johnson"
              type="Annual Leave"
              status="approved"
              dates="Jun 5 - Jun 15, 2025"
              submitted="Mar 22, 2025"
              icon={Calendar}
            />
            <LeaveRequestCard
              employee="Michael Chen"
              type="Personal Leave"
              status="approved"
              dates="May 2, 2025"
              submitted="Apr 15, 2025"
              icon={UserCheck}
            />
            <LeaveRequestCard
              employee="Emily Davis"
              type="Annual Leave"
              status="approved"
              dates="May 10 - May 12, 2025"
              submitted="Apr 1, 2025"
              icon={Calendar}
            />
          </div>
        </div>
      </div>

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
        />
      </div>
    </div>
  );
}

export default NewLeaveManagement;