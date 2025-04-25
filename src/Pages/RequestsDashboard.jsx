// RequestsDashboard.jsx
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  User,
  Briefcase,
  Calendar,
} from "lucide-react";
import "./RequestsDashboard.css";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";
import { getRequests } from "../services/offerRequestProvider";
import { getOffer } from "../services/infoProvider";

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

function RequestCard({ request, onRefresh }) {
  console.log(request);
  const { data: offerDetails, isPending } = useQuery({
    queryKey: ["offer", request.Offer_id],
    queryFn: async () => await getOffer(request.OfferId),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const statusIcons = {
    pending: <Clock className="w-5 h-5 text-yellow-500" />,
    accepted: <CheckCircle className="w-5 h-5 text-green-500" />,
    rejected: <XCircle className="w-5 h-5 text-red-500" />,
  };

  const statusText = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
  };

  // Safe date parsing
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch (e) {
      console.error("Invalid date format:", dateString);
      return "Invalid date";
    }
  };

  return (
    <div className="request-card">
      <div className="request-header">
        <div>
          <h3 className="request-title">
            {offerDetails.title || "Untitled Offer"}
          </h3>
          <div className="request-company">
            <Briefcase className="w-4 h-4" />
            <span>{offerDetails.company_name || "Unknown Company"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`status-badge ${request.status || "pending"}`}>
            {statusIcons[request.status] || statusIcons.pending}
            {statusText[request.status] || "Pending"}
          </span>
          <button
            onClick={() => onRefresh(request.id)}
            className="refresh-button"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="request-details">
        <div className="request-detail">
          <User className="w-4 h-4" />
          <span>Applied at: {formatDate(offerDetails.created_at)}</span>
        </div>
        {/* <div className="request-detail">
          <Calendar className="w-4 h-4" />
          <span>Last updated: {formatDate(request.updated_at)}</span>
        </div> */}
      </div>
      {request.feedback && (
        <div className="request-feedback">
          <p className="feedback-label">Feedback:</p>
          <p>{request.feedback}</p>
        </div>
      )}
    </div>
  );
}

export default function RequestsDashboard({ user }) {
  const queryClient = useQueryClient();
  const {
    data: requests = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["requests", user?.id],
    queryFn: () => (user?.id ? getRequests(user.id) : Promise.resolve([])),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  // Calculate stats with null checks
  const totalRequests = requests?.length || 0;
  const pendingRequests =
    requests?.filter((r) => r?.status === "pending")?.length || 0;
  const acceptedRequests =
    requests?.filter((r) => r?.status === "accepted")?.length || 0;
  const rejectedRequests =
    requests?.filter((r) => r?.status === "rejected")?.length || 0;

  const handleRefresh = async (requestId) => {
    try {
      toast.success("Request status refreshed");
      await queryClient.invalidateQueries(["requests", user?.id]);
    } catch (error) {
      toast.error("Failed to refresh request");
      console.error(error);
    }
  };

  if (isPending) {
    return (
      <div className="requests-dashboard">
        <div className="loading-state">
          <p>Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="requests-dashboard">
        <div className="error-state">
          <p>Error loading applications: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="requests-dashboard">
      <div className="stats-grid">
        <StatCard
          icon={FileText}
          label="Total Requests"
          value={totalRequests}
          trend={
            totalRequests > 0
              ? `${Math.round((totalRequests / 5) * 100)}% of applications`
              : ""
          }
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={pendingRequests}
          trend={
            pendingRequests > 0
              ? `${Math.round((pendingRequests / totalRequests) * 100)}%`
              : "All processed"
          }
        />
        <StatCard
          icon={CheckCircle}
          label="Accepted"
          value={acceptedRequests}
          trend={
            acceptedRequests > 0
              ? `${Math.round((acceptedRequests / totalRequests) * 100)}%`
              : "No acceptances yet"
          }
        />
        <StatCard
          icon={XCircle}
          label="Rejected"
          value={rejectedRequests}
          trend={
            rejectedRequests > 0
              ? `${Math.round((rejectedRequests / totalRequests) * 100)}%`
              : "No rejections"
          }
        />
      </div>

      <div className="dashboard-card">
        <div className="card-header">
          <h2>Your Applications</h2>
          <FileText />
        </div>
        <div className="requests-list">
          {totalRequests > 0 ? (
            requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onRefresh={handleRefresh}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>No applications found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
