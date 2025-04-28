import { useEffect, useState } from "react";
import {
  Briefcase,
  Users,
  ChevronRight,
  Clock,
  Calendar,
  MapPin,
  DollarSign,
  BarChart3,
  Search,
  Filter,
  User,
} from "lucide-react";
import "./newrecruitment.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "../services/supabase";
import JobRequest from "./JobRequest";

export function NewRecruitment() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // const jobOpenings = [
  //   {
  //     id: 1,
  //     title: "Senior Frontend Developer",
  //     department: "Engineering",
  //     location: "New York, NY / Remote",
  //     salary: "$120,000 - $150,000",
  //     postedDate: "Mar 10, 2025",
  //     applicants: 45,
  //     status: "Active"
  //   },
  //   {
  //     id: 2,
  //     title: "Product Marketing Manager",
  //     department: "Marketing",
  //     location: "San Francisco, CA",
  //     salary: "$110,000 - $135,000",
  //     postedDate: "Mar 15, 2025",
  //     applicants: 28,
  //     status: "Active"
  //   },
  //   {
  //     id: 3,
  //     title: "UX/UI Designer",
  //     department: "Design",
  //     location: "Remote",
  //     salary: "$90,000 - $120,000",
  //     postedDate: "Mar 5, 2025",
  //     applicants: 57,
  //     status: "Active"
  //   },
  //   {
  //     id: 4,
  //     title: "Sales Representative",
  //     department: "Sales",
  //     location: "Chicago, IL",
  //     salary: "$75,000 - $95,000 + Commission",
  //     postedDate: "Feb 28, 2025",
  //     applicants: 34,
  //     status: "Active"
  //   },
  //   {
  //     id: 5,
  //     title: "DevOps Engineer",
  //     department: "Engineering",
  //     location: "Remote",
  //     salary: "$130,000 - $160,000",
  //     postedDate: "Mar 12, 2025",
  //     applicants: 19,
  //     status: "Active"
  //   },
  //   {
  //     id: 6,
  //     title: "Content Writer",
  //     department: "Marketing",
  //     location: "Boston, MA / Remote",
  //     salary: "$70,000 - $90,000",
  //     postedDate: "Feb 20, 2025",
  //     applicants: 42,
  //     status: "Closed"
  //   }
  // ];
  const queryClient = useQueryClient();
  const jobOpenings = queryClient.getQueryData(["offers"]) || [];
  console.log(jobOpenings);
  const candidates = [
    {
      id: 1,
      name: "Jason Rodriguez",
      position: "Senior Frontend Developer",
      stage: "Interview",
      image: "/api/placeholder/40/40",
      rating: 4.5,
      nextAction: "Technical Interview",
      date: "Apr 25, 2025",
    },
    {
      id: 2,
      name: "Amanda Chen",
      position: "DevOps Engineer",
      stage: "Assessment",
      image: "/api/placeholder/40/40",
      rating: 4.0,
      nextAction: "Code Review",
      date: "Apr 23, 2025",
    },
    {
      id: 3,
      name: "Raj Patel",
      position: "UX/UI Designer",
      stage: "Screening",
      image: "/api/placeholder/40/40",
      rating: 3.5,
      nextAction: "Phone Screening",
      date: "Apr 22, 2025",
    },
    {
      id: 4,
      name: "Sophia Martinez",
      position: "Product Marketing Manager",
      stage: "Interview",
      image: "/api/placeholder/40/40",
      rating: 5.0,
      nextAction: "Final Interview",
      date: "Apr 26, 2025",
    },
  ];

  const NewRecruitment = () => {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
      const fetchCandidates = async () => {
        let { data: employees, error } = await supabase
          .from("Users")
          .select("*")
          .limit(3)
          .eq("role", "candidate")
          .order("created_at", { ascending: false });
        if (error) throw new Error(error.message);
        //   console.log(employees);
        const returnData = [];
        for (let e of employees) {
          let { data: fileData, error: statError } = await supabase.storage
            .from("avatars")
            .list("", { search: `${e.id}` });
          console.log(fileData);
          if (statError || fileData.length === 0) {
            returnData.push({ ...e, image: null });
          } else {
            const { data: imageData } = await supabase.storage
              .from("avatars")
              .getPublicUrl(`${e.id}.png`);
            const imageUrl = `${imageData.publicUrl}?t=${Date.now()}`;
            returnData.push({ ...e, image: imageUrl });
          }
        }
        console.log(returnData);
        setCandidates(returnData);
      };
      fetchCandidates();
    }, []);

    const statCards = [
      {
        icon: Briefcase,
        value: "6",
        label: "Open Positions",
        trend: "+2 this month",
      },
      {
        icon: Users,
        value: "225",
        label: "Total Applicants",
        trend: "+37 this month",
      },
      {
        icon: Clock,
        value: "18 days",
        label: "Avg. Time to Hire",
        trend: "-3 days vs last quarter",
      },
    ];

    const stages = [
      "All",
      "Applied",
      "Screening",
      "Assessment",
      "Interview",
      "Offer",
      "Hired",
      "Rejected",
    ];

    const filteredJobs = jobOpenings.filter(
      (job) =>
        (selectedStatus === "All" || job.status === selectedStatus) &&
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="recruitment-container">
        <div className="recruitment-header">
          <div className="recruitment-title">
            <Briefcase size={24} />
            <h1>Recruitment & Job Openings</h1>
          </div>

          <button className="post-job-btn">+ Post New Job</button>
        </div>

        <div className="stats-row">
          {statCards.map((stat, index) => (
            <div key={index} className="recruitment-stat-card">
              <div className="stat-header">
                <div className="stat-icon">
                  <stat.icon size={20} />
                </div>
                {stat.trend && <span className="stat-trend">{stat.trend}</span>}
              </div>
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}

          <div className="hiring-pipeline-card">
            <div className="hiring-pipeline-header">
              <h3>Hiring Pipeline</h3>
              <BarChart3 size={20} />
            </div>
            <div className="pipeline-stages">
              <div className="pipeline-stage">
                <div className="stage-value">78</div>
                <div className="stage-bar" style={{ height: "78%" }}></div>
                <div className="stage-label">Applied</div>
              </div>
              <div className="pipeline-stage">
                <div className="stage-value">45</div>
                <div className="stage-bar" style={{ height: "45%" }}></div>
                <div className="stage-label">Screening</div>
              </div>
              <div className="pipeline-stage">
                <div className="stage-value">32</div>
                <div className="stage-bar" style={{ height: "32%" }}></div>
                <div className="stage-label">Assessment</div>
              </div>
              <div className="pipeline-stage">
                <div className="stage-value">24</div>
                <div className="stage-bar" style={{ height: "24%" }}></div>
                <div className="stage-label">Interview</div>
              </div>
              <div className="pipeline-stage">
                <div className="stage-value">12</div>
                <div className="stage-bar" style={{ height: "12%" }}></div>
                <div className="stage-label">Offer</div>
              </div>
              <div className="pipeline-stage">
                <div className="stage-value">8</div>
                <div className="stage-bar" style={{ height: "8%" }}></div>
                <div className="stage-label">Hired</div>
              </div>
            </div>
          </div>
        </div>

        <div className="recruitment-sections-grid">
          <div className="job-openings-section">
            <div className="section-header">
              <h2>Job Openings</h2>
              <div className="section-actions">
                <div className="search-box">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="filter-box">
                  <Filter size={16} />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Closed">Closed</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="job-openings-list">
              {filteredJobs.map((job) => (
                <div key={job.id} className="job-card">
                  <div className="job-info">
                    <h3 className="job-title">{job.title}</h3>
                    <div className="job-details">
                      <div className="job-detail">
                        <Briefcase size={14} />
                        <span>{job.department}</span>
                      </div>
                      <div className="job-detail">
                        <MapPin size={14} />
                        <span>{job.location}</span>
                      </div>
                      <div className="job-detail">
                        <DollarSign size={14} />
                        <span>{job.salary}</span>
                      </div>
                      <div className="job-detail">
                        <Calendar size={14} />
                        <span>Posted {job.postedDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="job-stats">
                    <div className="job-applicants">
                      <Users size={16} />
                      <span>{job.applicants} Applicants</span>
                    </div>
                    {/* <div className={`job-status ${job.status.toLowerCase()}`}>
                    {job.status}
                  </div> */}
                  </div>
                  <button className="view-job-btn">
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="candidates-section">
            <div className="section-header">
              <h2>Recent Candidates</h2>
              <div className="candidate-filter">
                <select defaultValue="All">
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage} Stage
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="candidates-list">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="candidate-card">
                  <div className="candidate-info">
                    {candidate.image ? (
                      <img
                        src={candidate.image}
                        alt={candidate.name}
                        className="candidate-avatar"
                      />
                    ) : (
                      <User size={40} />
                    )}
                    <div>
                      <h3 className="candidate-name">{candidate.name}</h3>
                      <p className="candidate-position">{candidate.position}</p>
                    </div>
                  </div>
                  <div className="candidate-stage-info">
                    {/* <div
                      className={`candidate-stage `}
                    >
                      {candidate.stage}
                    </div> */}
                    <div className="candidate-rating">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`star ${
                            i < Math.floor(candidate.rating) ? "filled" : ""
                          } ${
                            i === Math.floor(candidate.rating) &&
                            candidate.rating % 1 !== 0
                              ? "half-filled"
                              : ""
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="next-action">
                    <div className="next-action-label">
                      Next: {candidate.nextAction}
                    </div>
                    <div className="next-action-date">
                      <Calendar size={14} />
                      <span>{candidate.date}</span>
                    </div>
                  </div>
                </div>
              ))}
              <button className="view-all-btn">View All Candidates</button>
            </div>
            <JobRequest />
          </div>
        </div>
      </div>
    );
  };
  return <NewRecruitment />;
}
