import React, { useState, useEffect } from 'react';
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
  
  // Theme settings
  const [theme, setTheme] = useState(() => {
    // Try to get saved theme from localStorage, default to 'light'
    return localStorage.getItem('preferred-theme') || 'light';
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('preferred-accent') || 'blue';
  });
  const [layoutDensity, setLayoutDensity] = useState(() => {
    return localStorage.getItem('preferred-layout') || 'comfortable';
  });

  // Apply theme when it changes
  useEffect(() => {
    // Get the root element
    const root = document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('theme-light', 'theme-dark', 'theme-system');
    
    // Add the new theme class
    root.classList.add(`theme-${theme}`);
    
    // If system theme is selected, detect user's system preference
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('theme-dark-mode');
      } else {
        root.classList.add('theme-light-mode');
      }
      
      // Listen for changes in system theme
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        if (e.matches) {
          root.classList.remove('theme-light-mode');
          root.classList.add('theme-dark-mode');
        } else {
          root.classList.remove('theme-dark-mode');
          root.classList.add('theme-light-mode');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);
  
  // Apply accent color
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('accent-blue', 'accent-purple', 'accent-green', 'accent-orange');
    root.classList.add(`accent-${accentColor}`);
  }, [accentColor]);
  
  // Apply layout density
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('layout-compact', 'layout-comfortable');
    root.classList.add(`layout-${layoutDensity}`);
  }, [layoutDensity]);

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
  
  // Save settings to localStorage
  const saveAppearanceSettings = () => {
    localStorage.setItem('preferred-theme', theme);
    localStorage.setItem('preferred-accent', accentColor);
    localStorage.setItem('preferred-layout', layoutDensity);
    
    // Optional: show a success message
    alert('Appearance settings saved successfully!');
  };

  return (
    <main className={`settings-dashboard theme-${theme} accent-${accentColor} layout-${layoutDensity}`}>
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
                  <div 
                    className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    <div className="theme-preview light-theme"></div>
                    <span>Light</span>
                  </div>
                  <div 
                    className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    <div className="theme-preview dark-theme"></div>
                    <span>Dark</span>
                  </div>
                  <div 
                    className={`theme-option ${theme === 'system' ? 'active' : ''}`}
                    onClick={() => setTheme('system')}
                  >
                    <div className="theme-preview system-theme"></div>
                    <span>System</span>
                  </div>
                </div>
              </div>
              
              <div className="color-selector">
                <h3>Accent Color</h3>
                <div className="color-options">
                  <div 
                    className={`color-option blue ${accentColor === 'blue' ? 'active' : ''}`}
                    onClick={() => setAccentColor('blue')}
                  ></div>
                  <div 
                    className={`color-option purple ${accentColor === 'purple' ? 'active' : ''}`}
                    onClick={() => setAccentColor('purple')}
                  ></div>
                  <div 
                    className={`color-option green ${accentColor === 'green' ? 'active' : ''}`}
                    onClick={() => setAccentColor('green')}
                  ></div>
                  <div 
                    className={`color-option orange ${accentColor === 'orange' ? 'active' : ''}`}
                    onClick={() => setAccentColor('orange')}
                  ></div>
                </div>
              </div>
              
              <div className="layout-selector">
                <h3>Layout Density</h3>
                <div className="layout-options">
                  <div 
                    className={`layout-option ${layoutDensity === 'compact' ? 'active' : ''}`}
                    onClick={() => setLayoutDensity('compact')}
                  >
                    <div className="layout-preview compact"></div>
                    <span>Compact</span>
                  </div>
                  <div 
                    className={`layout-option ${layoutDensity === 'comfortable' ? 'active' : ''}`}
                    onClick={() => setLayoutDensity('comfortable')}
                  >
                    <div className="layout-preview comfortable"></div>
                    <span>Comfortable</span>
                  </div>
                </div>
              </div>
              
              {/* Preview and save section */}
              <div className="appearance-actions">
                <div className="current-settings">
                  <h3>Current Settings</h3>
                  <ul>
                    <li>Theme: <span className="setting-value">{theme.charAt(0).toUpperCase() + theme.slice(1)}</span></li>
                    <li>Accent Color: <span className="setting-value">{accentColor.charAt(0).toUpperCase() + accentColor.slice(1)}</span></li>
                    <li>Layout: <span className="setting-value">{layoutDensity.charAt(0).toUpperCase() + layoutDensity.slice(1)}</span></li>
                  </ul>
                </div>
                <button className="save-appearance" onClick={saveAppearanceSettings}>Save Changes</button>
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