import { createContext, useState, useEffect } from "react"
import TokenABI from "../utils/Token.json"
import AgroDAOabi from "../utils/AgroDAO.json"
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

export const DAOContext = createContext();

const DAOContextprovider = ({ children }) => {

    const [chainId, setChainId] = useState("")
    const [currentAccount, setCurrentAccount] = useState("")
    const [errorPage, setErrorPage] = useState(false)
    const contractAddress = "0x15Bd311B642aa9Aa3fe3aA8F9bB68E1Ef226Ced2"
    const [daoContract, setdaoContract] = useState("");
    const [ethBalance, setEthBalance] = useState(0);
    const { ethereum } = window;
    const navigate = useNavigate()
    const toast = useToast()



    const getContract = async () => {

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const AgridaoContract = new ethers.Contract(contractAddress, AgroDAOabi, signer);


        AgridaoContract.getDAOBalance().then((res) => {
            console.log("res ", Number(res));
        }).catch(err => console.log(err))
        setdaoContract(AgridaoContract)
        console.log("AgridaoContract ", AgridaoContract)
    }

    useEffect(() => {
        async function fetchEthBalance() {
            if (window.ethereum && currentAccount) {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const balance = await provider.getBalance(currentAccount);
                    const formattedBalance = ethers.utils.formatEther(balance);
                    setEthBalance(formattedBalance);
                } catch (error) {
                    console.error('Error fetching ETH balance:', error);
                }
            }
        }

        fetchEthBalance();
    }, [currentAccount]);

    console.log("ethBalance ", ethBalance || "Fetching balance...");


    useEffect(() => {
        if (ethereum) {
            getContract();
        }
    }, [ethereum, AgroDAOabi])


    useEffect(() => {

        if (ethereum) {
            ethereum.on("accountsChanged", (accounts) => {
                setCurrentAccount(accounts[0]);
            })
        }
        else
            console.log("No metamask!");
        // console.log("DAsad ", currentAccount);
        return () => {
            // ethereum.removeListener('accountsChanged');

        }
    }, [ethereum])

    useEffect(() => {
        const checkIfWalletIsConnected = async () => {

            try {

                if (!ethereum) {
                    console.log("Metamask not found")
                    return;
                }
                else
                    console.log("we have ethereum object");

                const accounts = await ethereum.request({ method: "eth_accounts" });  //check if there are accounts connected to the site

                if (accounts.length !== 0) {
                    const account = accounts[0];
                    console.log("Found an authorized account:", account);
                    setCurrentAccount(account)
                }
                else {
                    setCurrentAccount("")
                    console.log("No authorized accounts found!");
                    navigate('/connectwallet')
                }


                const curr_chainId = await ethereum.request({ method: 'eth_chainId' });
                setChainId(curr_chainId)

                ethereum.on('chainChanged', handleChainChanged);


                // Reload the page when they change networks
                function handleChainChanged(_chainId) {
                    window.location.reload();
                }

            } catch (error) {
                console.log(error);
            }
        }

        checkIfWalletIsConnected();
    }, [currentAccount, AgroDAOabi, ethereum])


    const connectWallet = () => {
        if (window.ethereum) {
            window.ethereum
                .request({ method: 'eth_requestAccounts' })
                .then((accounts) => {
                    const selectedAccount = accounts[0];
                    setCurrentAccount(selectedAccount);
                    navigate("/")
                    toast({
                        title: "Account connected.",
                        description: "You can now use the app.",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    })
                })
                .catch((error) => {
                    console.error('Error connecting wallet:', error);
                    toast({
                        title: "Error connecting wallet.",
                        description: "Please try again.",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    })
                });
        } else {
            console.error('No wallet provider found.');
        }
    };


    const switchNetwork = async () => {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x13881' }], // Check networks.js for hexadecimal network ids
            });

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {

        if (chainId !== "0x13881" || !currentAccount) {
            switchNetwork();
            setErrorPage(true)
        }
        else {
            setErrorPage(false)
        }

    }, [chainId, currentAccount])

    const disconnectWallet = () => {
        // setCurrentAccount("");
    };

    const [joinLoading, setJoinLoading] = useState(false);

    const join = async (lat, long, name) => {
        setJoinLoading(true);
        try {
            const transaction = await daoContract.joinDAO(lat, long, name, {
                value: ethers.utils.parseEther('0.01')
            });
            await transaction.wait();
            console.log(transaction, 'transaction')
            toast({
                title: "Joined DAO.",
                description: "You can now use the app.",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            navigate("/dao");
        } catch (error) {
            console.log(error);
            toast({
                title: "Error joining DAO.",
                description: "Already joined.",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } finally {
            setJoinLoading(false);
        }
    };


    return (
        <DAOContext.Provider value={{ ethBalance, connectWallet, currentAccount, switchNetwork, disconnectWallet, daoContract, join, joinLoading }}>
            {children}
        </DAOContext.Provider>
    )
}

export default DAOContextprovider