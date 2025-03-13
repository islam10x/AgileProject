import { useQuery } from "@tanstack/react-query";
import { Navigate, Outlet } from "react-router-dom";
import Spinner from "./Spinner";
import { fetchCurrentUser } from "../services/authProvider";

export default function ProtectedRoute() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchCurrentUser,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (isLoading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />; // Let children render (AppLayOut wraps at a higher level)
}
