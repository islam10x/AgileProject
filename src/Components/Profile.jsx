import { useState, useRef, useEffect } from 'react';
import { User, Mail, Lock, Edit2, Save, Camera, X, CheckCircle } from 'lucide-react';
import '../Styles/profile.css';

export default function Profile({ isOpen, onClose, userData, onSaveChanges }) {
  const [user, setUser] = useState({
    name: userData?.name || "islam",
    email: userData?.email || "boubaker@.com",
    password: "••••••••",
    profileImage: userData?.profileImage || null
  });
  
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    password: false
  });
  
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  
  const [saveStatus, setSaveStatus] = useState({
    saving: false,
    success: false,
    error: null
  });
  
  const fileInputRef = useRef(null);
  const originalUserData = useRef({...user});
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setUser({
        name: userData?.name || "islam",
        email: userData?.email || "boubaker@.com",
        password: "••••••••",
        profileImage: userData?.profileImage || null
      });
      originalUserData.current = {
        name: userData?.name || "islam",
        email: userData?.email || "boubaker@.com",
        password: "••••••••",
        profileImage: userData?.profileImage || null
      };
      setEditMode({
        name: false,
        email: false,
        password: false
      });
      setPasswordData({
        current: "",
        new: "",
        confirm: ""
      });
      setSaveStatus({
        saving: false,
        success: false,
        error: null
      });
    }
  }, [isOpen, userData]);
  
  const handleInputChange = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };
  
  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };
  
  const toggleEdit = (field) => {
    // If we're currently editing this field and clicking save
    if (editMode[field]) {
      // Validate the field before saving
      if (field === 'password') {
        if (validatePasswordChange()) {
          // In a real app, you would hash the password first
          handleInputChange('password', '••••••••'); // Replace with new masked password
        } else {
          return; // Don't exit edit mode if validation fails
        }
      }
    }
    
    setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
  };
  
  const validatePasswordChange = () => {
    // Basic validation
    if (!passwordData.current) {
      alert("Please enter your current password");
      return false;
    }
    if (passwordData.new !== passwordData.confirm) {
      alert("New passwords don't match");
      return false;
    }
    if (passwordData.new.length < 6) {
      alert("Password must be at least 6 characters");
      return false;
    }
    return true;
  };
  
  const closeModal = () => {
    // Reset form and close
    setUser(originalUserData.current);
    if (onClose) onClose();
  };
  
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }
      
      // Create a URL for the image file
      const imageUrl = URL.createObjectURL(file);
      
      // Update the user state with the new image
      handleInputChange('profileImage', {
        url: imageUrl,
        file: file // Store the actual file for later upload
      });
    }
  };
  
  const saveChanges = async () => {
    // Start saving process
    setSaveStatus({ saving: true, success: false, error: null });
    
    try {
      // Instead of FormData, create a regular object to pass to parent
      const updatedUserData = {
        name: user.name,
        email: user.email
      };
      
      // Add password if it was changed
      if (passwordData.new && editMode.password) {
        updatedUserData.currentPassword = passwordData.current;
        updatedUserData.newPassword = passwordData.new;
      }
      
      // Handle profile image differently
      if (user.profileImage && user.profileImage.file) {
        updatedUserData.profileImage = user.profileImage;
      } else if (user.profileImage) {
        updatedUserData.profileImage = user.profileImage;
      }
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Make sure to update parent component with changes BEFORE setting success
      if (onSaveChanges) {
        await onSaveChanges(updatedUserData);
      }
      
      // Update original data ref with current user data
      originalUserData.current = {...user};
      
      // Show success
      setSaveStatus({ saving: false, success: true, error: null });
      
      // Reset edit modes
      setEditMode({
        name: false,
        email: false,
        password: false
      });
      
      // Use a separate success state to ensure we don't run into timing issues
      const successTimer = setTimeout(() => {
        setSaveStatus(prev => ({...prev, success: false}));
        closeModal();
      }, 1500);
      
      // Cleanup function for the timer
      return () => clearTimeout(successTimer);
      
    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus({ 
        saving: false, 
        success: false, 
        error: error.message || "Failed to save changes" 
      });
    }
  };
  
  const hasChanges = () => {
    // Check if any editable field has changed
    return user.name !== originalUserData.current.name ||
           user.email !== originalUserData.current.email ||
           (user.profileImage !== originalUserData.current.profileImage) ||
           (editMode.password && passwordData.new && passwordData.current);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      
      <div 
        className="modal-backdrop"
        onClick={closeModal}
      ></div>
      
     
      <div className="modal-wrapper">
        <div className="modal-content">
          
          <div className="modal-header">
            <h2 className="modal-title">Profile Settings</h2>
            <button 
              onClick={closeModal}
              className="close-modal-btn"
            >
              <X size={24} />
            </button>
          </div>
          
         
          <div className="modal-body">
            
            <div className="profile-header">
              <div className="avatar-container">
                <div className="avatar">
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage.url || user.profileImage} 
                      alt="Profile" 
                      className="avatar-image" 
                    />
                  ) : (
                    <User size={64} className="avatar-placeholder" />
                  )}
                </div>
                <button className="avatar-upload-btn" onClick={triggerFileSelect}>
                  <Camera size={16} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
              <h2 className="profile-name">{user.name}</h2>
              <p className="profile-email">{user.email}</p>
            </div>
            
            
            <div className="profile-info">
              
              <div className="info-card">
                <div className="card-header">
                  <div className="card-title-container">
                    <User className="card-icon" size={20} />
                    <h3 className="card-title">Full Name</h3>
                  </div>
                  <button 
                    onClick={() => toggleEdit('name')}
                    className="edit-btn"
                  >
                    {editMode.name ? <Save size={18} /> : <Edit2 size={18} />}
                  </button>
                </div>
                {editMode.name ? (
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="input-field"
                  />
                ) : (
                  <p className="field-value">{user.name}</p>
                )}
              </div>
              
              
              <div className="info-card">
                <div className="card-header">
                  <div className="card-title-container">
                    <Mail className="card-icon" size={20} />
                    <h3 className="card-title">Email Address</h3>
                  </div>
                  <button 
                    onClick={() => toggleEdit('email')}
                    className="edit-btn"
                  >
                    {editMode.email ? <Save size={18} /> : <Edit2 size={18} />}
                  </button>
                </div>
                {editMode.email ? (
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="input-field"
                  />
                ) : (
                  <p className="field-value">{user.email}</p>
                )}
              </div>
              
              
              <div className="info-card">
                <div className="card-header">
                  <div className="card-title-container">
                    <Lock className="card-icon" size={20} />
                    <h3 className="card-title">Password</h3>
                  </div>
                  <button 
                    onClick={() => toggleEdit('password')}
                    className="edit-btn"
                  >
                    {editMode.password ? <Save size={18} /> : <Edit2 size={18} />}
                  </button>
                </div>
                {editMode.password ? (
                  <div className="password-inputs">
                    <input
                      type="password"
                      placeholder="Current password"
                      value={passwordData.current}
                      onChange={(e) => handlePasswordChange('current', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={passwordData.new}
                      onChange={(e) => handlePasswordChange('new', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={passwordData.confirm}
                      onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                      className="input-field"
                    />
                  </div>
                ) : (
                  <p className="field-value">{user.password}</p>
                )}
              </div>
            </div>
          </div>
          
          
          <div className="modal-footer">
            <button 
              onClick={closeModal}
              className="cancel-btn"
              disabled={saveStatus.saving}
            >
              Cancel
            </button>
            <button 
              onClick={saveChanges}
              className={`save-btn ${saveStatus.saving ? 'saving' : ''} ${saveStatus.success ? 'success' : ''}`}
              disabled={saveStatus.saving || saveStatus.success || !hasChanges()}
            >
              {saveStatus.saving ? (
                "Saving..."
              ) : saveStatus.success ? (
                <>
                  <CheckCircle size={16} />
                  Saved!
                </>
              ) : (
                "Save Changes"
              )}
            </button>
            
            {saveStatus.error && (
              <div className="error-message">{saveStatus.error}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}