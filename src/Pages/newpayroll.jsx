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
} from "lucide-react";
import "./newpayroll.css";

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

function PaySummaryItem({ label, value, percentage, increase }) {
  return (
    <div className="pay-summary-item">
      <div className="summary-info">
        <p className="summary-label">{label}</p>
        <h4 className="summary-value">{value}</h4>
      </div>
      {percentage && (
        <div className={`summary-trend ${increase ? "trend-up" : "trend-down"}`}>
          <TrendingUp />
          <span>{percentage}</span>
        </div>
      )}
    </div>
  );
}

function PayrollTable({ data, onSort }) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    onSort(key, direction);
  };

  return (
    <div className="payroll-table-container">
      <table className="payroll-table">
        <thead>
          <tr>
            <th onClick={() => requestSort('name')} className="sortable-header">
              Employee {sortConfig.key === 'name' && (
                <span className="sort-indicator">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </th>
            <th onClick={() => requestSort('department')} className="sortable-header">
              Department {sortConfig.key === 'department' && (
                <span className="sort-indicator">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </th>
            <th onClick={() => requestSort('salary')} className="sortable-header">
              Salary {sortConfig.key === 'salary' && (
                <span className="sort-indicator">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </th>
            <th onClick={() => requestSort('bonus')} className="sortable-header">
              Bonus {sortConfig.key === 'bonus' && (
                <span className="sort-indicator">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </th>
            <th onClick={() => requestSort('deductions')} className="sortable-header">
              Deductions {sortConfig.key === 'deductions' && (
                <span className="sort-indicator">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </th>
            <th onClick={() => requestSort('netPay')} className="sortable-header">
              Net Pay {sortConfig.key === 'netPay' && (
                <span className="sort-indicator">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((employee, index) => (
            <tr key={index}>
              <td className="employee-cell">
                <img src={employee.image} alt={employee.name} />
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

export function NewPayroll() {
  const initialData = [
    {
      name: "Sarah Johnson",
      department: "Engineering",
      salary: "$6,000",
      bonus: "$500",
      deductions: "$1,350",
      netPay: "$5,150",
      image: "/api/placeholder/40/40",
    },
    {
      name: "Michael Chen",
      department: "Product",
      salary: "$7,200",
      bonus: "$800",
      deductions: "$1,750",
      netPay: "$6,250",
      image: "/api/placeholder/40/40",
    },
    {
      name: "Emily Davis",
      department: "Marketing",
      salary: "$5,500",
      bonus: "$400",
      deductions: "$1,200",
      netPay: "$4,700",
      image: "/api/placeholder/40/40",
    },
    {
      name: "David Wilson",
      department: "Sales",
      salary: "$5,000",
      bonus: "$1,200",
      deductions: "$1,450",
      netPay: "$4,750",
      image: "/api/placeholder/40/40",
    },
    {
      name: "Lisa Rodriguez",
      department: "HR",
      salary: "$5,800",
      bonus: "$300",
      deductions: "$1,280",
      netPay: "$4,820",
      image: "/api/placeholder/40/40",
    },
    {
      name: "Robert Kim",
      department: "Engineering",
      salary: "$6,500",
      bonus: "$600",
      deductions: "$1,420",
      netPay: "$5,680",
      image: "/api/placeholder/40/40",
    },
  ];
  
  const [payrollData, setPayrollData] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [summaryData, setSummaryData] = useState({
    totalSalary: "$248,350",
    avgSalary: "$65,400",
    totalBonuses: "$32,700",
    totalDeductions: "$56,890"
  });
  
  const departments = ["All", ...new Set(initialData.map(employee => employee.department))];
  
  // Filter function
  useEffect(() => {
    let result = [...payrollData];
    
    // Filter by department
    if (activeFilter !== "All") {
      result = result.filter(employee => employee.department === activeFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(employee => 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredData(result);
  }, [activeFilter, searchTerm, payrollData]);
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  const handleFilterClick = (department) => {
    setActiveFilter(department);
    setCurrentPage(1);
  };
  
  const handleSort = (key, direction) => {
    const sortedData = [...payrollData].sort((a, b) => {
      // Remove currency symbol and convert to number for numerical comparisons
      if (key === 'salary' || key === 'bonus' || key === 'deductions' || key === 'netPay') {
        const valueA = parseFloat(a[key].replace('$', '').replace(',', ''));
        const valueB = parseFloat(b[key].replace('$', '').replace(',', ''));
        
        if (direction === 'ascending') {
          return valueA - valueB;
        } else {
          return valueB - valueA;
        }
      } else {
        // String comparison for text fields
        if (direction === 'ascending') {
          return a[key].localeCompare(b[key]);
        } else {
          return b[key].localeCompare(a[key]);
        }
      }
    });
    
    setPayrollData(sortedData);
  };
  
  const handleExportData = () => {
    alert("Exporting payroll data...");
    // In a real app, this would create a CSV or Excel file for download
  };
  
  return (
    <div className="payroll-dashboard">
      <div className="dashboard-header">
        <h1 className="page-title">Payroll Management</h1>
        <button className="export-button" onClick={handleExportData}>
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>
      
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

      <div className="payroll-dashboard-grid">
        {/* Payroll Summary */}
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
              increase={true}
            />
            <PaySummaryItem
              label="Average Salary"
              value={summaryData.avgSalary}
              percentage="1.8%"
              increase={true}
            />
            <PaySummaryItem
              label="Total Bonuses"
              value={summaryData.totalBonuses}
              percentage="5.2%"
              increase={true}
            />
            <PaySummaryItem
              label="Total Deductions"
              value={summaryData.totalDeductions}
              percentage="2.1%"
              increase={true}
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
            <div className="donut-chart-container">
              <div className="donut-chart">
                <div className="chart-segment bank-transfer" style={{ "--percentage": "65%" }}></div>
                <div className="chart-segment credit-card" style={{ "--percentage": "25%" }}></div>
                <div className="chart-segment check" style={{ "--percentage": "10%" }}></div>
                <div className="chart-center">
                  <Banknote />
                </div>
              </div>
            </div>
            <div className="payment-legend">
              <div className="legend-item">
                <span className="legend-color bank-transfer"></span>
                <span className="legend-label">Bank Transfer</span>
                <span className="legend-value">65%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color credit-card"></span>
                <span className="legend-label">Credit Card</span>
                <span className="legend-value">25%</span>
              </div>
              <div className="legend-item">
                <span className="legend-color check"></span>
                <span className="legend-label">Check</span>
                <span className="legend-value">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Details */}
      <div className="dashboard-card payroll-details-card">
        <div className="card-header">
          <h2>Payroll Details</h2>
          <Receipt />
        </div>
        
        <div className="payroll-controls">
          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search employees..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="payroll-filters">
            <div className="filter-icon">
              <Filter size={16} />
            </div>
            <div className="filter-label">Filter by:</div>
            <div className="filter-buttons">
              {departments.map(department => (
                <button 
                  key={department} 
                  className={`filter-button ${activeFilter === department ? 'active' : ''}`}
                  onClick={() => handleFilterClick(department)}
                >
                  {department}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <PayrollTable data={currentItems} onSort={handleSort} />
        
        {/* Pagination controls */}
        {filteredData.length > itemsPerPage && (
          <div className="pagination-controls">
            <button 
              className="pagination-button" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              className="pagination-button" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewPayroll;