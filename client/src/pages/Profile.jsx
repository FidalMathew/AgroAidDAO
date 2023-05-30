import { Avatar, Box, Flex, Grid, Heading, Stack, Stat, StatLabel, StatNumber, Text, VStack, useColorModeValue, chakra, HStack, Divider } from '@chakra-ui/react'
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

function StatsCard(props) {
    const { title, stat } = props;
    return (
        <Stat
            px={{ base: 4, md: 8 }}
            py={'5'}
            // shadow={'xl'}
            border={'1px solid'}
            borderColor={useColorModeValue('gray.800', 'gray.500')}
            rounded={'lg'}>
            <StatLabel fontWeight={'medium'} isTruncated>
                {title}
            </StatLabel>
            <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                {stat}
            </StatNumber>
        </Stat>
    );
}

const Profile = () => {
    const { id } = useParams()
    return (
        <>
            <Navbar />
            <Heading size="xl" fontWeight="semibold" textAlign={"center"}>Profile</Heading>
            <Box minH="100vh" w="100vw" p="16">
                <Flex justifyContent="center" flexDir={{ base: "column", lg: "row" }}>
                    <Stack h="70vh" mb="5" w={{ base: "100%", lg: "30vw" }} border="1px solid" borderColor={useColorModeValue('gray.800', 'gray.500')} rounded="xl">
                        <VStack spacing="6" justifyContent={"center"} alignItems={"center"} h="60%" w="100%" rounded="xl" mb="2">
                            <Avatar size="2xl" name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
                            <VStack spacing="0">
                                <Text fontSize="2xl" fontWeight="normal">Segun Adebayo</Text>
                                <Text fontSize="lg" fontWeight="normal">{id.slice(0, 5) + '...' + id.slice(-4)}</Text>
                            </VStack>
                        <VStack direction='column' h='100px' w="100%" p={4} spacing={"4"}>
                            <Text>Reputation: <chakra.span as="b">100</chakra.span> </Text>
                            <Divider orientation='horizontal' />
                            <Text>Location: </Text>
                            <Divider orientation='horizontal' />
                            <Text>Chakra UI</Text>
                            <Divider orientation='horizontal' />
                            <Text>Chakra UI</Text>
                            <Divider orientation='horizontal' />
                        </VStack>
                        </VStack>
                        {/* <Box border="1px solid" borderColor={useColorModeValue('gray.800', 'gray.500')} rounded="lg" w='90%' h='10vh'>
                                <Text ml="3" mt="2" fontSize="md" fontWeight={"semibold"}>Reputation</Text>
                            </Box> */}
                    </Stack>
                    <Grid h="30%" w={{ base: "100%", lg: "60%" }} templateRows="repeat(1, 1fr)" templateColumns={"repeat(1, 1fr)"} gap={4} ml={{ base: "0", lg: "5" }}>
                        <Stack direction={{base: "column", md: "row"}}>
                            <StatsCard title={'Amount Contributed'} stat={'10 ETH'} />
                            <StatsCard title={'Amount Contributed'} stat={'10 ETH'} />
                            <StatsCard title={'Amount Contributed'} stat={'10 ETH'} />
                        </Stack>
                        <Box border="1px solid" borderColor={useColorModeValue('gray.800', 'gray.500')} rounded="lg" w='100%' h='35vh'>

                        </Box>
                    </Grid>
                </Flex>
            </Box>
        </>
    )
}

export default Profile
