import React from 'react';
import './dashboardcontent.css';

const Payroll = () => {
  return (
    <main className="dashboard-main">
      <h2 className="dashboard-title">Payroll</h2>
      
      <div className="stats-grid">
        <StatCard title="Monthly Payroll" value="$426,500" percentage="+2.1%" increase={true} />
        <StatCard title="Avg. Salary" value="$85,300" percentage="+1.8%" increase={true} />
        <StatCard title="Benefits Cost" value="$52,800" percentage="+0.5%" increase={false} />
        <StatCard title="Bonus Pool" value="$98,000" percentage="+5.2%" increase={true} />
      </div>
      
      <div className="content-grid">
        <div className="card">
          <h3 className="card-title">Payroll Schedule</h3>
          <div className="card-content">
            <PayrollItem 
              month="February 2025" 
              status="Processed"
              date="Feb 25, 2025"
              amount="$425,210"
            />
            <PayrollItem 
              month="March 2025" 
              status="Scheduled"
              date="Mar 25, 2025"
              amount="$427,500 (est.)"
            />
            <PayrollItem 
              month="April 2025" 
              status="Pending"
              date="Apr 25, 2025"
              amount="$430,000 (est.)"
            />
            <PayrollItem 
              month="May 2025" 
              status="Pending"
              date="May 25, 2025"
              amount="$432,000 (est.)"
            />
          </div>
        </div>
        
        <div className="card">
          <h3 className="card-title">Department Payroll Breakdown</h3>
          <div className="card-content">
            <DepartmentPayrollItem 
              department="Engineering" 
              employees="78"
              avgSalary="$92,500"
              totalCost="$7,215,000"
            />
            <DepartmentPayrollItem 
              department="Marketing" 
              employees="32"
              avgSalary="$78,200"
              totalCost="$2,502,400"
            />
            <DepartmentPayrollItem 
              department="HR" 
              employees="12"
              avgSalary="$75,100"
              totalCost="$901,200"
            />
            <DepartmentPayrollItem 
              department="Finance" 
              employees="25"
              avgSalary="$88,400"
              totalCost="$2,210,000"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

// Helper Components for Payroll
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

const PayrollItem = ({ month, status, date, amount }) => {
  return (
    <div className="activity-item">
      <p className="activity-title">{month}</p>
      <p className="activity-description">Status: {status} | Amount: {amount}</p>
      <p className="activity-time">Date: {date}</p>
    </div>
  );
};

const DepartmentPayrollItem = ({ department, employees, avgSalary, totalCost }) => {
  return (
    <div className="announcement-item">
      <div className="announcement-header">
        <p className="announcement-title">{department}</p>
        <span className="announcement-date">{employees} staff</span>
      </div>
      <p className="announcement-description">Avg. Salary: {avgSalary} | Total: {totalCost}</p>
    </div>
  );
};

export default Payroll;