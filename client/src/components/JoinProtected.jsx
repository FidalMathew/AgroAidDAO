import { useEffect } from "react";
import { Outlet, Navigate, useLocation, useNavigate } from "react-router-dom";
import useGlobalContext from "../hooks/useGlobalContext";
import { useToast } from "@chakra-ui/react";

const JoinProtected = () => {
    const { daoContract, currentAccount } = useGlobalContext();
    const navigate = useNavigate();
    const location = useLocation();

    const checkMembership = async () => {
        try {
            const res = await daoContract.getMemberAddresses();
            console.log(currentAccount, 'currentAccount')
            if (res && currentAccount) {
                const lowercasedRes = res.map((address) => address.toLowerCase());
                const hasJoined = lowercasedRes.includes(currentAccount.toLowerCase());
                console.log(hasJoined, 'hasJoined');
                if (!hasJoined && window.location.pathname !== "/") {
                    navigate("/");
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (daoContract && window.ethereum) {
            checkMembership();
        }
    }, [daoContract, currentAccount, location, navigate]);

    return <Outlet />; // Render null as the component doesn't have any visual output
};

export default JoinProtected;
