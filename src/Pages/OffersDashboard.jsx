// OffersDashboard.jsx
import { useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  Briefcase,
  Building,
  AlertCircle,
} from "lucide-react";
import "./OffersDashboard.css";
import { format, parseISO, isAfter } from "date-fns";
import {
  checkOfferRequestAvailability,
  requestOfferApplication,
} from "../services/offerRequestProvider";
import { toast } from "react-toastify";

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

function OfferCard({ offer, user }) {
  const isExpired = isAfter(new Date(), parseISO(offer.expires_at));
  const statusColors = {
    expired: "text-red-500",
    active: "text-green-500",
  };

  const statusIcons = {
    expired: <AlertCircle className="w-5 h-5" />,
    active: <CheckCircle className="w-5 h-5" />,
  };

  async function handleApply(userId, offerId) {
    try {
      const availability = await checkOfferRequestAvailability({
        userId,
        OfferId: offerId,
      });

      if (availability === "available") {
        const result = await requestOfferApplication({ userId, offerId });
        if (result) {
          toast.success("Application sent successfully");
        }
      } else {
        toast.warning("user already applied for this offer");
      }
    } catch (error) {
      toast.error("Failed to submit application");
      console.error(error);
    }
  }

  return (
    <div className="offer-card">
      <div className="offer-header">
        <div>
          <h3 className="offer-title">{offer.title}</h3>
          <div className="offer-company">
            <Building className="w-4 h-4" />
            <span>{offer.company_name}</span>
          </div>
        </div>
        <span
          className={`offer-status ${
            statusColors[isExpired ? "expired" : "active"]
          }`}
        >
          {statusIcons[isExpired ? "expired" : "active"]}
          {isExpired ? "Expired" : "Active"}
        </span>
      </div>
      <div className="offer-details">
        <div className="offer-detail">
          <MapPin className="w-4 h-4" />
          <span>{offer.location}</span>
        </div>
        <div className="offer-detail">
          <Briefcase className="w-4 h-4" />
          <span>{offer.type}</span>
        </div>
        <div className="offer-detail">
          <DollarSign className="w-4 h-4" />
          <span>
            {offer.salary} {offer.currency}
          </span>
        </div>
        <div className="offer-detail">
          <Calendar className="w-4 h-4" />
          <span>
            Expires: {format(parseISO(offer.expires_at), "MMM dd, yyyy")}
          </span>
        </div>
      </div>
      {offer.description && (
        <p className="offer-description">{offer.description}</p>
      )}
      <div className="offer-actions">
        <button
          onClick={() => handleApply(user.id, offer.id)}
          disabled={isExpired}
          className={`apply-button ${isExpired ? "disabled" : ""}`}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default function OffersDashboard({ user, offers }) {
  const queryClient = useQueryClient();
  // const offers = queryClient.getQueryData(["offers"]) || [];

  // Debug: Log all offers with expiration status
  console.log(
    "Offers expiration check:",
    offers.map((offer) => ({
      id: offer.id,
      title: offer.title,
      expires_at: offer.expires_at,
      isExpired: isAfter(new Date(), parseISO(offer.expires_at)),
      parsedDate: parseISO(offer.expires_at),
    }))
  );

  // Fixed expiration calculation
  const totalOffers = offers.length;
  const expiredOffers = offers.filter((offer) => {
    if (!offer.expires_at) return false;
    try {
      return isAfter(new Date(), parseISO(offer.expires_at));
    } catch (e) {
      console.error("Invalid date format:", offer.expires_at);
      return false;
    }
  }).length;
  const activeOffers = totalOffers - expiredOffers;
  const averageSalary =
    offers.length > 0
      ? Math.round(
          offers.reduce((sum, offer) => sum + offer.salary, 0) / offers.length
        )
      : 0;

  // Group by offer type
  const offerTypes = offers.reduce((acc, offer) => {
    acc[offer.type] = (acc[offer.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="offers-dashboard">
      <div className="stats-grid">
        <StatCard
          icon={FileText}
          label="Total Offers"
          value={totalOffers}
          trend={
            offers.length > 0
              ? `+${Math.round(offers.length / 5)}% vs last month`
              : ""
          }
        />
        <StatCard
          icon={CheckCircle}
          label="Active Offers"
          value={activeOffers}
        />
        <StatCard
          icon={DollarSign}
          label="Average Salary"
          value={`${averageSalary} USD`}
        />
        <StatCard
          icon={AlertCircle}
          label="Expired Offers"
          value={expiredOffers}
          trend={
            expiredOffers > 0
              ? `${Math.round((expiredOffers / totalOffers) * 100)}% of total`
              : "No expired offers"
          }
        />
      </div>

      <div className="dashboard-grid">
        {/* Recent Offers */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Recent Offers</h2>
            <FileText />
          </div>
          <div className="offers-list">
            {offers.slice(0, 5).map((offer) => (
              <OfferCard user={user} key={offer.id} offer={offer} />
            ))}
          </div>
        </div>

        {/* Offers by Type */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Offers by Type</h2>
            <Briefcase />
          </div>
          <div className="department-list">
            {Object.entries(offerTypes).map(([type, count]) => (
              <div key={type} className="department-item">
                <span>{type}</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(count / totalOffers) * 100}%`,
                      backgroundColor: getColorForType(type),
                    }}
                  ></div>
                </div>
                <span>
                  {count} ({Math.round((count / totalOffers) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Expiration Timeline */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Expiration Timeline</h2>
            <Calendar />
          </div>
          <div className="status-list">
            {[
              {
                label: "Expires in < 1 week",
                count: offers.filter((offer) => {
                  const diff =
                    parseISO(offer.expires_at).getTime() - new Date().getTime();
                  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
                }).length,
                color: "bg-red-500",
              },
              {
                label: "Expires in 1-4 weeks",
                count: offers.filter((offer) => {
                  const diff =
                    parseISO(offer.expires_at).getTime() - new Date().getTime();
                  return (
                    diff >= 7 * 24 * 60 * 60 * 1000 &&
                    diff < 28 * 24 * 60 * 60 * 1000
                  );
                }).length,
                color: "bg-yellow-500",
              },
              {
                label: "Expires in > 1 month",
                count: offers.filter((offer) => {
                  const diff =
                    parseISO(offer.expires_at).getTime() - new Date().getTime();
                  return diff >= 28 * 24 * 60 * 60 * 1000;
                }).length,
                color: "bg-green-500",
              },
            ].map((item, index) => (
              <div key={index} className="status-item">
                <div className="status-info">
                  <span>{item.label}</span>
                  <span>{item.count} offers</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${item.color}`}
                    style={{
                      width: `${
                        totalOffers > 0
                          ? Math.round((item.count / totalOffers) * 100)
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get colors for different offer types
function getColorForType(type) {
  const colors = {
    Internship: "#3b82f6",
    "Full-time": "#22c55e",
    "Part-time": "#8b5cf6",
    Contract: "#ec4899",
    Freelance: "#f59e0b",
  };
  return colors[type] || "#6b7280";
}
