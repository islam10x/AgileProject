import React from 'react';
import { Bell, Search, User, ChevronDown } from 'lucide-react';
import './Header.css';

const Header = ({ sidebarOpen, dropdownOpen, setDropdownOpen }) => {
  return (
    <header className="header">
      <div className="header-search-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
          <Search className="search-icon" size={18} />
        </div>
      </div>

      <div className="header-actions">
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        
        <div className="user-dropdown">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="user-dropdown-btn"
          >
            <div className="user-avatar">
              <User size={18} />
            </div>
            {sidebarOpen && (
              <>
                <span className="user-name">Admin User</span>
                <ChevronDown size={16} />
              </>
            )}
          </button>
          
          {dropdownOpen && (
            <div className="dropdown-menu">
              <a href="#" className="dropdown-item">Profile</a>
              <a href="#" className="dropdown-item">Account Settings</a>
              <a href="#" className="dropdown-item dropdown-item-danger">Logout</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;