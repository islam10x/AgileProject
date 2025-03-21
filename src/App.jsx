import Signup from "./Signup";
import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayOut from "./Pages/AppLayOut";
import Login from "./Login";
import Dashboard from "./Pages/Dashboard";
import PageNotFound from "./Pages/PageNotFound";
import ProtectedRoute from "./Components/ProtectedRoute";
import HomePage from "./Pages/HomePage";

function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <AppLayOut />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="home" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
