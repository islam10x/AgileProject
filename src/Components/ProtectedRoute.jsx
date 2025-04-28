import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import Spinner from "./Spinner";
import { fetchCurrentUser } from "../services/authProvider";
import { useContext } from "react";
import { Homecontext } from "../Context/LoginContext";

export default function ProtectedRoute({ children }) {
  const { homepass } = useContext(Homecontext);
  const { data: user, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: fetchCurrentUser,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  if (isPending) return <Spinner />;
  // if (!homepass) return <Navigate to="/home" replace />;
  if (!user) return <Navigate to="/login" replace />;

  return <div> {children}</div>; // Let children render (AppLayOut wraps at a higher level)
}
