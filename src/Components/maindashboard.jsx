import React from 'react'
import './dashboardcontent.css';
function Maindashboard() {
  return (
    <main className="dashboard-main">
      <h2 className="dashboard-title">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard title="Total Employees" value="248" percentage="+2.5%" increase={true} />
        <StatCard title="Open Positions" value="12" percentage="-1.8%" increase={false} />
        <StatCard title="Interviews Scheduled" value="24" percentage="+5.3%" increase={true} />
        <StatCard title="Leave Requests" value="8" percentage="+1.2%" increase={true} />
      </div>
      
      {/* Recent Activities and Announcements */}
      <div className="content-grid">
        <div className="card">
          <h3 className="card-title">Recent Activities</h3>
          <div className="card-content">
            <ActivityItem 
              title="New employee onboarded" 
              description="John Smith joined as Senior Developer" 
              time="2 hours ago" 
            />
            <ActivityItem 
              title="Leave request" 
              description="Anna Johnson requested annual leave" 
              time="5 hours ago" 
            />
            <ActivityItem 
              title="Recruitment update" 
              description="5 candidates shortlisted for UI Designer position" 
              time="Yesterday" 
            />
            <ActivityItem 
              title="Payroll processed" 
              description="February payroll has been processed" 
              time="2 days ago" 
            />
          </div>
        </div>
        
        <div className="card">
          <h3 className="card-title">Announcements</h3>
          <div className="card-content">
            <AnnouncementItem 
              title="Company Town Hall" 
              description="Quarterly town hall scheduled for March 15th" 
              date="Mar 15" 
            />
            <AnnouncementItem 
              title="New Benefits Package" 
              description="Updated health benefits package available from April" 
              date="Apr 1" 
            />
            <AnnouncementItem 
              title="Office Closure" 
              description="Office will be closed for spring maintenance" 
              date="Mar 10" 
            />
            <AnnouncementItem 
              title="Performance Reviews" 
              description="Q1 performance reviews start next week" 
              date="Mar 5" 
            />
          </div>
        </div>
      </div>
    </main>
  );
};

// Helper Components
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

const ActivityItem = ({ title, description, time }) => {
  return (
    <div className="activity-item">
      <p className="activity-title">{title}</p>
      <p className="activity-description">{description}</p>
      <p className="activity-time">{time}</p>
    </div>
  );
};

const AnnouncementItem = ({ title, description, date }) => {
  return (
    <div className="announcement-item">
      <div className="announcement-header">
        <p className="announcement-title">{title}</p>
        <span className="announcement-date">{date}</span>
      </div>
      <p className="announcement-description">{description}</p>
    </div>
  );
};

export default Maindashboard