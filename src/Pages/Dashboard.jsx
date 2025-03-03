import React, { useState } from "react";
import {
  Users,
  Calendar,
  FileText,
  Briefcase,
  BarChart,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
} from "lucide-react";
import "../Styles/Dashboard.css";
import { logout } from "../services/authProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const HRMDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const queryClient = useQueryClient();
  const { name, last_name, email, role } = queryClient.getQueryData(["user"]);

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
    onError: (err) => {
      toast(`Error: ${err} `);
    },
  });
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      className="flex bg-gray-100"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          {sidebarOpen && <h1 className="text-xl font-bold">HR Manager</h1>}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-700"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
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
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4">
          <div className="flex items-center w-1/3">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                3
              </span>
            </button>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <User size={18} />
                </div>
                {sidebarOpen && (
                  <>
                    <span className="font-medium">{`${name} ${last_name}`}</span>
                    <ChevronDown size={16} />
                  </>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-10">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Account Settings
                  </a>
                  <a
                    onClick={mutate}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Total Employees"
              value="248"
              percentage="+2.5%"
              increase={true}
            />
            <StatCard
              title="Open Positions"
              value="12"
              percentage="-1.8%"
              increase={false}
            />
            <StatCard
              title="Interviews Scheduled"
              value="24"
              percentage="+5.3%"
              increase={true}
            />
            <StatCard
              title="Leave Requests"
              value="8"
              percentage="+1.2%"
              increase={true}
            />
          </div>

          {/* Recent Activities and Announcements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
              <div className="space-y-4">
                <ActivityItem
                  title="New employee onboarded"
                  description="John Smith joined as Senior Developer"
                  time="2 hours ago"
                />
                <ActivityItem
                  title="Leave request"
                  description="Anna Johnson requested annual leave"
                  time="5 hours ago"
                />
                <ActivityItem
                  title="Recruitment update"
                  description="5 candidates shortlisted for UI Designer position"
                  time="Yesterday"
                />
                <ActivityItem
                  title="Payroll processed"
                  description="February payroll has been processed"
                  time="2 days ago"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Announcements</h3>
              <div className="space-y-4">
                <AnnouncementItem
                  title="Company Town Hall"
                  description="Quarterly town hall scheduled for March 15th"
                  date="Mar 15"
                />
                <AnnouncementItem
                  title="New Benefits Package"
                  description="Updated health benefits package available from April"
                  date="Apr 1"
                />
                <AnnouncementItem
                  title="Office Closure"
                  description="Office will be closed for spring maintenance"
                  date="Mar 10"
                />
                <AnnouncementItem
                  title="Performance Reviews"
                  description="Q1 performance reviews start next week"
                  date="Mar 5"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Helper Components
const MenuItem = ({ icon, text, active, collapsed, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-2 rounded-md ${
        active
          ? "bg-gray-800 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
      }`}
    >
      <div className={`${collapsed ? "mx-auto" : "mr-3"}`}>{icon}</div>
      {!collapsed && <span>{text}</span>}
    </button>
  );
};

const StatCard = ({ title, value, percentage, increase }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-gray-500 text-sm">{title}</h3>
      </div>
      <div className="flex items-end">
        <p className="text-2xl font-semibold">{value}</p>
        <p
          className={`ml-2 text-sm ${
            increase ? "text-green-500" : "text-red-500"
          }`}
        >
          {percentage}
        </p>
      </div>
    </div>
  );
};

const ActivityItem = ({ title, description, time }) => {
  return (
    <div className="border-b border-gray-100 pb-4">
      <p className="font-medium">{title}</p>
      <p className="text-gray-600 text-sm">{description}</p>
      <p className="text-gray-400 text-xs mt-1">{time}</p>
    </div>
  );
};

const AnnouncementItem = ({ title, description, date }) => {
  return (
    <div className="border-b border-gray-100 pb-4">
      <div className="flex justify-between">
        <p className="font-medium">{title}</p>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {date}
        </span>
      </div>
      <p className="text-gray-600 text-sm mt-1">{description}</p>
    </div>
  );
};

export default HRMDashboard;
