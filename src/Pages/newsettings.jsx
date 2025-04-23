import React, { useState, useEffect, createContext, useContext, useReducer } from 'react';
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
  X,
  Loader
} from 'lucide-react';
import './newsettings.css';

// Create context for settings state management
const SettingsContext = createContext();

// Reducer for state management
const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_LOADING':
      return { ...state, loading: true, error: null };
    case 'INIT_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_SYSTEM_SETTINGS':
      return { 
        ...state, 
        loading: false, 
        error: null, 
        systemSettings: action.payload 
      };
    case 'SET_MODULE_SETTINGS':
      return { 
        ...state, 
        loading: false, 
        error: null, 
        moduleSettings: action.payload 
      };
    case 'SET_APPEARANCE_SETTINGS':
      return { 
        ...state, 
        loading: false, 
        error: null, 
        appearanceSettings: action.payload 
      };
    case 'UPDATE_SYSTEM_SETTING':
      return {
        ...state,
        systemSettings: state.systemSettings.map(setting => 
          setting.id === action.payload.id ? { ...setting, ...action.payload.data } : setting
        )
      };
    case 'UPDATE_MODULE_SETTING':
      return {
        ...state,
        moduleSettings: state.moduleSettings.map(module => 
          module.id === action.payload.id ? { ...module, ...action.payload.data } : module
        )
      };
    case 'UPDATE_APPEARANCE_SETTING':
      return {
        ...state,
        appearanceSettings: {
          ...state.appearanceSettings,
          [action.payload.key]: action.payload.value
        }
      };
    case 'SET_SAVING':
      return { ...state, saving: action.payload };
    case 'SET_SAVE_ERROR':
      return { ...state, saveError: action.payload };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  loading: false,
  saving: false,
  error: null,
  saveError: null,
  systemSettings: [],
  moduleSettings: [],
  appearanceSettings: {
    theme: 'light',
    accentColor: 'blue',
    layoutDensity: 'comfortable'
  }
};

// API service functions
const api = {
  fetchSystemSettings: async () => {
    // Simulating API call with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "company",
            icon: "Building",
            title: "Company Information",
            description: "Update company details, logo, and contact information",
            lastUpdated: "Jan 15, 2025"
          },
          {
            id: "users",
            icon: "User",
            title: "User Management",
            description: "Manage user accounts, roles, and permissions",
            lastUpdated: "Feb 10, 2025"
          },
          {
            id: "notifications",
            icon: "Bell",
            title: "Notifications",
            description: "Configure email and system notification preferences",
            lastUpdated: "Feb 22, 2025"
          },
          {
            id: "security",
            icon: "Shield",
            title: "Security",
            description: "Password policies, 2FA, and access controls",
            lastUpdated: "Feb 5, 2025"
          }
        ]);
      }, 800);
    });
  },
  
  fetchModuleSettings: async () => {
    // Simulating API call with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "recruitment",
            icon: "Users",
            module: "Recruitment",
            status: "Enabled",
            features: 12,
            lastUpdated: "Feb 18, 2025"
          },
          {
            id: "employee",
            icon: "User",
            module: "Employee Management",
            status: "Enabled",
            features: 18,
            lastUpdated: "Feb 15, 2025"
          },
          {
            id: "leave",
            icon: "Calendar",
            module: "Leave Management",
            status: "Enabled",
            features: 8,
            lastUpdated: "Feb 20, 2025"
          },
          {
            id: "payroll",
            icon: "DollarSign",
            module: "Payroll",
            status: "Enabled",
            features: 15,
            lastUpdated: "Feb 12, 2025"
          }
        ]);
      }, 800);
    });
  },
  
  fetchAppearanceSettings: async () => {
    // Simulating API call with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          theme: 'light',
          accentColor: 'blue',
          layoutDensity: 'comfortable' 
        });
      }, 800);
    });
  },
  
  updateSystemSetting: async (id, data) => {
    // Simulating API call with timeout
    return new Promise((resolve) => {
      console.log(`Updating system setting ${id} with:`, data);
      setTimeout(() => {
        // Return the updated data with a new timestamp
        resolve({
          ...data,
          lastUpdated: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })
        });
      }, 1000);
    });
  },
  
  updateModuleSetting: async (id, data) => {
    // Simulating API call with timeout
    return new Promise((resolve) => {
      console.log(`Updating module setting ${id} with:`, data);
      setTimeout(() => {
        // Return the updated data with a new timestamp
        resolve({
          ...data,
          lastUpdated: new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })
        });
      }, 1000);
    });
  },
  
  updateAppearanceSettings: async (data) => {
    // Simulating API call with timeout
    return new Promise((resolve) => {
      console.log(`Updating appearance settings with:`, data);
      setTimeout(() => {
        resolve(data);
      }, 1000);
    });
  }
};

