import React from "react";
import { Bell, Search, User, ChevronDown } from "lucide-react";
import "./Header.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logOutApi } from "../services/authProvider";
import { useNavigate } from "react-router";
const Header = ({ sidebarOpen, dropdownOpen, setDropdownOpen }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { name, last_name, email, role } = queryClient.getQueryData(["user"]);
  const { mutate, isPending: isLoggingOut } = useMutation({
    mutationFn: logOutApi,
    mutationKey: ["user"],
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      navigate("/login");
    },
    onError: (err) => {
      console.log(err);
    },
  });
  return (
    <header className="header">
      <div className="header-search-container">
        <div className="search-input-wrapper">
          <input type="text" placeholder="Search..." className="search-input" />
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
                <span className="user-name"> {name + " " + last_name}</span>
                <ChevronDown size={16} />
              </>
            )}
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item">Profile</button>
              <button className="dropdown-item">Account Settings</button>
              <button
                disabled={isLoggingOut}
                onClick={mutate}
                className="dropdown-item dropdown-item-danger"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
