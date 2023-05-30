import { Box, Button, Container, HStack, Heading, SimpleGrid, Stack, Stat, StatLabel, StatNumber, Text, VStack, chakra, useColorModeValue } from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend } from 'recharts';
import { HiOutlineMail } from 'react-icons/hi';
import { BsArrowUpShort, BsArrowDownShort } from 'react-icons/bs';
import { AiOutlineLike, AiOutlineEye } from 'react-icons/ai';
import { CheckIcon, CloseIcon, RepeatClockIcon } from "@chakra-ui/icons";

const data = [
    { name: 'Group A', value: 10 },
    { name: 'Group B', value: 5 },
];

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


const renderLegend = () => {
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
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: status === "pending" ? "#cca92c" : status === "completed" && "green",
        cursor: "pointer",
        boxShadow: "0 0 0 rgba(204,169,44, 0.4)",
        animation: "pulse 2s infinite",
    };

    return (
        <HStack>
            <Heading fontSize={"2xl"}>{status === "pending" ? "Pending" : status === "completed" && "Completed"}</Heading>
            <span
                className="pulse"
                style={pulseStyle}
            ></span>
        </HStack>
    );
};


const Proposal = () => {
    return (
        <>
            <Navbar />
            <Box mt="6" mb="6">
                <VStack spacing="10">
                    <VStack>
                        <Heading>Proposal Title</Heading>
                        <Text>initiated by: 0x3434....cBa</Text>
                        <Text fontSize={"md"} maxW="xl" textAlign={"center"}>
                            {/* Random text of length 50 words */}
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                            vitae diam euismod, tincidunt elit quis, ultricies nisl. Donec
                            euismod, nisl vitae aliquam ultricies, nunc nisl ultrices
                            tortor, quis aliquam nisl nunc vel nunc. Donec euismod, nisl
                            vitae aliquam ultricies, nunc nisl ultrices tortor, quis
                            aliquam nisl nunc vel nunc. Donec euismod, nisl vitae aliquam
                        </Text>
                    </VStack>
                    <Stack direction={{ base: "column", lg: "row" }} alignItems={"center"} justifyContent={"center"} minW="50vw" spacing="6">
                        <Box border={"1px"} rounded={"xl"} m="5">
                            <Heading size={"md"} textAlign={"center"} p="3">Voting</Heading>
                            <PieChart width={400} height={400}>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    innerRadius={50}
                                    outerRadius={150}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                {/* <Legend content={renderLegend} /> */}
                            </PieChart>
                        </Box>
                        <VStack spacing="6">
                            <HStack>
                                <StatsCard title={'Amount Requested'} stat={'10 ETH'} />
                                <StatsCard title={'Time left'} stat={'10 mins'} />
                            </HStack>
                            <Box border={"1px"} rounded={"xl"} >
                                <Heading size={"md"} textAlign={"center"} p="3">Voting Details</Heading>
                                <Box w="xs" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
                                    <SimpleGrid columns={{ base: 1 }} spacing={{ base: 5, lg: 8 }} mb="5">
                                        <StatsCard title={'Voting in-favour'} stat={'10 members'} />
                                        <StatsCard title={'Voting against'} stat={'5 members'} />
                                        {/* <StatsCard title={'Who speak'} stat={'100 different languages'} /> */}
                                    </SimpleGrid>
                                </Box>
                            </Box>
                        </VStack>
                        <Stack spacing="5" height="full" border={"1px"} rounded={"xl"} p="5" maxW="4xl">
                            <Heading pb="5" size={"md"} textAlign={"center"}>Voting Options</Heading>

                            <HStack w="xs">
                                <SimpleGrid border="1px" w="full" p="5" rounded="md" columns={{ base: 1 }} spacing={"2"}>
                                    <Text fontSize="sm" fontWeight={"semibold"}>Status</Text>

                                    <PulseComponent status={"pending"} />
                                </SimpleGrid>
                                <SimpleGrid border="1px" p="5" w="full" rounded="md" columns={{ base: 1 }} spacing={"2"} mb="5">
                                    <Text fontSize="sm" fontWeight={"semibold"}>Time Left</Text>
                                    <Heading fontSize={"2xl"}>10 mins</Heading>

                                </SimpleGrid>
                            </HStack>
                            <Stack w="xs" h='full' direction={{ base: "column" }} spacing={{ base: 5, sm: 10 }} m="5" >
                                <Button rightIcon={<CheckIcon />} colorScheme="teal" variant="outline" size="md" w="full" mx={'auto'}>Vote In favour</Button>
                                <Button rightIcon={<CloseIcon color={"red.300"} />} colorScheme="teal" variant="outline" size="md" w="full" mx={'auto'}>Vote Against</Button>
                                <Button colorScheme="teal" rightIcon={<RepeatClockIcon color="yellow.500" />} variant="outline" size="md" w="full" mx={'auto'}>Execute Proposal</Button>
                            </Stack>
                        </Stack>
                    </Stack>
                </VStack>
            </Box>
        </>
    )
}

export default Proposal