// Provider component for settings context
const SettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);
  
  // Function to get icon component based on string name
  const getIconComponent = (iconName) => {
    const icons = {
      Building: <Building />,
      User: <User />,
      Bell: <Bell />,
      Shield: <Shield />,
      Users: <Users />,
      Calendar: <Calendar />,
      DollarSign: <DollarSign />
    };
    return icons[iconName] || <SettingsIcon />;
  };
  
  // Load all settings on initial render
  useEffect(() => {
    const loadAllSettings = async () => {
      dispatch({ type: 'INIT_LOADING' });
      try {
        // Load system settings
        const systemSettings = await api.fetchSystemSettings();
        dispatch({ type: 'SET_SYSTEM_SETTINGS', payload: systemSettings });
        
        // Load module settings
        const moduleSettings = await api.fetchModuleSettings();
        dispatch({ type: 'SET_MODULE_SETTINGS', payload: moduleSettings });
        
        // Load appearance settings
        const appearanceSettings = await api.fetchAppearanceSettings();
        dispatch({ type: 'SET_APPEARANCE_SETTINGS', payload: appearanceSettings });
      } catch (error) {
        dispatch({ type: 'INIT_ERROR', payload: error.message });
      }
    };
    
    loadAllSettings();
  }, []);
  
  // Update system setting
  const updateSystemSetting = async (id, data) => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      const updatedSetting = await api.updateSystemSetting(id, data);
      dispatch({ 
        type: 'UPDATE_SYSTEM_SETTING', 
        payload: { id, data: updatedSetting } 
      });
      dispatch({ type: 'SET_SAVING', payload: false });
      return updatedSetting;
    } catch (error) {
      dispatch({ type: 'SET_SAVE_ERROR', payload: error.message });
      dispatch({ type: 'SET_SAVING', payload: false });
      throw error;
    }
  };
  
  // Update module setting
  const updateModuleSetting = async (id, data) => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      const updatedModule = await api.updateModuleSetting(id, data);
      dispatch({ 
        type: 'UPDATE_MODULE_SETTING', 
        payload: { id, data: updatedModule } 
      });
      dispatch({ type: 'SET_SAVING', payload: false });
      return updatedModule;
    } catch (error) {
      dispatch({ type: 'SET_SAVE_ERROR', payload: error.message });
      dispatch({ type: 'SET_SAVING', payload: false });
      throw error;
    }
  };
  
  // Update appearance settings
  const updateAppearanceSetting = async (key, value) => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      const updatedSettings = await api.updateAppearanceSettings({ 
        ...state.appearanceSettings, 
        [key]: value 
      });
      dispatch({ 
        type: 'UPDATE_APPEARANCE_SETTING', 
        payload: { key, value } 
      });
      dispatch({ type: 'SET_SAVING', payload: false });
      return updatedSettings;
    } catch (error) {
      dispatch({ type: 'SET_SAVE_ERROR', payload: error.message });
      dispatch({ type: 'SET_SAVING', payload: false });
      throw error;
    }
  };
  
  // Context value
  const value = {
    ...state,
    updateSystemSetting,
    updateModuleSetting,
    updateAppearanceSetting,
    getIconComponent
  };
  
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook for using settings context
const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

// Main Settings Component
const NewSettings = () => {
  return (
    <SettingsProvider>
      <SettingsContent />
    </SettingsProvider>
  );
};

