import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Building, 
  Users, 
  Calendar, 
  DollarSign,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Edit,
  Save,
  X
} from 'lucide-react';
import './newsettings.css';

const NewSettings = () => {
  const [activeTab, setActiveTab] = useState('system');
  const [editMode, setEditMode] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleEditMode = (settingId) => {
    if (editMode === settingId) {
      setEditMode(null);
    } else {
      setEditMode(settingId);
    }
  };

  return (
    <main className="settings-dashboard">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Configure your HR dashboard preferences and system settings</p>
      </div>
      
      <div className="settings-tabs">
        <button 
          className={`settings-tab ${activeTab === 'system' ? 'active' : ''}`} 
          onClick={() => handleTabChange('system')}
        >
          <SettingsIcon size={18} />
          System Settings
        </button>
        <button 
          className={`settings-tab ${activeTab === 'modules' ? 'active' : ''}`} 
          onClick={() => handleTabChange('modules')}
        >
          <Users size={18} />
          Module Settings
        </button>
        <button 
          className={`settings-tab ${activeTab === 'appearance' ? 'active' : ''}`} 
          onClick={() => handleTabChange('appearance')}
        >
          <Edit size={18} />
          Appearance
        </button>
      </div>
      
      <div className="settings-content">
        {activeTab === 'system' && (
          <div className="settings-section">
            <h2 className="section-title">System Settings</h2>
            <p className="section-description">Configure your organization's core system settings</p>
            
            <div className="settings-grid">
              <SystemSettingCard 
                id="company"
                icon={<Building />}
                title="Company Information" 
                description="Update company details, logo, and contact information"
                lastUpdated="Jan 15, 2025"
                editMode={editMode === "company"}
                onToggleEdit={() => toggleEditMode("company")}
              />
              <SystemSettingCard 
                id="users"
                icon={<User />}
                title="User Management" 
                description="Manage user accounts, roles, and permissions"
                lastUpdated="Feb 10, 2025"
                editMode={editMode === "users"}
                onToggleEdit={() => toggleEditMode("users")}
              />
              <SystemSettingCard 
                id="notifications"
                icon={<Bell />}
                title="Notifications" 
                description="Configure email and system notification preferences"
                lastUpdated="Feb 22, 2025"
                editMode={editMode === "notifications"}
                onToggleEdit={() => toggleEditMode("notifications")}
              />
              <SystemSettingCard 
                id="security"
                icon={<Shield />}
                title="Security" 
                description="Password policies, 2FA, and access controls"
                lastUpdated="Feb 5, 2025"
                editMode={editMode === "security"}
                onToggleEdit={() => toggleEditMode("security")}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'modules' && (
          <div className="settings-section">
            <h2 className="section-title">Module Settings</h2>
            <p className="section-description">Enable or disable modules and configure their features</p>
            
            <div className="modules-list">
              <ModuleSettingCard 
                icon={<Users />}
                module="Recruitment" 
                status="Enabled"
                features={12}
                lastUpdated="Feb 18, 2025"
              />
              <ModuleSettingCard 
                icon={<User />}
                module="Employee Management" 
                status="Enabled"
                features={18}
                lastUpdated="Feb 15, 2025"
              />
              <ModuleSettingCard 
                icon={<Calendar />}
                module="Leave Management" 
                status="Enabled"
                features={8}
                lastUpdated="Feb 20, 2025"
              />
              <ModuleSettingCard 
                icon={<DollarSign />}
                module="Payroll" 
                status="Enabled"
                features={15}
                lastUpdated="Feb 12, 2025"
              />
            </div>
          </div>
        )}
        
        {activeTab === 'appearance' && (
          <div className="settings-section">
            <h2 className="section-title">Appearance Settings</h2>
            <p className="section-description">Customize the look and feel of your dashboard</p>
            
            <div className="appearance-settings">
              <div className="theme-selector">
                <h3>Theme</h3>
                <div className="theme-options">
                  <div className="theme-option active">
                    <div className="theme-preview light-theme"></div>
                    <span>Light</span>
                  </div>
                  <div className="theme-option">
                    <div className="theme-preview dark-theme"></div>
                    <span>Dark</span>
                  </div>
                  <div className="theme-option">
                    <div className="theme-preview system-theme"></div>
                    <span>System</span>
                  </div>
                </div>
              </div>
              
              <div className="color-selector">
                <h3>Accent Color</h3>
                <div className="color-options">
                  <div className="color-option blue active"></div>
                  <div className="color-option purple"></div>
                  <div className="color-option green"></div>
                  <div className="color-option orange"></div>
                </div>
              </div>
              
              <div className="layout-selector">
                <h3>Layout Density</h3>
                <div className="layout-options">
                  <div className="layout-option">
                    <div className="layout-preview compact"></div>
                    <span>Compact</span>
                  </div>
                  <div className="layout-option active">
                    <div className="layout-preview comfortable"></div>
                    <span>Comfortable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

// Helper Components for Settings
const SystemSettingCard = ({ id, icon, title, description, lastUpdated, editMode, onToggleEdit }) => {
  return (
    <div className={`system-setting-card ${editMode ? 'edit-mode' : ''}`}>
      <div className="setting-card-header">
        <div className="setting-icon">{icon}</div>
        <div className="setting-actions">
          {editMode ? (
            <>
              <button className="action-button save" onClick={onToggleEdit}>
                <Save size={16} />
              </button>
              <button className="action-button cancel" onClick={onToggleEdit}>
                <X size={16} />
              </button>
            </>
          ) : (
            <button className="action-button edit" onClick={onToggleEdit}>
              <Edit size={16} />
            </button>
          )}
        </div>
      </div>
      
      {editMode ? (
        <div className="setting-edit-form">
          <div className="form-group">
            <label htmlFor={`${id}-title`}>Title</label>
            <input type="text" id={`${id}-title`} defaultValue={title} />
          </div>
          <div className="form-group">
            <label htmlFor={`${id}-description`}>Description</label>
            <textarea id={`${id}-description`} defaultValue={description}></textarea>
          </div>
        </div>
      ) : (
        <>
          <h3 className="setting-title">{title}</h3>
          <p className="setting-description">{description}</p>
          <div className="setting-meta">
            <span className="setting-updated">Last updated: {lastUpdated}</span>
            <ChevronRight size={16} className="setting-arrow" />
          </div>
        </>
      )}
    </div>
  );
};

const ModuleSettingCard = ({ icon, module, status, features, lastUpdated }) => {
  const [enabled, setEnabled] = useState(status === 'Enabled');
  
  const toggleStatus = () => {
    setEnabled(!enabled);
  };
  
  return (
    <div className="module-setting-card">
      <div className="module-header">
        <div className="module-icon">
          {icon}
        </div>
        <h3 className="module-title">{module}</h3>
        <button className="toggle-button" onClick={toggleStatus}>
          {enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
        </button>
      </div>
      
      <div className="module-details">
        <div className="module-status">
          <span className={`status-badge ${enabled ? 'enabled' : 'disabled'}`}>
            {enabled ? 'Enabled' : 'Disabled'}
          </span>
          <span className="feature-count">{features} active features</span>
        </div>
        <p className="module-updated">Last updated: {lastUpdated}</p>
      </div>
      
      <div className="module-actions">
        <button className="module-configure">Configure</button>
        <button className="module-manage">Manage Features</button>
      </div>
    </div>
  );
};

export default NewSettings;