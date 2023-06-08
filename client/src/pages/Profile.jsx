import { Avatar, Box, Flex, Grid, Heading, Stack, Stat, StatLabel, StatNumber, Text, VStack, useColorModeValue, chakra, HStack, Divider, TableContainer, Table, TableCaption, Thead, Tr, Td, Tfoot, Th, Tbody, Button, Badge, SimpleGrid, Icon, Link as ChakraLink, Toast, useToast } from '@chakra-ui/react'
import { Link, useLocation, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useEffect } from 'react';
import useGlobalContext from '../hooks/useGlobalContext';
import { useState } from 'react';
import useCurrentLocation from '../hooks/useCurrentLocation';
import { ethers } from 'ethers';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'

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
    const { daoContract, ethBalance, currentAccount,currency, setEthBalance ,isETHPrice, fetchAmount } = useGlobalContext()
    const location = useLocation()
    const [proposal, setProposal] = useState({})
    const [loanPaid, setLoanPaid] = useState(false)
    const [convertedBalance, setConvertedBalance] = useState(ethBalance);
    // const {currency} = useCurrentLocation()
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
    const [loanDueDate, setLoanDueDate] = useState(0)

    const toast = useToast()
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
    }, [daoContract, loanPaid])

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
                            proposalId: Number(proposalId[0]),
                            description: proposalId[1],
                            owner: proposalId[2],
                            amount: Number(proposalId[3]),
                            isExecuted: proposalId[4],
                            startTime: convertDateAndTime(proposalId[5]._hex),
                            endTime: convertDateAndTime(proposalId[6]._hex),
                            votesFor: Number(proposalId[7]),
                            votesAgainst: Number(proposalId[8]),
                            voters: proposalId[9],
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


    useEffect(() => {
        const getLoanTimer = async () => {
            try {
                if (daoContract) {
                    const loanDue = await daoContract.loanTimer(id);
                    // console.log("dloana", loanDue)
                    // convertDateAndTime(loanDue._hex)
                    setLoanDueDate(convertDateAndTime(loanDue._hex))


                }
            } catch (error) {
                console.log(error)
            }
        }
        getLoanTimer();
    }, [daoContract, id])



    const [payLoanLoading, setPayLoanLoading] = useState(false)

    const payLoan = async (amount) => {
        setPayLoanLoading(true)
        try {
            if (daoContract) {
                // console.log(item.amount)
                let ethVal = amount / Math.pow(10, 18).toString()
                ethVal = ethVal.toString()
                // console.log(ethVal.toString())
                const transaction = await daoContract.loanPayBack({ from: currentAccount, value: ethers.utils.parseEther(ethVal) })
                await transaction.wait()
                // console.log(res)
                toast({
                    title: "Loan Paid Successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                })
                setLoanPaid(true)
            }
        } catch (error) {
            console.log(error)
            toast({
                title: "Error",
                description: "Something went wrong",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
            setLoanPaid(false)
        }
        finally {
            setPayLoanLoading(false)
        }
    }
    
    useEffect(()=> {
        const a = async ()=>{
            if(isETHPrice && ethBalance) {
                const amount = await fetchAmount(ethBalance)
                console.log(amount, 'amt')
                setConvertedBalance(amount.toFixed(2))
            }
        }
        a()
    }, [isETHPrice, ethBalance])

    console.log(convertedBalance, 'convertedBalance')

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
                            <VStack direction='column' h='110px' w="100%" p={4} spacing={"4"}>
                                <Text>Reputation: <chakra.span as="b">{user.reputation}</chakra.span> </Text>
                                <Divider orientation='horizontal' />
                                <Text>Your DAO Token: <chakra.span fontWeight={"semibold"}>{agrotokenBalance + " AGRO"}</chakra.span> </Text>
                                {user && Number(user.loan) !== 0 &&
                                    <>
                                        <Divider orientation='horizontal' />
                                        <HStack>
                                            <Text>Loan Due Date: <chakra.span fontWeight={"semibold"}>{loanDueDate}</chakra.span> </Text>
                                        </HStack>
                                    </>
                                }
                                <Divider orientation='horizontal' />
                                <HStack>
                                    {
                                        Number(user.loan) === 0 ?
                                            <Text>Loan: <chakra.span fontWeight={"semibold"}>{user.loan + " ETH"}</chakra.span> </Text> :
                                            <Button colorScheme="teal" size="md" loadingText={"paying..."} isLoading={payLoanLoading} onClick={() => payLoan(user.loan)}>Pay Loan</Button>
                                    }

                                </HStack>
                                <Divider orientation='horizontal' />
                            </VStack>
                        </VStack>
                        {/* <Box border="1px solid" borderColor={useColorModeValue('gray.800', 'gray.500')} rounded="lg" w='90%' h='10vh'>
                                <Text ml="3" mt="2" fontSize="md" fontWeight={"semibold"}>Reputation</Text>
                            </Box> */}
                    </Stack>
                    <Grid h="30%" w={{ base: "100%", lg: "60%" }} templateRows="repeat(1, 1fr)" templateColumns={"repeat(1, 1fr)"} gap={4} ml={{ base: "0", lg: "5" }}>
                        <Stack direction={{ base: "column", md: "row" }}>
                            <SimpleGrid border="1px" p="5" w={{ base: "100%", md: "30%" }} rounded="md" columns={{ base: 1 }} spacing={"0"}>
                                <HStack>
                                    <Text fontSize="sm" fontWeight={"semibold"}>Your pending Loan</Text>
                                    {/* {user.loan > 0 ? <Badge colorScheme="red">Pending</Badge> : <Badge colorScheme="green">Paid</Badge>} */}
                                    {
                                        user.loan > 0 ? <Icon as={FaExclamationTriangle} color="red.500" /> : <Icon as={FaCheckCircle} color="green.500" />
                                    }
                                </HStack>
                                <Text fontWeight={"semibold"} fontSize={"2xl"}>{Number(user.loan / Math.pow(10, 18))} ETH</Text>
                            </SimpleGrid>
                            <StatsCard
                                title="Your ETH Balance"
                                stat={convertedBalance ? convertedBalance : Number(ethBalance).toFixed(2) + " " + currency }
                            />
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
                                            {/* <Th textAlign={"center"}>Pay</Th> */}
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {/* proposal is undefined initially and then array of objects */}
                                        {proposal && Array.isArray(proposal) && proposal.map((item, index) => {
                                            return (
                                                <Tr key={index}>
                                                    <Link to={`/proposal/${item.proposalId}`}><Td>
                                                        <Text as={ChakraLink}>
                                                            {item.description}
                                                        </Text>
                                                    </Td></Link>
                                                    <Td textAlign="left">{item.amount / Math.pow(10, 18)}</Td>
                                                    <Td textAlign="center">
                                                        {item.isExecuted ? (
                                                            <Badge colorScheme="green">Executed</Badge>
                                                        ) : (
                                                            <Badge colorScheme="red">Not Executed</Badge>
                                                        )}
                                                    </Td>
                                                    {/* {
                                                        item.amount > 0 ?
                                                            <Td textAlign="center">
                                                                <Button colorScheme="teal" size="sm" onClick={() => payLoan(item.amount)}>Pay</Button>
                                                            </Td>
                                                            :
                                                            <Td textAlign="center">
                                                                <Button colorScheme="teal" size="sm" disabled>Paid</Button>
                                                            </Td>
                                                    } */}
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