// Settings Content Component
const SettingsContent = () => {
  const [activeTab, setActiveTab] = useState('system');
  const { loading, error } = useSettings();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="settings-loading">
        <Loader size={32} className="loading-spinner" />
        <p>Loading settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="settings-error">
        <p className="error-message">Error loading settings: {error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

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
        {activeTab === 'system' && <SystemSettings />}
        {activeTab === 'modules' && <ModuleSettings />}
        {activeTab === 'appearance' && <AppearanceSettings />}
      </div>
    </main>
  );
};

// System Settings Tab Component
const SystemSettings = () => {
  const { systemSettings, getIconComponent } = useSettings();
  const [editMode, setEditMode] = useState(null);

  const toggleEditMode = (settingId) => {
    if (editMode === settingId) {
      setEditMode(null);
    } else {
      setEditMode(settingId);
    }
  };

  return (
    <div className="settings-section">
      <h2 className="section-title">System Settings</h2>
      <p className="section-description">Configure your organization's core system settings</p>
      
      <div className="settings-grid">
        {systemSettings.map(setting => (
          <SystemSettingCard 
            key={setting.id}
            id={setting.id}
            icon={getIconComponent(setting.icon)}
            title={setting.title}
            description={setting.description}
            lastUpdated={setting.lastUpdated}
            editMode={editMode === setting.id}
            onToggleEdit={() => toggleEditMode(setting.id)}
          />
        ))}
      </div>
    </div>
  );
};

// Module Settings Tab Component
const ModuleSettings = () => {
  const { moduleSettings, getIconComponent } = useSettings();

  return (
    <div className="settings-section">
      <h2 className="section-title">Module Settings</h2>
      <p className="section-description">Enable or disable modules and configure their features</p>
      
      <div className="modules-list">
        {moduleSettings.map(module => (
          <ModuleSettingCard 
            key={module.id}
            id={module.id}
            icon={getIconComponent(module.icon)}
            module={module.module}
            status={module.status}
            features={module.features}
            lastUpdated={module.lastUpdated}
          />
        ))}
      </div>
    </div>
  );
};

