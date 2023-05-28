import { useContext } from "react"
import { DAOContext } from "../context/DAOContext"

const useGlobalContext = () => {
    return useContext(DAOContext)
}

export default useGlobalContext
