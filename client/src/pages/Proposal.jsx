import { Box, Button, Container, HStack, Heading, SimpleGrid, Stack, Stat, StatLabel, StatNumber, Text, Tooltip, VStack, chakra, useColorModeValue, useToast } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend } from 'recharts';
import { CheckIcon, CloseIcon, RepeatClockIcon } from "@chakra-ui/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useGlobalContext from "../hooks/useGlobalContext";
import { useState } from "react";
import { useEffect } from "react";
// const data = [
//     { name: 'Group A', value: 1000 },
//     { name: 'Group B', value: 200 },
// ];

const COLORS = ['#0088FE', '#00C49F'].reverse();
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const renderLegend = (data) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            {data.map((entry, index) => (
                <div key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                    <div style={{ backgroundColor: COLORS[index % COLORS.length], width: '12px', height: '12px', marginRight: '5px' }}></div>
                    <span>{entry.name}</span>
                </div>
            ))}
        </div>
    );
};

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

const PulseComponent = ({ status }) => {
    const pulseStyle = {
        display: "block",
        margin: 0,
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: status === "pending" ? "#cca92c" : status === "completed" ? "green" : status == "expired" && "red",
        cursor: "pointer",
        boxShadow: "0 0 0 rgba(204,169,44, 0.4)",
        animation: "pulse 2s infinite",
    };
    //  <PulseComponent status={expired ? "completed" : "pending"} />
    return (
        <HStack spacing="3">
            <Heading fontSize={"2xl"}>{
                status === "pending" ? "Pending" : status === "completed" ? "Done" : status == "expired" && "Expired"
            }</Heading>
            <chakra.span
                className="pulse"
                style={pulseStyle}
            ></chakra.span>
        </HStack>
    );
};



