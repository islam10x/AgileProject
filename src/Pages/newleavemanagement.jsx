import {
    Calendar,
    Clock,
    AlertCircle,
    CheckCircle,
    UserCheck,
    CalendarDays,
    Clock8,
  } from "lucide-react";
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
  
  export function NewLeaveManagement() {
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
          <div className="calendar-overview">
            <div className="month-header">
              <h3>April 2025</h3>
            </div>
            <div className="calendar-grid">
              {Array.from({ length: 30 }, (_, i) => {
                const day = i + 1;
                let classNames = "calendar-day";
                
                // Example data for visualization
                if ([5, 6, 12, 13, 19, 20, 26, 27].includes(day)) {
                  classNames += " weekend";
                }
                if ([8, 9, 10].includes(day)) {
                  classNames += " leave-approved";
                }
                if ([22].includes(day)) {
                  classNames += " today";
                }
                if ([15].includes(day)) {
                  classNames += " holiday";
                }
                
                return (
                  <div key={day} className={classNames}>
                    <span className="day-number">{day}</span>
                  </div>
                );
              })}
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
        </div>
      </div>
    );
  }
  
  export default NewLeaveManagement;