// Appearance Settings Tab Component
const AppearanceSettings = () => {
  const { appearanceSettings, updateAppearanceSetting, saving } = useSettings();
  
  const handleThemeChange = async (theme) => {
    await updateAppearanceSetting('theme', theme);
  };
  
  const handleColorChange = async (color) => {
    await updateAppearanceSetting('accentColor', color);
  };
  
  const handleLayoutChange = async (layout) => {
    await updateAppearanceSetting('layoutDensity', layout);
  };
  
  return (
    <div className="settings-section">
      <h2 className="section-title">Appearance Settings</h2>
      <p className="section-description">Customize the look and feel of your dashboard</p>
      
      {saving && (
        <div className="saving-indicator">
          <Loader size={16} className="saving-spinner" />
          <span>Saving changes...</span>
        </div>
      )}
      
      <div className="appearance-settings">
        <div className="theme-selector">
          <h3>Theme</h3>
          <div className="theme-options">
            <div 
              className={`theme-option ${appearanceSettings.theme === 'light' ? 'active' : ''}`}
              onClick={() => handleThemeChange('light')}
            >
              <div className="theme-preview light-theme"></div>
              <span>Light</span>
            </div>
            <div 
              className={`theme-option ${appearanceSettings.theme === 'dark' ? 'active' : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              <div className="theme-preview dark-theme"></div>
              <span>Dark</span>
            </div>
            <div 
              className={`theme-option ${appearanceSettings.theme === 'system' ? 'active' : ''}`}
              onClick={() => handleThemeChange('system')}
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
              className={`color-option blue ${appearanceSettings.accentColor === 'blue' ? 'active' : ''}`}
              onClick={() => handleColorChange('blue')}
            ></div>
            <div 
              className={`color-option purple ${appearanceSettings.accentColor === 'purple' ? 'active' : ''}`}
              onClick={() => handleColorChange('purple')}
            ></div>
            <div 
              className={`color-option green ${appearanceSettings.accentColor === 'green' ? 'active' : ''}`}
              onClick={() => handleColorChange('green')}
            ></div>
            <div 
              className={`color-option orange ${appearanceSettings.accentColor === 'orange' ? 'active' : ''}`}
              onClick={() => handleColorChange('orange')}
            ></div>
          </div>
        </div>
        
        <div className="layout-selector">
          <h3>Layout Density</h3>
          <div className="layout-options">
            <div 
              className={`layout-option ${appearanceSettings.layoutDensity === 'compact' ? 'active' : ''}`}
              onClick={() => handleLayoutChange('compact')}
            >
              <div className="layout-preview compact"></div>
              <span>Compact</span>
            </div>
            <div 
              className={`layout-option ${appearanceSettings.layoutDensity === 'comfortable' ? 'active' : ''}`}
              onClick={() => handleLayoutChange('comfortable')}
            >
              <div className="layout-preview comfortable"></div>
              <span>Comfortable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components for Settings
const SystemSettingCard = ({ id, icon, title, description, lastUpdated, editMode, onToggleEdit }) => {
  const { updateSystemSetting, saving } = useSettings();
  const [formData, setFormData] = useState({
    title,
    description
  });
  const [validationErrors, setValidationErrors] = useState({});
  
  // Reset form data when moving in/out of edit mode
  useEffect(() => {
    if (editMode) {
      setFormData({ title, description });
      setValidationErrors({});
    }
  }, [editMode, title, description]);
  
  const handleInputChange = (e) => {
    const { id: fieldId, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [fieldId.replace(`${id}-`, '')]: value
    }));
  };
  
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      await updateSystemSetting(id, {
        title: formData.title,
        description: formData.description
      });
      onToggleEdit(); // Exit edit mode on success
    } catch (error) {
      // Error is handled by the context and displayed in UI
      console.error('Failed to save setting:', error);
    }
  };
  
  return (
    <div className={`system-setting-card ${editMode ? 'edit-mode' : ''}`}>
      <div className="setting-card-header">
        <div className="setting-icon">{icon}</div>
        <div className="setting-actions">
          {editMode ? (
            <>
              <button 
                className="action-button save" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? <Loader size={16} /> : <Save size={16} />}
              </button>
              <button 
                className="action-button cancel" 
                onClick={onToggleEdit}
                disabled={saving}
              >
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
          <div className={`form-group ${validationErrors.title ? 'has-error' : ''}`}>
            <label htmlFor={`${id}-title`}>Title</label>
            <input 
              type="text" 
              id={`${id}-title`} 
              value={formData.title} 
              onChange={handleInputChange} 
            />
            {validationErrors.title && (
              <span className="error-message">{validationErrors.title}</span>
            )}
          </div>
          <div className={`form-group ${validationErrors.description ? 'has-error' : ''}`}>
            <label htmlFor={`${id}-description`}>Description</label>
            <textarea 
              id={`${id}-description`} 
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
            {validationErrors.description && (
              <span className="error-message">{validationErrors.description}</span>
            )}
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

const ModuleSettingCard = ({ id, icon, module, status, features, lastUpdated }) => {
  const { updateModuleSetting, saving } = useSettings();
  const [enabled, setEnabled] = useState(status === 'Enabled');
  
  const toggleStatus = async () => {
    const newStatus = !enabled;
    try {
      await updateModuleSetting(id, {
        status: newStatus ? 'Enabled' : 'Disabled'
      });
      setEnabled(newStatus);
    } catch (error) {
      console.error('Failed to update module status:', error);
    }
  };
  
  const handleConfigureClick = () => {
    // This would navigate to a module configuration page
    console.log(`Configure ${module}`);
  };
  
  const handleManageFeaturesClick = () => {
    // This would open a modal or navigate to manage features
    console.log(`Manage features for ${module}`);
  };
  
  return (
    <div className="module-setting-card">
      <div className="module-header">
        <div className="module-icon">
          {icon}
        </div>
        <h3 className="module-title">{module}</h3>
        <button 
          className="toggle-button" 
          onClick={toggleStatus}
          disabled={saving}
        >
          {saving ? 
            <Loader size={24} /> : 
            (enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />)
          }
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
        <button 
          className="module-configure"
          onClick={handleConfigureClick}
          disabled={!enabled || saving}
        >
          Configure
        </button>
        <button 
          className="module-manage"
          onClick={handleManageFeaturesClick}
          disabled={!enabled || saving}
        >
          Manage Features
        </button>
      </div>
    </div>
  );
};



export default NewSettings;