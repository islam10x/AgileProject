import React from 'react';
import './dashboardcontent.css';

const Recruitment = () => {
  return (
    <main className="dashboard-main">
      <h2 className="dashboard-title">Recruitment</h2>
      
      <div className="stats-grid">
        <StatCard title="Open Positions" value="12" percentage="+3" increase={true} />
        <StatCard title="Applications" value="87" percentage="+23.5%" increase={true} />
        <StatCard title="Interviews" value="24" percentage="+14.2%" increase={true} />
        <StatCard title="Time to Hire" value="32 days" percentage="-2.1%" increase={true} />
      </div>
      
      <div className="content-grid">
        <div className="card">
          <h3 className="card-title">Active Job Postings</h3>
          <div className="card-content">
            <JobItem 
              title="Senior Frontend Developer" 
              department="Engineering"
              applicants="28"
              posted="Feb 10, 2025"
            />
            <JobItem 
              title="Marketing Coordinator" 
              department="Marketing"
              applicants="15"
              posted="Feb 15, 2025"
            />
            <JobItem 
              title="UX Designer" 
              department="Design"
              applicants="22"
              posted="Feb 20, 2025"
            />
            <JobItem 
              title="Financial Analyst" 
              department="Finance"
              applicants="12"
              posted="Feb 22, 2025"
            />
          </div>
        </div>
        
        <div className="card">
          <h3 className="card-title">Upcoming Interviews</h3>
          <div className="card-content">
            <InterviewItem 
              candidate="Jessica Lee" 
              position="Senior Frontend Developer"
              date="Feb 28, 2025"
              interviewer="Mark Wilson"
            />
            <InterviewItem 
              candidate="David Chang" 
              position="UX Designer"
              date="Mar 1, 2025"
              interviewer="Emma Roberts"
            />
            <InterviewItem 
              candidate="Alex Johnson" 
              position="Marketing Coordinator"
              date="Mar 2, 2025"
              interviewer="Sarah Thompson"
            />
            <InterviewItem 
              candidate="Michelle Garcia" 
              position="Financial Analyst"
              date="Mar 3, 2025"
              interviewer="Robert Chen"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

// Helper Components for Recruitment
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

const JobItem = ({ title, department, applicants, posted }) => {
  return (
    <div className="activity-item">
      <p className="activity-title">{title}</p>
      <p className="activity-description">Department: {department} | Applicants: {applicants}</p>
      <p className="activity-time">Posted: {posted}</p>
    </div>
  );
};

const InterviewItem = ({ candidate, position, date, interviewer }) => {
  return (
    <div className="announcement-item">
      <div className="announcement-header">
        <p className="announcement-title">{candidate}</p>
        <span className="announcement-date">{date}</span>
      </div>
      <p className="announcement-description">{position} | Interviewer: {interviewer}</p>
    </div>
  );
};

export default Recruitment;