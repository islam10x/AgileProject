import { toast } from "react-toastify";
import supabase from "./supabase";

async function getLeaveRequestStatus({ userId,startDate }) {
  const { data: leaveRequest, error } = await supabase
    .from("leaveRequests")
    .select("*")
    .eq("userId", userId)
    .eq("start", startDate)
    .single();
  //console.log("leaveRequest", leaveRequest);
    if (error) {
    console.log("request not available", error);
  }
  return leaveRequest.status;
}

async function requestLeaveApplication({ userId, startDate, endDate ,status}) {
  const { error: leaveApplicationError } = await supabase
    .from("leaveRequests")
    .insert([{ start: startDate, end: endDate, status: status, userId: userId, status: "pending" }]);

  if (leaveApplicationError) throw new Error(leaveApplicationError.message);
  else {
    toast.success("Leave Application sent successfully");
  }
}

export async function getRequests(userId) {
  const { data: requests, error: requetsError } = await supabase
    .from("leaveRequests")
    .select("*")
    .eq("userId", userId);
  if (requetsError) throw new Error(requetsError.message);
  return requests;
}

export async function getAllRequests() {
  const { data: requests, error: requetsError } = await supabase
    .from("leaveRequests")
    .select("*");
  if (requetsError) throw new Error(requetsError.message);
  return requests;
}

export { getLeaveRequestStatus, requestLeaveApplication };
