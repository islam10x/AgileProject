import {
  Users,
  Calendar,
  DollarSign,
  Clock,
  Award,
  Briefcase,
  Building2,
  BarChart3,
} from "lucide-react";
import "./newdashboard.css";
import { getEmployeeCount, getUserCountByRole } from "../services/authProvider";
import { useState, useEffect } from "react";
function StatCard({ icon: Icon, label, value, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-icon">
          <Icon />
        </div>
        {trend && <span className="stat-trend">{trend}</span>}
      </div>
      <h3 className="stat-value">{value}</h3>
      <p className="stat-label">{label}</p>
    </div>
  );
}

function EmployeeCard({ name, role, department, image }) {
  return (
    <div className="employee-card">
      <img src={image} alt={name} className="employee-image" />
      <div className="employee-info">
        <h4 className="employee-name">{name}</h4>
        <p className="employee-role">{role}</p>
        <p className="employee-department">{department}</p>
      </div>
    </div>
  );
}

export function NewDashboard() {
  const [numemployees, setNumemployees] = useState(null);
  
    useEffect(() => {
      const fetchUserCount = async () => {  
        try {
          const count = await getEmployeeCount("candidate");
          setNumemployees(count);
        } catch (error) {  
          console.error("Error fetching user count:", error);
        }
      };
      fetchUserCount();

    }, []);
  return (
    <div className="dashboard">
      <div className="stats-grid">
        <StatCard
          icon={Users}
          label="Total Employees"
          value={numemployees}
          trend="+12% vs last month"
        />
        <StatCard icon={DollarSign} label="Average Salary" value="$65,400" />
        <StatCard icon={Clock} label="Time to Hire" value="18 days" />
        <StatCard
          icon={Award}
          label="Employee Satisfaction"
          value="94%"
          trend="+5% vs last quarter"
        />
      </div>

      <div className="dashboard-grid">
        {/* Department Distribution */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Department Distribution</h2>
            <Building2 />
          </div>
          <div className="department-list">
            <div className="department-item">
              <span>Engineering</span>
              <div className="progress-bar">
                <div
                  className="progress-fill engineering"
                  style={{ width: "45%" }}
                ></div>
              </div>
              <span>45%</span>
            </div>
            <div className="department-item">
              <span>Marketing</span>
              <div className="progress-bar">
                <div
                  className="progress-fill marketing"
                  style={{ width: "20%" }}
                ></div>
              </div>
              <span>20%</span>
            </div>
            <div className="department-item">
              <span>HR</span>
              <div className="progress-bar">
                <div
                  className="progress-fill hr"
                  style={{ width: "10%" }}
                ></div>
              </div>
              <span>10%</span>
            </div>
            <div className="department-item">
              <span>Sales</span>
              <div className="progress-bar">
                <div
                  className="progress-fill sales"
                  style={{ width: "25%" }}
                ></div>
              </div>
              <span>25%</span>
            </div>
          </div>
        </div>

        {/* Recent Hires */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Recent Hires</h2>
            <Briefcase />
          </div>
          <div className="recent-hires">
            <EmployeeCard
              name="Sarah Johnson"
              role="Senior Developer"
              department="Engineering"
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
            <EmployeeCard
              name="Michael Chen"
              role="Product Manager"
              department="Product"
              image="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
            <EmployeeCard
              name="Emily Davis"
              role="Marketing Lead"
              department="Marketing"
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
          </div>
        </div>

        {/* Upcoming Reviews */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Upcoming Reviews</h2>
            <Calendar />
          </div>
          <div className="reviews-list">
            {[
              {
                date: "Mar 15",
                name: "Annual Review: David Wilson",
                type: "Performance",
              },
              {
                date: "Mar 18",
                name: "Quarterly Check-in: Lisa Zhang",
                type: "Goals",
              },
              {
                date: "Mar 20",
                name: "Probation Review: James Smith",
                type: "Performance",
              },
            ].map((review, index) => (
              <div key={index} className="review-item">
                <div className="review-date">{review.date}</div>
                <div className="review-info">
                  <p className="review-name">{review.name}</p>
                  <p className="review-type">{review.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="dashboard-card metrics-card">
        <div className="card-header">
          <h2>Performance Metrics</h2>
          <BarChart3 />
        </div>
        <div className="metrics-grid">
          {[
            {
              label: "Training Completion",
              value: "87%",
              trend: "+5%",
              className: "metric-blue",
            },
            {
              label: "Employee Retention",
              value: "92%",
              trend: "+2%",
              className: "metric-green",
            },
            {
              label: "Goal Achievement",
              value: "78%",
              trend: "+8%",
              className: "metric-purple",
            },
          ].map((metric, index) => (
            <div key={index} className="metric-item">
              <h3 className={`metric-value ${metric.className}`}>
                {metric.value}
              </h3>
              <p className="metric-label">{metric.label}</p>
              <span className="metric-trend">{metric.trend} vs last month</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewDashboard;
