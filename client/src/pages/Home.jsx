import { Box, Flex, HStack, Heading, Text } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import CardComponent from "../components/Cardcomponent"

const Home = () => {
    return (
        <>
            <Navbar />
            <Box m="8">
                <Heading textAlign={"center"}>Existing DAOs</Heading>
                <Flex gap={4} height={"full"} justifyContent={"center"} m="5" flexWrap={"wrap"}>
                    {/* <Text fontSize={"xl"}>No DAOs yet</Text> */}
                    {[1, 2, 3].map(() => {
                        return (
                            <CardComponent />
                        )
                    })}
                </Flex>
            </Box>
        </>
    )
}

export default Home
