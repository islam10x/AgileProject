import React from 'react';
import './dashboardcontent.css';

const LeaveManagement = () => {
  return (
    <main className="dashboard-main">
      <h2 className="dashboard-title">Leave Management</h2>
      
      <div className="stats-grid">
        <StatCard title="Pending Requests" value="8" percentage="+1" increase={false} />
        <StatCard title="Approved Leaves" value="15" percentage="+3" increase={true} />
        <StatCard title="Avg. Leave Days" value="5.2" percentage="+0.3" increase={true} />
        <StatCard title="Sick Leave Usage" value="22%" percentage="-2.1%" increase={true} />
      </div>
      
      <div className="content-grid">
        <div className="card">
          <h3 className="card-title">Pending Leave Requests</h3>
          <div className="card-content">
            <LeaveItem 
              employee="Anna Johnson" 
              type="Annual Leave"
              duration="Feb 28 - Mar 3, 2025"
              requestDate="Feb 22, 2025"
              status="Pending"
            />
            <LeaveItem 
              employee="Michael Smith" 
              type="Sick Leave"
              duration="Mar 1, 2025"
              requestDate="Feb 25, 2025"
              status="Pending"
            />
            <LeaveItem 
              employee="Sarah Williams" 
              type="Personal Leave"
              duration="Mar 5 - Mar 7, 2025"
              requestDate="Feb 25, 2025"
              status="Pending"
            />
            <LeaveItem 
              employee="James Brown" 
              type="Annual Leave"
              duration="Mar 10 - Mar 17, 2025"
              requestDate="Feb 26, 2025"
              status="Pending"
            />
          </div>
        </div>
        
        <div className="card">
          <h3 className="card-title">Department Leave Calendar</h3>
          <div className="card-content">
            <DepartmentLeaveItem 
              department="Engineering" 
              onLeave="3 employees"
              upcomingLeave="2 employees"
              coverage="95%"
            />
            <DepartmentLeaveItem 
              department="Marketing" 
              onLeave="1 employee"
              upcomingLeave="2 employees"
              coverage="90%"
            />
            <DepartmentLeaveItem 
              department="HR" 
              onLeave="0 employees"
              upcomingLeave="1 employee"
              coverage="100%"
            />
            <DepartmentLeaveItem 
              department="Finance" 
              onLeave="1 employee"
              upcomingLeave="1 employee"
              coverage="95%"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

// Helper Components for Leave Management
const StatCard = ({ title, value, percentage, increase }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <h3 className="stat-card-title">{title}</h3>
      </div>
      <div className="stat-value-container">
        <p className="stat-value">{value}</p>
        <p className={`stat-percentage ${increase ? 'percentage-increase' : 'percentage-decrease'}`}>
          {percentage}
        </p>
      </div>
    </div>
  );
};

const LeaveItem = ({ employee, type, duration, requestDate, status }) => {
  return (
    <div className="activity-item">
      <p className="activity-title">{employee}</p>
      <p className="activity-description">{type} | {duration}</p>
      <p className="activity-time">Requested: {requestDate} | Status: {status}</p>
    </div>
  );
};

const DepartmentLeaveItem = ({ department, onLeave, upcomingLeave, coverage }) => {
  return (
    <div className="announcement-item">
      <div className="announcement-header">
        <p className="announcement-title">{department}</p>
        <span className="announcement-date">{coverage} Coverage</span>
      </div>
      <p className="announcement-description">Currently on leave: {onLeave} | Upcoming: {upcomingLeave}</p>
    </div>
  );
};

export default LeaveManagement;