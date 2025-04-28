import React, { useState, useEffect } from "react";
import {
  DollarSign,
  CreditCard,
  Receipt,
  Clock,
  Calendar,
  TrendingUp,
  Banknote,
  FileText,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  User,
} from "lucide-react";
import "./newpayroll.css";
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "../services/employeesProvider";
import { toast } from "react-toastify";
import Spinner from "../Components/Spinner";

// PayPeriodCard
function PayPeriodCard({ period, status, amount, date, icon: Icon }) {
  const statusClasses = {
    processed: "status-processed",
    pending: "status-pending",
    scheduled: "status-scheduled",
  };
  return (
    <div className="pay-period-card">
      <div className="pay-period-header">
        <div className="period-icon">
          <Icon />
        </div>
        <div className={`period-status ${statusClasses[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
      <h3 className="period-amount">{amount}</h3>
      <p className="period-label">{period}</p>
      <p className="period-date">{date}</p>
    </div>
  );
}

// PaySummaryItem
function PaySummaryItem({ label, value, percentage, increase }) {
  return (
    <div className="pay-summary-item">
      <div className="summary-info">
        <p className="summary-label">{label}</p>
        <h4 className="summary-value">{value}</h4>
      </div>
      {percentage && (
        <div
          className={`summary-trend ${increase ? "trend-up" : "trend-down"}`}
        >
          <TrendingUp />
          <span>{percentage}</span>
        </div>
      )}
    </div>
  );
}

// PayrollTable
function PayrollTable({ data, onSort }) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    onSort(key, direction);
  };

  return (
    <div className="payroll-table-container">
      <table className="payroll-table">
        <thead>
          <tr>
            {[
              "name",
              "department",
              "salary",
              "bonus",
              "deductions",
              "netPay",
            ].map((header) => (
              <th
                key={header}
                onClick={() => requestSort(header)}
                className="sortable-header"
              >
                {header[0].toUpperCase() +
                  header.slice(1).replace(/([A-Z])/g, " $1")}{" "}
                {sortConfig.key === header && (
                  <span className="sort-indicator">
                    {sortConfig.direction === "ascending" ? "↑" : "↓"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((employee, index) => (
            <tr key={index}>
              <td className="employee-cell">
                {!employee.image ? (
                  <User />
                ) : (
                  <img src={employee.image} alt={employee.name} />
                )}
                <span>{employee.name}</span>
              </td>
              <td>{employee.department}</td>
              <td>{employee.salary}</td>
              <td>{employee.bonus}</td>
              <td>{employee.deductions}</td>
              <td className="net-pay">{employee.netPay}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Main Page
export default function NewPayroll() {
  const { data: employeesData, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => await getEmployees(),
    onSuccess: () => toast.success("Employees fetched successfully"),
    onError: (err) => {
      console.error(err);
      toast.error("Failed to fetch employees");
    },
  });

  const [payrollData, setPayrollData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [summaryData, setSummaryData] = useState({
    totalSalary: 0,
    avgSalary: 0,
    totalBonuses: 0,
    totalDeductions: 0,
  });

  useEffect(() => {
    if (employeesData) {
      setPayrollData(employeesData);
      setFilteredData(employeesData);

      const totalSalary = employeesData.reduce(
        (total, employee) => total + employee.salary,
        0
      );
      const totalBonuses = employeesData.reduce(
        (total, employee) => total + employee.bonus,
        0
      );
      const totalDeductions = employeesData.reduce(
        (total, employee) => total + employee.deductions,
        0
      );
      const avgSalary = totalSalary / employeesData.length || 0;

      setSummaryData({
        totalSalary,
        avgSalary,
        totalBonuses,
        totalDeductions,
      });
    }
  }, [employeesData]);

  const departments = [
    "All",
    ...(employeesData
      ? [...new Set(employeesData.map((emp) => emp.department))]
      : []),
  ];

  useEffect(() => {
    let data = [...payrollData];
    if (activeFilter !== "All") {
      data = data.filter((emp) => emp.department === activeFilter);
    }
    if (searchTerm) {
      data = data.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredData(data);
  }, [activeFilter, searchTerm, payrollData]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleFilterClick = (dept) => {
    setActiveFilter(dept);
    setCurrentPage(1);
  };

  const handleSort = (key, direction) => {
    const sorted = [...payrollData].sort((a, b) => {
      const valA = ["salary", "bonus", "deductions", "netPay"].includes(key)
        ? parseFloat(a[key].replace(/[$,]/g, ""))
        : a[key];
      const valB = ["salary", "bonus", "deductions", "netPay"].includes(key)
        ? parseFloat(b[key].replace(/[$,]/g, ""))
        : b[key];
      return direction === "ascending"
        ? valA > valB
          ? 1
          : -1
        : valA < valB
        ? 1
        : -1;
    });
    setPayrollData(sorted);
  };

  const handleExportData = () => {
    alert("Exporting payroll data...");
    // Here you would generate a CSV normally
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="payroll-dashboard">
      <div className="dashboard-header">
        <h1 className="page-title">Payroll Management</h1>
        <button className="export-button" onClick={handleExportData}>
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>

      {/* Pay Period Cards */}
      <div className="payroll-stats-grid">
        <PayPeriodCard
          period="April 2025"
          status="processed"
          amount="$248,350"
          date="Processed on Apr 15, 2025"
          icon={DollarSign}
        />
        <PayPeriodCard
          period="May 2025"
          status="pending"
          amount="$252,450"
          date="Scheduled for May 15, 2025"
          icon={Clock}
        />
        <PayPeriodCard
          period="June 2025"
          status="scheduled"
          amount="$255,700"
          date="Scheduled for Jun 15, 2025"
          icon={Calendar}
        />
      </div>

      {/* Dashboard Cards */}
      <div className="payroll-dashboard-grid">
        {/* Summary */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Payroll Summary</h2>
            <FileText />
          </div>
          <div className="pay-summary-list">
            <PaySummaryItem
              label="Total Salary"
              value={summaryData.totalSalary}
              percentage="2.3%"
              increase
            />
            <PaySummaryItem
              label="Average Salary"
              value={summaryData.avgSalary}
              percentage="1.8%"
              increase
            />
            <PaySummaryItem
              label="Total Bonuses"
              value={summaryData.totalBonuses}
              percentage="5.2%"
              increase
            />
            <PaySummaryItem
              label="Total Deductions"
              value={summaryData.totalDeductions}
              percentage="2.1%"
              increase={false}
            />
          </div>
        </div>

        {/* Payment Methods */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Payment Methods</h2>
            <CreditCard />
          </div>
          <div className="payment-methods-chart">
            {/* Donut Chart */}
            <div className="donut-chart-container">
              <div className="donut-chart">
                <div
                  className="chart-segment bank-transfer"
                  style={{ "--percentage": "65%" }}
                ></div>
                <div
                  className="chart-segment credit-card"
                  style={{ "--percentage": "25%" }}
                ></div>
                <div
                  className="chart-segment check"
                  style={{ "--percentage": "10%" }}
                ></div>
                <div className="chart-center">
                  <Banknote />
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="payment-legend">
              <div className="legend-item">
                <span className="legend-color bank-transfer"></span>
                <span>Bank Transfer</span>
                <span>65%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color credit-card"></span>
                <span>Credit Card</span>
                <span>25%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color check"></span>
                <span>Check</span>
                <span>10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        {departments.map((dept) => (
          <button
            key={dept}
            className={`filter-btn ${activeFilter === dept ? "active" : ""}`}
            onClick={() => handleFilterClick(dept)}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="search-bar">
        <Search />
        <input
          type="text"
          placeholder="Search employee..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <PayrollTable data={currentItems} onSort={handleSort} />

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
