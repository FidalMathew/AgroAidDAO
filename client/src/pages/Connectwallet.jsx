import { Box, Button, Center, HStack } from "@chakra-ui/react"
import useGlobalContext from "../hooks/useGlobalContext"
import { ConnectWallet, useAddress, useNetworkMismatch, useSwitchChain } from "@thirdweb-dev/react"
import { Link } from "react-router-dom"

const Connectwallet = () => {
    const address = useAddress()
    const isMismatched = useNetworkMismatch()
    const switchChain = useSwitchChain()

    return (
        <Center minH="100vh" minW="100vw">


            {address ?

                (isMismatched ?

                    <Button style={{ marginTop: '21px' }} leftIcon={<Image src={"/polygon.png"} width={5} height={5} alt="" />} colorScheme={"twitter"} onClick={() => switchChain(Mumbai.chainId)}>Switch to Mumbai</Button>

                    :
                    <Link to="/home"><Button rightIcon={<ArrowForwardIcon />} _hover={{ bg: 'black' }} style={{ marginTop: '21px' }} bg="blackAlpha.700" color={"white"}>Get Started</Button></Link>
                )

                :
                <HStack className="my-transition" style={{ marginTop: '21px' }}>
                    <ConnectWallet
                        theme={"light"}
                        btnTitle="Connect Wallet"
                    />
                </HStack>
            }
        </Center>
    )
}

export default Connectwallet
