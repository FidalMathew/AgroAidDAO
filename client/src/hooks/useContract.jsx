import { ethers } from "ethers"
import AgroDAOabi from "../utils/AgroDAO.json"
const useContract = async () => {
    const address = "0x2B4D4F41Ca3854963D24B8a835FB36B710d889B6"
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = provider.getSigner();
    const AgridaoContract = new ethers.Contract(address, AgroDAOabi, signer);
    const contract = await ethers.getContractAt("AgroDAO", address);


    return contract
}

export default useContract
