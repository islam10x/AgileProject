import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "./JobRequest.css";

const supabase = createClient(
  "https://khqyjobamsjvowjhqqbz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtocXlqb2JhbXNqdm93amhxcWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2NTcxMjUsImV4cCI6MjA1NjIzMzEyNX0.kEokOSTD_libgsMaHqRX8DCx9Lha7PH31iH2JzVFYnM"
);

const JobRequest = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("offerRequests")
        .select("*, Users(name), offers(title)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOffers(data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOfferStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from("offerRequests")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      fetchOffers();
    } catch (error) {
      console.error(`Error updating offer status to ${newStatus}:`, error);
    }
  };

  return (
    <div className="job-requests-container">
      <h1 className="title">Job Requests</h1>

      {loading ? (
        <p className="loading-text">Loading offers...</p>
      ) : offers.length === 0 ? (
        <p className="no-offers">No job requests yet.</p>
      ) : (
        offers.map((offer) => (
          <div key={offer.id} className="offer-card">
            <h2 className="offer-title">
              {offer.offers?.title || "Unknown Offer"}
            </h2>
            <p className="employee-name">
              Requested by: {offer.Users?.name || "Unknown User"}
            </p>
            <div className="button-group">
              <button
                className="accept-btn"
                onClick={() => updateOfferStatus(offer.id, "accepted")}
                disabled={offer.status === "accepted"}
              >
                Accept
              </button>
              <button
                className="reject-btn"
                onClick={() => updateOfferStatus(offer.id, "rejected")}
                disabled={offer.status === "rejected"}
              >
                Reject
              </button>
            </div>
            <p className={`status-text ${offer.status}`}>
              Status: {offer.status || "pending"}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default JobRequest;
