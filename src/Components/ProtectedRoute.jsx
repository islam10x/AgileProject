import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import Spinner from "./Spinner";
import { fetchCurrentUser } from "../services/authProvider";

export default function ProtectedRoute({ children }) {
  const { data: user, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: fetchCurrentUser,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (isPending) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;

  return <div> {children}</div>; // Let children render (AppLayOut wraps at a higher level)
}