const Proposal = () => {
    const toast = useToast()
    const [proposal, setProposal] = useState({})

    const [votingData, setVotingData] = useState([
        { name: 'Vote For', value: 0 },
        { name: 'Vote Against', value: 0 },
    ])

    const [expired, setExpired] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isExecuted, setIsExecuted] = useState(false);
    const [currTime, setCurrTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [dayRem, setDayRem] = useState(0);

    const [hasVoted, setHasVoted] = useState(false)
    const [votingLoading1, setVotingLoading1] = useState(false);
    const [votingLoading2, setVotingLoading2] = useState(false);
    const { daoContract, currentAccount } = useGlobalContext()
    const { id } = useParams()
    const navigate = useNavigate()


    const voting = async (proposalIndex, voteVar) => {
        (voteVar == true) ? setVotingLoading1(true) : setVotingLoading2(true)
        try {
            const transaction = await daoContract.castVote(proposalIndex, voteVar)
            await transaction.wait();
            console.log(transaction, 'transaction')
            setHasVoted(true)
            toast({
                title: `Voting Successful`,
                description: `voted ${voteVar} for proposal ${proposalIndex}`,
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        } catch (error) {
            console.log(error, 'error voting');
            setHasVoted(false)
            toast({
                title: "Error Voting.",
                description: "Couldn't execute vote",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } finally {
            (voteVar == true) ? setVotingLoading1(false) : setVotingLoading2(false)
        }
    };

    const convertDateAndTime = (timestamp) => {
        // Remove the '0x' prefix and convert the hex timestamp to a decimal number
        const decimalTimestamp = parseInt(timestamp.substring(2), 16);

        // Create a new Date object from the decimal timestamp
        const date = new Date(decimalTimestamp * 1000);

        // Extract the date and time components
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);

        // Format the date and time
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
                    console.log(proposalList[id], 'proposalList')
                    setProposal(proposalList[id]);

                    setEndTime(endTime)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getAllProposals();
    }, [daoContract, location, id])


    useEffect(() => {
        if (proposal && proposal.voters && proposal.voters.includes(currentAccount)) {
            setHasVoted(true);
        } else {
            setHasVoted(false);
        }
    }, [proposal, currentAccount]);


    const end = new Date(proposal.endTime)
    const now = new Date()

    useEffect(() => {
        setVotingData([
            { name: 'Vote For', value: proposal?.votesFor },
            { name: 'Vote Against', value: proposal?.votesAgainst },
        ])
    }, [id, location, hasVoted, proposal])


    useEffect(() => {
 

            if (end < now) {
                setExpired(true)
            }
            else {
                const daysRemaining = (Math.ceil((end - now) / (1000 * 60 * 60 * 24)))
                setDayRem(daysRemaining)
            }
            if (proposal.isExecuted) {
                setIsExecuted(true);
            }
            setCurrTime(now);
            setEndTime(end);
      
    }, [proposal])

    useEffect(() => {
        if (proposal !== {}) {

            if (end > now) {
                const minutes = Math.ceil((end - now) / (1000 * 60))
                setTimeLeft(minutes);
            }
            else {
                setTimeLeft(0);
                setExpired(true);
            }
        }
    }, [now])


    // detect account change, if user tries to disconnect wallet redirect to /connectwallet
    useEffect(() => {
        if (currentAccount === undefined) {
            navigate('/connectwallet')
        }
    }, [currentAccount])

    console.log(proposal, 'proposal in dimag')


    return (
        <>
            <Navbar />
            <Box mt="6" mb="6">
                <VStack spacing="10">
                    <VStack>
                        <Heading>Proposal Title</Heading>
                        <Text>initiated by: {proposal?.owner?.toString().slice(0, 5) + "..." + proposal?.owner?.toString().slice(-4)}</Text>
                        <Text fontSize={"md"} maxW="xl" textAlign={"center"}>
                            {/* Random text of length 50 words */}
                            {proposal?.description}
                        </Text>
                    </VStack>
                    <Stack direction={{ base: "column", xl: "row" }} alignItems={"center"} justifyContent={"center"} minW="50vw" spacing="6">
                        <Box border={"1px"} rounded={"xl"} m="5">
                            <Heading size={"md"} textAlign={"center"} p="3">Voting</Heading>
                            {proposal?.votesFor == 0 && proposal?.votesAgainst == 0 ?
                                <Box width={"25rem"} h="25rem">
                                    <Text fontSize={"md"} textAlign={"center"}>No votes yet</Text>
                                </Box> :
                                <PieChart width={400} height={400}>
                                    <Pie
                                        data={votingData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        innerRadius={50}
                                        outerRadius={150}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {votingData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    {/* <Legend content={renderLegend} /> */}
                                </PieChart>
                            }
                        </Box>
                        <VStack spacing="6">
                            <HStack w="full">
                                <StatsCard title={proposal?.amount == 0 ? "" : "Amount Requested"} stat={proposal?.amount == 0 ? "General Proposal" : proposal?.amount + " ETH"} />
                                {/* <StatsCard title={'Time left'} stat={'10 mins'} /> */}
                            </HStack>
                            <Box border={"1px"} rounded={"xl"} >
                                <Heading size={"md"} textAlign={"center"} p="3">Voting Details</Heading>
                                <Box w="xs" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
                                    <SimpleGrid columns={{ base: 1 }} spacing={{ base: 5, lg: 8 }} mb="5">
                                        <StatsCard title={'Voting power in-favour'} stat={proposal?.votesFor} />
                                        <StatsCard title={'Voting power - against'} stat={proposal?.votesAgainst} />
                                        {/* <StatsCard title={'Who speak'} stat={'100 different languages'} /> */}
                                    </SimpleGrid>
                                </Box>
                            </Box>
                        </VStack>
                        <Stack spacing="5" height="full" border={"1px"} rounded={"xl"} p="5" maxW="4xl">
                            <Heading pb="5" size={"md"} textAlign={"center"}>Voting Options</Heading>

                            <HStack w="xs" m="auto">
                                <SimpleGrid border="1px" w="full" p="5" rounded="md" columns={{ base: 1 }} spacing={"2"}>
                                    <Text fontSize="sm" fontWeight={"semibold"}>Status</Text>
                                    {/* <PulseComponent status={"expired"} />  */}
                                    {/*  status === "pending" ? "Pending" : status === "completed" ? "Done" : status == "expired" && "Expired" */}
                                    <PulseComponent status={{ isExecuted } === true ? "completed" : currTime >= endTime ? "expired" : "pending"} />
                                </SimpleGrid>
                                <SimpleGrid border="1px" p="5" w="full" rounded="md" columns={{ base: 1 }} spacing={"2"}>
                                    <Text fontSize="sm" fontWeight={"semibold"}>Time Left</Text>
                                    <Heading fontSize={"2xl"}>{timeLeft} mins</Heading>
                                </SimpleGrid>
                            </HStack>
                            <Stack w="xs" h='full' direction={{ base: "column" }} spacing={{ base: 5, sm: 10 }} m="5" >
                                <Tooltip
                                    label={hasVoted ? "You have already voted" : expired ? "Voting has expired" : proposal?.owner?.toLowerCase() == currentAccount.toLowerCase() ? "You cannot vote on your own proposal" : ""}
                                >
                                    <Button
                                        rightIcon={<CheckIcon />}
                                        colorScheme="teal"
                                        variant="outline"
                                        size="md"
                                        w="full"
                                        mx={'auto'}
                                        isDisabled={hasVoted || expired || proposal?.owner?.toLowerCase() == currentAccount.toLowerCase()}
                                        loadingText="Voting..."
                                        isLoading={votingLoading1}
                                        onClick={() => voting(proposal.proposalId, true)}
                                    >
                                        Vote In favour
                                    </Button>
                                </Tooltip>
                                <Tooltip
                                    label={hasVoted ? "You have already voted" : expired ? "Voting has expired" : proposal?.owner?.toLowerCase() == currentAccount.toLowerCase() ? "You cannot vote on your own proposal" : ""}
                                >
                                    <Button
                                        rightIcon={<CloseIcon color={"red.300"} />} colorScheme="teal"
                                        variant="outline"
                                        size="md"
                                        w="full"
                                        mx={'auto'}
                                        isDisabled={hasVoted || expired || proposal?.owner?.toLowerCase() == currentAccount.toLowerCase()}
                                        loadingText="Voting..."
                                        isLoading={votingLoading2}
                                        onClick={() => voting(proposal.proposalId, false)}
                                    >
                                        Vote Against
                                    </Button>
                                </Tooltip>
                                <Tooltip
                                    label={expired ? "Voting has expired" : ""}
                                >
                                    <Button
                                        colorScheme="teal"
                                        rightIcon={<RepeatClockIcon color="yellow.500" />} variant="outline" size="md" w="full" mx={'auto'}
                                        isDisabled={!expired || isExecuted}
                                    >
                                        Execute Proposal
                                    </Button>
                                </Tooltip>
                            </Stack>
                        </Stack>
                    </Stack>
                </VStack>
            </Box>
        </>
    )
}

export default Proposal
