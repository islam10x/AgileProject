import React from "react";
import {
  Users,
  Calendar,
  FileText,
  Briefcase,
  BarChart,
  Settings,
  Menu,
  X,
  Newspaper,
  ListCheck,
} from "lucide-react";
import "./sidebar.css";
import Payroll from "./payroll";
import { useQueryClient } from "@tanstack/react-query";

const Sidebar = ({ sidebarOpen, toggleSidebar, activeMenu, setActiveMenu }) => {
  const queryClient = useQueryClient();
  const { role } = queryClient.getQueryData(["user"]);
  return (
    <div
      className={`sidebar ${
        sidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"
      }`}
    >
      {/* Logo */}
      <div className="sidebar-header">
        {sidebarOpen && <h1 className="sidebar-title">{role.toUpperCase()}</h1>}
        <button onClick={toggleSidebar} className="sidebar-toggle-btn">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <div className="sidebar-menu-container">
        <nav className="sidebar-nav">
          {role === "hr" && (
            <>
              <MenuItem
                icon={<BarChart />}
                text="Dashboard"
                active={activeMenu === "dashboard"}
                collapsed={!sidebarOpen}
                onClick={() => setActiveMenu("dashboard")}
              />
              <MenuItem
                icon={<Users />}
                text="Employees"
                active={activeMenu === "employees"}
                collapsed={!sidebarOpen}
                onClick={() => setActiveMenu("employees")}
              />
              <MenuItem
                icon={<Briefcase />}
                text="Recruitment"
                active={activeMenu === "recruitment"}
                collapsed={!sidebarOpen}
                onClick={() => setActiveMenu("recruitment")}
              />
              <MenuItem
                icon={<Calendar />}
                text="Leave Management"
                active={activeMenu === "leave"}
                collapsed={!sidebarOpen}
                onClick={() => setActiveMenu("leave")}
              />
              <MenuItem
                icon={<FileText />}
                text="Payroll"
                active={activeMenu === "payroll"}
                collapsed={!sidebarOpen}
                onClick={() => setActiveMenu("payroll")}
              />
              <MenuItem
                icon={<Settings />}
                text="Settings"
                active={activeMenu === "settings"}
                collapsed={!sidebarOpen}
                onClick={() => setActiveMenu("settings")}
              />
            </>
          )}
          {role === "candidate" && (
            <>
              <MenuItem
                icon={<BarChart />}
                text="Dashboard"
                active={activeMenu === "dashboard"}
                collapsed={!sidebarOpen}
                onClick={() => setActiveMenu("dashboard")}
              />
              <MenuItem
                icon={<Newspaper />}
                text={"Offers"}
                onClick={() => {
                  setActiveMenu("offers");
                }}
                collapsed={!sidebarOpen}
                active={activeMenu === "offers"}
              />
              <MenuItem
                icon={<ListCheck />}
                text={"Requests"}
                onClick={() => {
                  setActiveMenu("requests");
                }}
                collapsed={!sidebarOpen}
                active={activeMenu === "requests"}
              />
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

// MenuItem sub-component
const MenuItem = ({ icon, text, active, collapsed, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`menu-item ${
        active ? "menu-item-active" : "menu-item-inactive"
      }`}
    >
      <div
        className={
          collapsed ? "menu-item-icon-collapsed" : "menu-item-icon-expanded"
        }
      >
        {icon}
      </div>
      {!collapsed && <span>{text}</span>}
    </button>
  );
};

export default Sidebar;
