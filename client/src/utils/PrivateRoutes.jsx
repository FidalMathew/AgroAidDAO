import { Navigate,Outlet } from "react-router-dom";
import useGlobalContext from "../hooks/useGlobalContext";
import { useState, useEffect } from "react";

const PrivateRoutes = () => {
  const { currentAccount, daoContract } = useGlobalContext();
  const [isMember, setMember] = useState(false);

    return currentAccount?<Outlet/>:<Navigate to="/connectwallet" />;

//   return isMember ? <Navigate to="/dao" /> : <Navigate to="/" />;
};

export default PrivateRoutes;
