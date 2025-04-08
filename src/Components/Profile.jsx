import { useState } from 'react';
import { User, Mail, Lock, Edit2, Save, Camera, X } from 'lucide-react';
import '../Styles/profile.css';

export default function Profile({ isOpen, onClose, userData }) {
  const [user, setUser] = useState({
    name: userData?.name || "islam",
    email: userData?.email || "boubaker@.com",
    password: "••••••••"
  });
  
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    password: false
  });
  
  const [newPassword, setNewPassword] = useState("");
  
  const handleInputChange = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
  };
  
  const toggleEdit = (field) => {
    setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
    if (field === 'password' && editMode.password) {
      handleInputChange('password', newPassword);
      setNewPassword("");
    }
  };
  
  const closeModal = () => {
    if (onClose) onClose();
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
                  <User size={64} className="avatar-placeholder" />
                </div>
                <button className="avatar-upload-btn">
                  <Camera size={16} />
                </button>
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
                      className="input-field"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
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
            >
              Cancel
            </button>
            <button 
              onClick={closeModal}
              className="save-btn"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}