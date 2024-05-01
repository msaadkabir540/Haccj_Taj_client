import { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Home from "@/pages/home";
import Login from "@/pages/account/login/login";
import Authentication from "@/pages/authentication";
import ResetPassword from "@/pages/account/reset-password";
import ForgotPassword from "@/pages/account/forget-password";
import { isAuthenticated } from "../utils/auth";
import SignUp from "@/pages/account/sign-up/sign-up";
import User from "@/pages/user";
import Temperature from "@/pages/temperature";
import Treacbility from "@/pages/treacbility";
import Products from "@/pages/products";
import CheckList from "@/pages/check-list";
import Equipment from "@/pages/equipment";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route path="/" element={<PrivateRoute element={Home} />} />
      <Route path="/user" element={<PrivateRoute element={User} />} />
      <Route path="/temperature" element={<PrivateRoute element={Temperature} />} />
      <Route path="/treacbility" element={<PrivateRoute element={Treacbility} />} />
      <Route path="/products" element={<PrivateRoute element={Products} />} />
      <Route path="/checkList" element={<PrivateRoute element={CheckList} />} />
      <Route path="/equipment" element={<PrivateRoute element={Equipment} />} />
      {/*  not private route */}
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/authentication" element={<Authentication />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/password-reset" element={<ResetPassword />} />
    </Routes>
  );
};

export default Routing;
