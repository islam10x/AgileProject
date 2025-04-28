import { toast } from "react-toastify";
import supabase from "./supabase";

/**
 * Get the status of a specific leave request for a user
 * @param {Object} params - The request parameters
 * @param {string} params.userId - The user ID
 * @param {string} params.startDate - The start date of the leave request
 * @returns {Promise<string|null>} - The status of the leave request or null if not found
 */
export async function getLeaveRequestStatus({ userId, startDate }) {
  try {
    const { data: leaveRequest, error } = await supabase
      .from("leaveRequests")
      .select("*")
      .eq("userId", userId)
      .eq("start", startDate)
      .single();
      
    if (error) {
      console.error("Error fetching leave request status:", error);
      return null;
    }
    
    return leaveRequest ? leaveRequest.status : null;
  } catch (error) {
    console.error("Exception in getLeaveRequestStatus:", error);
    toast.error("Failed to check leave request status");
    return null;
  }
}

/**
 * Submit a new leave application request
 * @param {Object} params - The request parameters
 * @param {string} params.userId - The user ID
 * @param {string} params.startDate - The start date of the leave request
 * @param {string} params.endDate - The end date of the leave request
 * @param {string} params.status - The initial status (usually "pending")
 * @param {string} [params.type="annual"] - The type of leave (annual, sick, personal)
 * @returns {Promise<void>}
 */
export async function requestLeaveApplication({ userId, startDate, endDate, status, type = "annual" }) {
  try {
    const created_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from("leaveRequests")
      .insert([{ 
        userId, 
        start: startDate, 
        end: endDate, 
        status: "pending", // Always set initial status to pending regardless of input
        type,
        created_at
      }]);
      
    if (error) {
      console.error("Error submitting leave application:", error);
      toast.error("Failed to submit leave application");
      throw new Error(error.message);
    }
    
    toast.success("Leave application submitted successfully");
    return data;
  } catch (error) {
    console.error("Exception in requestLeaveApplication:", error);
    toast.error("Failed to submit leave application");
    throw error;
  }
}

/**
 * Get all leave requests for a specific user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - Array of leave requests
 */
export async function getRequests(userId) {
  try {
    const { data, error } = await supabase
      .from("leaveRequests")
      .select("*")
      .eq("userId", userId)
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching user requests:", error);
      toast.error("Failed to fetch leave requests");
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error) {
    console.error("Exception in getRequests:", error);
    toast.error("Failed to fetch leave requests");
    throw error;
  }
}

/**
 * Get all leave requests across all users (for admin/manager view)
 * @returns {Promise<Array>} - Array of all leave requests
 */
export async function getAllRequests() {
  try {
    const { data, error } = await supabase
      .from("leaveRequests")
      .select(`
        *,
        Users(name, last_name)
      `)
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching all requests:", error);
      toast.error("Failed to fetch all leave requests");
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error) {
    console.error("Exception in getAllRequests:", error);
    toast.error("Failed to fetch all leave requests");
    throw error;
  }
}

/**
 * Update the status of a leave request (for manager approval/rejection)
 * @param {string} requestId - The ID of the leave request
 * @param {string} newStatus - The new status (approved/rejected)
 * @returns {Promise<Object>} - The updated leave request
 */
export async function updateLeaveRequestStatus(requestId, newStatus) {
  try {
    const updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from("leaveRequests")
      .update({ 
        status: newStatus,
        updated_at
      })
      .eq("id", requestId)
      .select();
      
    if (error) {
      console.error("Error updating leave request status:", error);
      toast.error("Failed to update leave request status");
      throw new Error(error.message);
    }
    
    toast.success(`Leave request ${newStatus}`);
    return data;
  } catch (error) {
    console.error("Exception in updateLeaveRequestStatus:", error);
    toast.error("Failed to update leave request status");
    throw error;
  }
}

/**
 * Get leave balance for a specific user
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - Object containing leave balances
 */
export async function getUserLeaveBalance(userId) {
  try {
    // First get the user's total leave allocation
    const { data: userData, error: userError } = await supabase
      .from("Users")
      .select("annual_leave, sick_leave, personal_leave")
      .eq("id", userId)
      .single();
      
    if (userError) {
      console.error("Error fetching user leave allocation:", userError);
      throw new Error(userError.message);
    }
    
    // Default values if not set in database
    const totalAllocations = {
      annual: userData?.annual_leave || 25,
      sick: userData?.sick_leave || 10,
      personal: userData?.personal_leave || 5
    };
    
    // Then calculate used leave by counting approved leave days
    const { data: leaveRequests, error: leaveError } = await supabase
      .from("leaveRequests")
      .select("*")
      .eq("userId", userId)
      .eq("status", "approved");
      
    if (leaveError) {
      console.error("Error fetching approved leave requests:", leaveError);
      throw new Error(leaveError.message);
    }
    
    // Calculate used days by type
    const usedLeave = {
      annual: 0,
      sick: 0,
      personal: 0
    };
    
    leaveRequests?.forEach(request => {
      const startDate = new Date(request.start);
      const endDate = new Date(request.end);
      const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      
      // Default to annual if type not specified
      const leaveType = request.type || "annual";
      
      // Map the database leave type to our internal keys
      const typeKey = leaveType.toLowerCase().includes("annual") ? "annual" : 
                      leaveType.toLowerCase().includes("sick") ? "sick" : 
                      "personal";
      
      usedLeave[typeKey] += daysDiff;
    });
    
    return {
      annual: { used: usedLeave.annual, total: totalAllocations.annual },
      sick: { used: usedLeave.sick, total: totalAllocations.sick },
      personal: { used: usedLeave.personal, total: totalAllocations.personal }
    };
  } catch (error) {
    console.error("Exception in getUserLeaveBalance:", error);
    toast.error("Failed to fetch leave balances");
    throw error;
  }
}

