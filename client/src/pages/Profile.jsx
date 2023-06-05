import { Avatar, Box, Flex, Grid, Heading, Stack, Stat, StatLabel, StatNumber, Text, VStack, useColorModeValue, chakra, HStack, Divider, TableContainer, Table, TableCaption, Thead, Tr, Td, Tfoot, Th, Tbody, Button, Badge } from '@chakra-ui/react'
import { Link, useLocation, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useEffect } from 'react';
import useGlobalContext from '../hooks/useGlobalContext';
import { useState } from 'react';
import useCurrentLocation from '../hooks/useCurrentLocation';

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
    const { daoContract, ethBalance, currentAccount } = useGlobalContext()
    const location = useLocation()
    const [proposal, setProposal] = useState({})

    const [agrotokenBalance, setAgrotokenBalance] = useState(0)
    const [user, setUser] = useState({
        name: "",
        address: "",
        loan: 0,
        lat: 0,
        long: 0,
        reputation: 0,
        time: ""
    })

    const { country } = useCurrentLocation()

    useEffect(() => {
        if (daoContract) {
            daoContract.getUserBalance(id).then(res => {
                setAgrotokenBalance(Number(res._hex))
                console.log(res)
            }).catch(err => console.log(err))

            daoContract.members(id).then(res => {
                setUser({
                    name: res.name,
                    address: res.farmerAddress,
                    loan: res.loan,
                    lat: res.latitude,
                    long: res.longitude,
                    reputation: Number(res.reputation._hex),
                    time: res.timestamp
                })
                console.log(res, 'profile')
            }).catch(err => console.log(err))
        }
    }, [daoContract])

    const convertDateAndTime = (timestamp) => {
        const decimalTimestamp = parseInt(timestamp.substring(2), 16);
        const date = new Date(decimalTimestamp * 1000);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);

        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        return formattedDateTime;
    };

    useEffect(() => {
        const getAllProposals = async () => {
            try {
                if (daoContract) {
                    const proposalList = [];
                    const res = await daoContract.getAllProposals()

                    for (let i = 0; i < res.length; i++) {
                        const proposalId = res[i];
                        const proposalValue = {
                            proposalId: i,
                            description: proposalId[0],
                            owner: proposalId[1],
                            amount: Number(proposalId[2]),
                            isExecuted: proposalId[3],
                            startTime: convertDateAndTime(proposalId[4]._hex),
                            endTime: convertDateAndTime(proposalId[5]._hex),
                            votesFor: Number(proposalId[6]),
                            votesAgainst: Number(proposalId[7]),
                            voters: proposalId[8],
                        }
                        proposalList.push(proposalValue);
                    }

                    const proposalOfCurrentUser = proposalList.filter((proposal) => {
                        return proposal.owner.toLowerCase() === currentAccount;
                    })
                    console.log(proposalOfCurrentUser, 'proposalOfCurrentUser')

                    setProposal(proposalOfCurrentUser)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getAllProposals();
    }, [daoContract, location, id, currentAccount])

    return (
        <>
            <Navbar />
            <Heading size="xl" fontWeight="semibold" textAlign={"center"}>Profile</Heading>
            <Box minH="80vh" w="100vw" p="16">
                <Flex justifyContent="center" flexDir={{ base: "column", lg: "row" }}>
                    <Stack h="70vh" mb="5" w={{ base: "100%", lg: "30vw" }} border="1px solid" borderColor={useColorModeValue('gray.800', 'gray.500')} rounded="xl">
                        <VStack spacing="6" justifyContent={"center"} alignItems={"center"} h="60%" w="100%" rounded="xl" mb="2">
                            <Avatar size="2xl" name={user.name} />
                            <VStack spacing="0">
                                <Text fontSize="2xl" fontWeight="normal">{user.name}</Text>
                                <Text fontSize="lg" fontWeight="normal">{user.address.toString().slice(0, 5) + "..." + user.address.toString().slice(-3)}</Text>
                            </VStack>
                            <VStack direction='column' h='100px' w="100%" p={4} spacing={"4"}>
                                <Text>Reputation: <chakra.span as="b">{user.reputation}</chakra.span> </Text>
                                <Divider orientation='horizontal' />
                                <Text>Voting Power: <chakra.span as="b">{"0"}</chakra.span> </Text>
                                <Divider orientation='horizontal' />
                                <Text>Voting Power: <chakra.span as="b">{"0"}</chakra.span> </Text>
                                <Divider orientation='horizontal' />
                                <Text>Voting Power: <chakra.span as="b">{"0"}</chakra.span> </Text>
                                <Divider orientation='horizontal' />

                            </VStack>
                        </VStack>
                        {/* <Box border="1px solid" borderColor={useColorModeValue('gray.800', 'gray.500')} rounded="lg" w='90%' h='10vh'>
                                <Text ml="3" mt="2" fontSize="md" fontWeight={"semibold"}>Reputation</Text>
                            </Box> */}
                    </Stack>
                    <Grid h="30%" w={{ base: "100%", lg: "60%" }} templateRows="repeat(1, 1fr)" templateColumns={"repeat(1, 1fr)"} gap={4} ml={{ base: "0", lg: "5" }}>
                        <Stack direction={{ base: "column", md: "row" }}>
                            <StatsCard title={'Your DAO Balance'} stat={agrotokenBalance + " AGRO"} />
                            <StatsCard title={'Your ETH Balance'} stat={ethBalance} />
                            <StatsCard title={'Country'} stat={country} />
                        </Stack>
                        <Box border="1px solid" borderColor={useColorModeValue('gray.800', 'gray.500')} rounded="lg" w='100%' h='52vh' className='members-list' overflowY={"scroll"}>
                            <Heading size="md" p="6" pb="1" textAlign={"center"}>Your Proposals</Heading>
                            <TableContainer w="100%" minH={{ base: "50vh", lg: "40vh" }}>
                                <Table variant='simple' size={"lg"}>
                                    <Thead>
                                        <Tr>
                                            <Th>Proposal Description</Th>
                                            <Th textAlign={"left"}>Amount</Th>
                                            <Th textAlign={"center"}>Status</Th>
                                            <Th textAlign={"center"}>Pay</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {/* proposal is undefined initially and then array of objects */}
                                        {proposal && Array.isArray(proposal) && proposal.map((item, index) => {
                                            return (
                                                <Tr key={index}>
                                                    <Link to={`/proposal/${item.proposalId}`}><Td>{item.description.length > 20
                                                        ? item.description.slice(0, 20) + "..."
                                                        : item.description
                                                    }</Td></Link>
                                                    <Td textAlign="left">{item.amount}</Td>
                                                    <Td textAlign="center">
                                                        {item.isExecuted ? (
                                                            <Badge colorScheme="green">Executed</Badge>
                                                        ) : (
                                                            <Badge colorScheme="red">Not Executed</Badge>
                                                        )}
                                                    </Td>
                                                    <Td textAlign="center">
                                                        <Button colorScheme="teal" size="sm">Pay</Button>
                                                    </Td>
                                                </Tr>
                                            );
                                        })}

                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Grid>
                </Flex>
            </Box>
        </>
    )
}

export default Profile
