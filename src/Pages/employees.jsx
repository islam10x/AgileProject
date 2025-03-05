import React from 'react';
import './dashboardcontent.css';

const Employees = () => {
  return (
    <main className="dashboard-main">
      <h2 className="dashboard-title">Employees</h2>
      
      <div className="stats-grid">
        <StatCard title="Total Employees" value="248" percentage="+2.5%" increase={true} />
        <StatCard title="New Hires" value="12" percentage="+15.8%" increase={true} />
        <StatCard title="Departments" value="8" percentage="0%" increase={true} />
        <StatCard title="Avg. Tenure" value="3.2 yrs" percentage="+0.3%" increase={true} />
      </div>
      
      <div className="content-grid">
        <div className="card">
          <h3 className="card-title">Employee Directory</h3>
          <div className="card-content">
            <EmployeeItem 
              name="John Smith" 
              position="Senior Developer"
              department="Engineering"
              joinDate="Jan 15, 2023"
            />
            <EmployeeItem 
              name="Sarah Johnson" 
              position="HR Manager"
              department="Human Resources"
              joinDate="Mar 22, 2021"
            />
            <EmployeeItem 
              name="Michael Brown" 
              position="Marketing Specialist"
              department="Marketing"
              joinDate="Sep 10, 2022"
            />
            <EmployeeItem 
              name="Emily Davis" 
              position="UX Designer"
              department="Design"
              joinDate="Feb 18, 2023"
            />
          </div>
        </div>
        
        <div className="card">
          <h3 className="card-title">Department Summary</h3>
          <div className="card-content">
            <DepartmentItem 
              name="Engineering" 
              headcount="78"
              openPositions="5"
            />
            <DepartmentItem 
              name="Marketing" 
              headcount="32"
              openPositions="2"
            />
            <DepartmentItem 
              name="Human Resources" 
              headcount="12"
              openPositions="0"
            />
            <DepartmentItem 
              name="Finance" 
              headcount="25"
              openPositions="1"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

// Helper Components for Employees
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

const EmployeeItem = ({ name, position, department, joinDate }) => {
  return (
    <div className="activity-item">
      <p className="activity-title">{name}</p>
      <p className="activity-description">{position} - {department}</p>
      <p className="activity-time">Joined: {joinDate}</p>
    </div>
  );
};

const DepartmentItem = ({ name, headcount, openPositions }) => {
  return (
    <div className="announcement-item">
      <div className="announcement-header">
        <p className="announcement-title">{name}</p>
        <span className="announcement-date">{headcount} staff</span>
      </div>
      <p className="announcement-description">Open positions: {openPositions}</p>
    </div>
  );
};

export default Employees;