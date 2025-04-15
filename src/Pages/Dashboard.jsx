import Sidebar from "./sidebar";
import Header from "./Header";
import Maindashboard from "./maindashboard";
import Employees from "./employees";
import Recruitment from "./recruitment";
import LeaveManagement from "./leavemanagement";
import Settings from "./settings";
import "./Dashboard.css";
import Payroll from "./payroll";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "../services/authProvider.js";

const HRMDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await fetchCurrentUser();
        if (!user) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Error checking user:", error);
        window.location.reload();
      }
    };
    checkUser();
  }, []);

  // Function to render the appropriate content based on activeMenu
  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <Maindashboard />;
      case "employees":
        return <Employees />;
      case "recruitment":
        return <Recruitment />;
      case "leave":
        return <LeaveManagement />;
      case "payroll":
        return <Payroll />;
      case "settings":
        return <Settings />;
      default:
        return <Maindashboard />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Component */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      {/* Main Content */}
      <div className="main-content">
        {/* Header Component */}
        <Header
          sidebarOpen={sidebarOpen}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
        />

        {/* Dynamically render content based on activeMenu */}
        {renderContent()}
      </div>
    </div>
  );
};

export default HRMDashboard;
