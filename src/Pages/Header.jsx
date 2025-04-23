import React, { useState } from "react";
import { Bell, Search, User, ChevronDown } from "lucide-react";
import "./Header.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logOutApi } from "../services/authProvider";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { palette } from "../Styles/colors";
import Profile from "../Components/profile";

const NotificationsDiv = styled.div`
  padding: 0px;
  margin: 0px;
  overflow: scroll;
  overflow-x: hidden;
  border-radius: 5%;
  padding: 10px;
  background-color: ${palette.white};
  position: absolute;
  height: 200px;
  width: 200px;
  top: 70px;
  right: 250px;
`;

const Notification = styled.div`
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid white;
  /* padding: 10px; */
  width: 100%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${palette.black};
  &:hover {
    color: ${palette.mainBlue};
    cursor: pointer;
    background-color: #f5f2f2;
    /* filter: brightness(0.9); */
    /* box-shadow: 0px 0px 2px 2px ${palette.blue}; */
  }
`;

const Header = ({ sidebarOpen }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // State to control profile modal
  const [notifications, setNotifications] = useState(false);
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

  // Function to open profile modal and close dropdown
  const openProfile = () => {
    setIsProfileOpen(true);
    setDropdownOpen(false);
  };

  return (
    <>
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
                  <span className="user-name">{name + " " + last_name}</span>
                  <ChevronDown size={16} />
                </>
              )}
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <a onClick={openProfile} className="dropdown-item">
                  Profile
                </a>
                <a
                  disabled={isLoggingOut}
                  onClick={mutate}
                  className="dropdown-item dropdown-item-danger"
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Profile Modal Component */}
      {isProfileOpen && (
        <Profile
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          userData={{ name: name + " " + last_name, email }}
        />
      )}
    </>
  );
};

export default Header;
