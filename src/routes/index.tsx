import { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Home from "@/pages/home";
import Login from "@/pages/account/login/login";
import Authentication from "@/pages/authentication";
import ResetPassword from "@/pages/account/reset-password";
import ForgotPassword from "@/pages/account/forget-password";
import { isAuthenticated } from "../utils/auth";
import SignUp from "@/pages/account/sign-up/sign-up";

interface PrivateRouteInterface {
  element: React.FC<any>;
  // any props that come into the component
}

const PrivateRoute = ({ element: Component }: PrivateRouteInterface) => {
  const authenticated = isAuthenticated();
  return authenticated ? <Component /> : <Navigate to="login" />;
};

const Routing = ({ setLoading }: { setLoading: any }) => {
  const navigator = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    if (!token) {
      navigator("/login");
    }
    setLoading(false);
  }, [navigator, setLoading]);

  return (
    <Routes>
      <Route path="/dashboard" element={<PrivateRoute element={Home} />} />
      {/*  not private route */}
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/authentication" element={<Authentication />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/password-reset/:id/:token" element={<ResetPassword />} />
    </Routes>
  );
};

export default Routing;
