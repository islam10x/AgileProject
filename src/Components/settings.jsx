import React from 'react';
import './dashboardcontent.css';

const Settings = () => {
  return (
    <main className="dashboard-main">
      <h2 className="dashboard-title">Settings</h2>
      
      <div className="content-grid">
        <div className="card">
          <h3 className="card-title">System Settings</h3>
          <div className="card-content">
            <SettingItem 
              title="Company Information" 
              description="Update company details, logo, and contact information"
              lastUpdated="Jan 15, 2025"
            />
            <SettingItem 
              title="User Management" 
              description="Manage user accounts, roles, and permissions"
              lastUpdated="Feb 10, 2025"
            />
            <SettingItem 
              title="Notifications" 
              description="Configure email and system notification preferences"
              lastUpdated="Feb 22, 2025"
            />
            <SettingItem 
              title="Security" 
              description="Password policies, 2FA, and access controls"
              lastUpdated="Feb 5, 2025"
            />
          </div>
        </div>
        
        <div className="card">
          <h3 className="card-title">Module Settings</h3>
          <div className="card-content">
            <ModuleSettingItem 
              module="Recruitment" 
              status="Enabled"
              features="12 active features"
              lastUpdated="Feb 18, 2025"
            />
            <ModuleSettingItem 
              module="Employee Management" 
              status="Enabled"
              features="18 active features"
              lastUpdated="Feb 15, 2025"
            />
            <ModuleSettingItem 
              module="Leave Management" 
              status="Enabled"
              features="8 active features"
              lastUpdated="Feb 20, 2025"
            />
            <ModuleSettingItem 
              module="Payroll" 
              status="Enabled"
              features="15 active features"
              lastUpdated="Feb 12, 2025"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

// Helper Components for Settings
const SettingItem = ({ title, description, lastUpdated }) => {
  return (
    <div className="activity-item">
      <p className="activity-title">{title}</p>
      <p className="activity-description">{description}</p>
      <p className="activity-time">Last updated: {lastUpdated}</p>
    </div>
  );
};

const ModuleSettingItem = ({ module, status, features, lastUpdated }) => {
  return (
    <div className="announcement-item">
      <div className="announcement-header">
        <p className="announcement-title">{module}</p>
        <span className={`announcement-date ${status === 'Enabled' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
          {status}
        </span>
      </div>
      <p className="announcement-description">{features} | Last updated: {lastUpdated}</p>
    </div>
  );
};

export default Settings;