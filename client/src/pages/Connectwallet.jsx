import { Box, Button, Center } from "@chakra-ui/react"
import { useEffect } from "react"
import useGlobalContext from "../hooks/useGlobalContext"
import { useNavigate } from "react-router-dom"
const Connectwallet = () => {
    const navigate=useNavigate()
    const { connectWallet ,checkIfWalletIsConnected} = useGlobalContext()
    
    return (
        <Center minH="100vh" minW="100vw">
            <Button
                onClick={connectWallet}
                size="lg"
                display={'inline-flex'}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'green.400'}
                href={'#'}
                _hover={{
                    bg: 'green.300',
                }}>
                Connect wallet
            </Button>
        </Center>
    )
}

export default Connectwallet
