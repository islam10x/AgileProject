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
import NewDashboard from "./newdashboard.jsx";
import { NewEmployees } from "./newemployees.jsx";
import { NewRecruitment } from "./newrecruitment.jsx";
import NewLeaveManagement from "./newleavemanagement.jsx";
import NewPayroll from "./newpayroll.jsx";
import NewSettings from "./newsettings.jsx";
import OffersDashboard from "./OffersDashboard.jsx";
import RequestsDashboard from "./RequestsDashboard.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOffers } from "../services/infoProvider.js";

const HRMDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const queryClient = useQueryClient();
  const { data: offers } = useQuery({
    queryKey: ["offers"],
    queryFn: getOffers,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await fetchCurrentUser();
        if (!user) {
          console.error("No user found. Redirecting or handling logout...");
          // Optionally: Redirect to login page if using react-router
          // navigate("/login");
        } else {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Error checking user:", error);
        // Optionally: Redirect or show error page
      }
    };

    checkUser();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "requests":
        return <RequestsDashboard user={currentUser} />;
      case "offers":
        return <OffersDashboard user={currentUser} offers={offers} />;
      case "dashboard":
        return <NewDashboard />;
      case "employees":
        return <NewEmployees />;
      case "recruitment":
        return <NewRecruitment />;
      case "leave":
        return <NewLeaveManagement />;
      case "payroll":
        return <NewPayroll />;
      case "settings":
        return <NewSettings />;
      default:
        return <NewDashboard />;
    }
  };

  if (!currentUser) {
    return <div className="loading-screen">Loading user...</div>;
  }

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
