import { createContext, useState, useEffect } from "react"
import TokenABI from "../utils/Token.json"
import AgroDAOabi from "../utils/AgroDAO.json"
import { ethers } from "ethers";

export const DAOContext = createContext();

const DAOContextprovider = ({ children }) => {

    const [chainId, setChainId] = useState("")

    const [currentAccount, setCurrentAccount] = useState("")
    const [errorPage, setErrorPage] = useState(false)
    const contractAddress = "0x2B4D4F41Ca3854963D24B8a835FB36B710d889B6"
    const [votingSystemContract, setVotingSystemContract] = useState("");

    const { ethereum } = window;
    
    console.log(AgroDAOabi)
    useEffect(() => {

        const getContract = () => {

            const provider = new ethers.BrowserProvider(ethereum);
            
            const signer = provider.getSigner();
            
            const votSysContract = new ethers.Contract(contractAddress, AgroDAOabi, signer);
            console.log(votSysContract);
            // // console.log("Voting System Contract: ", votSysContract  )
            // setVotingSystemContract(votSysContract);
        }

        if (ethereum){
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
                    // if (currentAccount !== "")
                    setCurrentAccount(account)

                    // votingSystem();

                }
                else {
                    setCurrentAccount("")
                    console.log("No authorized accounts found!");
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
    }, [currentAccount, AgroDAOabi , ethereum])


    const connectWallet = () => {
        if (window.ethereum) {
            window.ethereum
                .request({ method: 'eth_requestAccounts' })
                .then((accounts) => {
                    const selectedAccount = accounts[0];
                    setCurrentAccount(selectedAccount);
                })
                .catch((error) => {
                    console.error('Error connecting wallet:', error);
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





    return (
        <DAOContext.Provider value={{ connectWallet, currentAccount, switchNetwork, disconnectWallet }}>
            {children}
        </DAOContext.Provider>
    )
}

export default DAOContextprovider