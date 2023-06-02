import { Navigate, Outlet } from "react-router-dom";
import useGlobalContext from "../hooks/useGlobalContext";
import { useState, useEffect } from "react";

const PrivateRoutes = () => {
    const { currentAccount, daoContract } = useGlobalContext();
  
    return currentAccount ? <Navigate to="/" /> : <Outlet />;
  };
  
export default PrivateRoutes;