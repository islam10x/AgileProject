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
  X,
  Currency,
} from "lucide-react";
import "./newrecruitment.css";
import { fetchJobOpenings, postNewJob, fetchRecentCandidates } from "../services/offersProvider";
import JobRequest from "./JobRequest";

export function NewRecruitment() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobOpenings, setJobOpenings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    openPositions: 0,
    totalApplicants: 0,
    avgTimeToHire: 0,
  });
  const [pipelineStats, setPipelineStats] = useState([
    { stage: "Applied", count: 0 },
    { stage: "Screening", count: 0 },
    { stage: "Assessment", count: 0 },
    { stage: "Interview", count: 0 },
    { stage: "Offer", count: 0 },
    { stage: "Hired", count: 0 },
  ]);
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    location: "",
    salary: "",
    currency:"USD",
    type: "",
    description: "",
    status: "Active",
    expires_at: undefined,
  });
  const [candidates, setCandidates] = useState([]);

  // Fetch job openings using the service function
  useEffect(() => {
    const loadJobOpenings = async () => {
      try {
        setIsLoading(true);
        const data = await fetchJobOpenings();
        setJobOpenings(data);
        calculateStats(data);
      } catch (error) {
        console.error("Error fetching job openings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadJobOpenings();
  }, []);

  // Fetch recent candidates
  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const data = await fetchRecentCandidates();
        setCandidates(data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    loadCandidates();
  }, []);

  const calculateStats = (jobs) => {
    const openPositions = jobs.filter(job => job.status === "Active").length;
    const totalApplicants = jobs.reduce((total, job) => total + (job.applicants || 0), 0);
    const avgTimeToHire = Math.round(Math.random() * 10) + 15;
    
    setStats({
      openPositions,
      totalApplicants,
      avgTimeToHire: `${avgTimeToHire} days`,
    });
    
    const applied = Math.round(totalApplicants * 0.8);
    const screening = Math.round(applied * 0.7);
    const assessment = Math.round(screening * 0.7);
    const interview = Math.round(assessment * 0.7);
    const offer = Math.round(interview * 0.5);
    const hired = Math.round(offer * 0.7);
    
    setPipelineStats([
      { stage: "Applied", count: applied },
      { stage: "Screening", count: screening },
      { stage: "Assessment", count: assessment },
      { stage: "Interview", count: interview },
      { stage: "Offer", count: offer },
      { stage: "Hired", count: hired },
    ]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();
    
    const newJobData = {
      ...newJob,
      created_at: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      applicants: 0
    };
    
    try {
      // Post the new job to the database
      const createdJob = await postNewJob(newJobData);
      
      // Update local state with the new job
      setJobOpenings(prev => [...prev, ...createdJob]);
      calculateStats([...jobOpenings, ...createdJob]);
      
      // Close the modal and reset form
      setShowJobModal(false);
      setNewJob({
        title: "",
        department: "",
        location: "",
        salary: "",
        description: "",
        status: "Active"
      });
    } catch (error) {
      console.error("Error posting job:", error);
    }
  };

  const statCards = [
    {
      icon: Briefcase,
      value: stats.openPositions.toString(),
      label: "Open Positions",
      trend: `+${Math.round(stats.openPositions * 0.2)} this month`,
    },
    {
      icon: Users,
      value: stats.totalApplicants.toString(),
      label: "Total Applicants",
      trend: `+${Math.round(stats.totalApplicants * 0.15)} this month`,
    },
    {
      icon: Clock,
      value: stats.avgTimeToHire,
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

  if (isLoading) {
    return <div className="loading-container">Loading job openings...</div>;
  }

  return (
    <div className="recruitment-container">
      {/* Header Section */}
      <div className="recruitment-header">
        <div className="recruitment-title">
          <Briefcase size={24} />
          <h1>Recruitment & Job Openings</h1>
        </div>
        <button className="post-job-btn" onClick={() => setShowJobModal(true)}>
          + Post New Job
        </button>
      </div>

      {/* Stats Row */}
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
            {pipelineStats.map((stage, index) => (
              <div key={index} className="pipeline-stage">
                <div className="stage-value">{stage.count}</div>
                <div 
                  className="stage-bar" 
                  style={{ 
                    height: `${(stage.count / (pipelineStats[0].count || 1)) * 100}%` 
                  }}
                ></div>
                <div className="stage-label">{stage.stage}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="recruitment-sections-grid">
        {/* Job Openings Section */}
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
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
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
                        <span>Posted {job.created_at}</span>
                      </div>
                    </div>
                  </div>
                  <div className="job-stats">
                    <div className="job-applicants">
                      <Users size={16} />
                      <span>{job.applicants} Applicants</span>
                    </div>
                    <div className={`job-status ${job.status.toLowerCase()}`}>
                      {job.status}
                    </div>
                  </div>
                  <button className="view-job-btn">
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))
            ) : (
              <div className="no-jobs-message">
                <p>No job openings match your current filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* Candidates Section */}
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
                    <div className="candidate-avatar-placeholder">
                      <User size={24} />
                    </div>
                  )}
                  <div>
                    <h3 className="candidate-name">{candidate.name}</h3>
                    <p className="candidate-position">{candidate.position || "Candidate"}</p>
                  </div>
                </div>
                <div className="candidate-stage-info">
                  <div className="candidate-stage screening">
                    {candidate.stage || "Screening"}
                  </div>
                  <div className="candidate-rating">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`star ${
                          i < Math.floor(candidate.rating || 3) ? "filled" : ""
                        } ${
                          i === Math.floor(candidate.rating || 3) &&
                          (candidate.rating || 3) % 1 !== 0
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
                    Next: {candidate.nextAction || "Interview"}
                  </div>
                  <div className="next-action-date">
                    <Calendar size={14} />
                    <span>{candidate.date || "May 5, 2025"}</span>
                  </div>
                </div>
              </div>
            ))}
            <button className="view-all-btn">View All Candidates</button>
          </div>
          <JobRequest />
        </div>
      </div>

      {/* Job Posting Modal */}
      {showJobModal && (
        <div className="modal-overlay">
          <div className="job-modal">
            <div className="modal-header">
              <h2>Post New Job</h2>
              <button className="close-modal" onClick={() => setShowJobModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitJob} className="job-form">
              <div className="form-group">
                <label htmlFor="title">Job Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newJob.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Frontend Developer"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="department">Department*</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={newJob.department}
                    onChange={handleInputChange}
                    placeholder="e.g. Engineering"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="location">Location*</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={newJob.location}
                    onChange={handleInputChange}
                    placeholder="e.g. New York, NY / Remote"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="salary">Salary Range*</label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    value={newJob.salary}
                    onChange={handleInputChange}
                    placeholder="e.g. $120,000 - $150,000"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="expires_at">Expiration Date*</label>
                  <input
                    type="date"
                    id="expires_at"
                    name="expires_at"
                    value={newJob.expires_at}
                    onChange={handleInputChange}
                    placeholder="**/**/****"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={newJob.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                  <label htmlFor="status">Type</label>
                  <select
                    id="status"
                    name="Type"
                    value={newJob.type}
                    onChange={handleInputChange}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Job Description*</label>
                <textarea
                  id="description"
                  name="description"
                  value={newJob.description}
                  onChange={handleInputChange}
                  placeholder="Describe the position, responsibilities and benefits..."
                  rows={4}
                  required
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowJobModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}