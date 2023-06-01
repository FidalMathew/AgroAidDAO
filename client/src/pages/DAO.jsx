import {
    Avatar,
    Box,
    Container,
    Divider,
    Flex,
    Grid,
    HStack,
    Heading,
    Icon,
    SimpleGrid, Stack, Stat, StatLabel, StatNumber, Text, VStack, useColorModeValue, chakra, Center, FormControl, FormLabel, Input, Checkbox, Button, Textarea, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Badge,
    FormErrorMessage,
} from "@chakra-ui/react"
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"
import { Fragment, useEffect } from "react";
import { GoPrimitiveDot } from 'react-icons/go';
import { FaRegComment, FaRegHeart, FaRegEye } from 'react-icons/fa';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';
import { useState } from "react";
import useContract from "../hooks/useContract";
import useGlobalContext from "../hooks/useGlobalContext";
import { ethers } from "ethers";
const notifications = [
    {
        notification: `<p style="font-size: medium;"><span style="font-weight: 600;font-size: medium;">Dan Abrahmov's</span> paid 1 ETH</p>`,
        dateTime: '2 days ago',
        userName: 'Dan Abrahmov',
        userAvatar: 'https://bit.ly/dan-abramov',
        isOnline: true
    },
    {
        notification: `<p style="font-size: medium;"><span style="font-weight: 600;font-size: medium;">Vitalik Buterin</span> joined the DAO</p>`,
        dateTime: 'yesterday',
        userName: 'Kent Dodds',
        userAvatar: 'https://im.indiatimes.in/content/2022/Mar/flickr-etherum-founder_623b07675a7b0.jpg?w=1200&h=900&cc=1',
        isOnline: true
    },
    {
        notification: `<p style="font-size: medium;"><span style="font-weight: 600;font-size: medium;">Jena Karlis</span> raised a proposal <span style="font-weight: 600">Loan of 1 ETH</span>.</p>`,
        dateTime: '4 days ago',
        userName: 'Jena Karlis',
        userAvatar:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=334&q=80',
        isOnline: true
    }
];

const articles = [
    {
        title: 'Fidal Mathew',
        created_at: '21 Jan 2022',
    },
    {
        title: 'Jaydeep Dey',
        created_at: '20 Jun 2021',

    },
    {
        title: `Aryan Vigyat`,
        created_at: '31 Sept 2022',
    },
    {
        title: `Prateek Mohanty`,
        created_at: '31 Sept 2022',
    },
    {
        title: `Spandan Ghosh`,
        created_at: '31 Sept 2022',
    }

];


const DAO = () => {
    const [checked, setChecked] = useState(false)
    useEffect(() => {
        console.log(checked, 'checked')
    }, [checked])

    const { daoContract } = useGlobalContext();

    const [daoBalance, setDaoBalance] = useState(0);
    const [daoToken, setDaoToken] = useState(0);
    // total proposals
    const [totalProposal, setTotalProposal] = useState(0);
    // total members
    const [totalMembers, setTotalMembers] = useState(0);
    const [members, setMembers] = useState([])
    const [fetchedProposals, setFetchedProposals] = useState([])

    useEffect(() => {
        console.log(members[0], 'members')
    }, [members])

    useEffect(() => {
        if (daoContract) {
            daoContract.getDAOBalance().then((res) => {
                setDaoBalance(ethers.utils.formatEther((res)));
            }).catch(err => console.log(err))

            daoContract.contractTokenBalance().then((res) => {
                setDaoToken(Number(res));
            }).catch(err => console.log(err))

            daoContract.TotalProposals().then((res) => {
                setTotalProposal(Number(res));
            }).catch(err => console.log(err))

            daoContract.TotalMembers().then((res) => {
                setTotalMembers(Number(res));
            }).catch(err => console.log(err))


            daoContract.getMemberAddresses().then(async (res) => {
                const memberValues = [];
                for (let i = 0; i < res.length; i++) {
                    const memberAddress = res[i];
                    const memberValue = await daoContract.members(memberAddress);
                    memberValues.push(memberValue);
                }
                setMembers(memberValues);
                console.log("Members: ", memberValues);
            }).catch((err) => {
                console.log(err);
            });



        }
    }, [daoContract])

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
                    console.log(proposalList, 'proposalList')
                    setFetchedProposals(proposalList);
                }
            } catch (error) {
                console.log(error)
            }
        }
        getAllProposals();
    }, [daoContract, totalProposal])
    return (
        <>
            <Navbar />
            <HStack>

                <Box m="auto" pt={5} px={{ base: 2, sm: 12, md: 17 }}>
                    <Heading
                        textAlign={'center'}
                        fontSize={'4xl'}
                        pb={10}
                        fontWeight={'bold'}>
                        DAO Community Name 👨‍🌾
                    </Heading>
                    <Container>
                        {/* write a 3 line random description about dao */}
                        <Text textAlign={'center'} fontSize={'md'} pb={10} fontWeight={'normal'}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.
                        </Text>
                    </Container>
                    <SimpleGrid w="70vw" columns={{ base: 1, lg: 4 }} spacing={{ base: 5, lg: 8 }} m="auto">
                        <StatsCard title={'DAO Balance'} stat={daoBalance.toString() + " ETH"} />
                        <StatsCard title={'AGRO Tokens'} stat={daoToken.toString() + " AGRO"} />
                        <StatsCard title={'No of Proposals active'} stat={totalProposal} />
                        <StatsCard title={'Number of Members'} stat={totalMembers} />
                    </SimpleGrid>
                </Box>
            </HStack>
            <Flex justifyContent={"center"} w="100vw" m="auto" flexDir={{ base: "column", lg: "row" }} alignItems={"center"} p={{ base: 5, md: 10 }}>
                {/* members */}
                <VStack minH="70vh" maxH="700vh" w={{ base: "80%", lg: "25vw" }} overflowY="scroll" className="members-list" border="1px solid" borderColor="gray.400" rounded="md" spacing={0} display={"flex"}>
                    <Heading size="sm" p={4}>Members</Heading>
                    {members.map((article, index) => (
                        <Fragment key={index}>
                            {typeof article === 'object' ? (
                                <Box
                                    w="100%"
                                    p={{ base: 2, sm: 4 }}
                                    gap={3}
                                    alignItems="center"
                                >
                                    <Center flexDirection="column">
                                        <chakra.h3 fontWeight="bold" fontSize="lg">
                                            {article.name} {/* Access the address value */}
                                        </chakra.h3>
                                        <chakra.p
                                            fontWeight="medium"
                                            fontSize="sm"
                                            color={useColorModeValue('gray.600', 'gray.300')}
                                        >
                                            Address: {article.farmerAddress.toString().slice(0, 5) + "..." + article.farmerAddress.toString().slice(-4)} {/* Access the loan value */}
                                        </chakra.p>
                                    </Center>
                                </Box>
                            ) : null}
                            {articles.length - 1 !== index && <Divider m={0} />}
                        </Fragment>
                    ))}



                </VStack>
                {/*  */}

                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}
                    w="lg"
                    ml={{ base: "auto", md: 10 }}
                    mr={{ base: "auto", md: 10 }}
                >
                    <Formik
                        initialValues={{
                            title: '',
                            description: '',
                            askForPayment: false,
                            amount: 0,
                        }}

                        validationSchema={Yup.object({
                            title: Yup.string().required('Title is required'),
                            description: Yup.string().required('Description is required'),
                            askForPayment: Yup.boolean(),
                            amount: Yup.number().when('askForPayment', {
                                is: true,
                                then: Yup.number().required('Amount is required').min(0.01, 'Amount must be greater than 0.01'),
                                otherwise: Yup.number(),
                            }),
                        })}

                        onSubmit={(value, action) => {
                            console.log(value);
                            action.resetForm();
                        }}
                    >
                        {formik => (
                            <form onSubmit={formik.handleSubmit}>

                                <Heading size="md" pb={5} textAlign={"center"}>Create Proposals</Heading>
                                <Stack spacing={4}>
                                    <FormControl
                                        id="title"
                                        isInvalid={formik.errors.title && formik.touched.title}
                                    >
                                        <FormLabel>Title</FormLabel>
                                        <Field name="title" as={Input} placeholder="Enter proposal title" />
                                        <FormErrorMessage fontSize="xs">{formik.errors.title}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl id="password"
                                        isInvalid={formik.errors.description && formik.touched.description}
                                    >
                                        <FormLabel>Description</FormLabel>
                                        <Field name="description" as={Textarea} placeholder="Enter proposal description" />
                                        <FormErrorMessage fontSize="xs">{formik.errors.description}</FormErrorMessage>
                                    </FormControl>
                                    <Stack spacing={5}>
                                        <Stack
                                            direction={{ base: 'column', sm: 'row' }}
                                            align={'start'}
                                            justify={'start'}>
                                            <FormControl
                                                id="askForPayment"
                                                isInvalid={formik.errors.askForPayment && formik.touched.askForPayment}
                                            >
                                                <Field
                                                    onChange={
                                                        (e) => {
                                                            setChecked((prev) => !prev)
                                                        }
                                                    }
                                                    name="askForPayment" as={Checkbox}>Ask for Payment?</Field>
                                                <FormErrorMessage fontSize="xs">{formik.errors.askForPayment}</FormErrorMessage>
                                            </FormControl>
                                        </Stack>
                                        <FormControl
                                            id="amount"
                                            isInvalid={formik.errors.amount && formik.touched.amount}
                                        >
                                            <Field name="amount">
                                                {({ field, form }) => (
                                                    <div>
                                                        <NumberInput
                                                            {...field}
                                                            value={formik.values.amount}
                                                            onChange={(value) => form.setFieldValue(field.name, value)}
                                                            placeholder="Enter amount.."
                                                            isDisabled={!checked}
                                                            clampValueOnBlur={false}
                                                            min={0.01}
                                                        >
                                                            <NumberInputField />
                                                            <NumberInputStepper>
                                                                <NumberIncrementStepper />
                                                                <NumberDecrementStepper />
                                                            </NumberInputStepper>
                                                        </NumberInput>
                                                        <FormErrorMessage fontSize="xs">
                                                            {formik.errors.amount}
                                                        </FormErrorMessage>
                                                    </div>
                                                )}
                                            </Field>
                                        </FormControl>

                                        <Button
                                            type="submit"
                                            bg={'blue.400'}
                                            color={'white'}
                                            _hover={{
                                                bg: 'blue.500',
                                            }}>
                                            Create Proposal
                                        </Button>
                                    </Stack>
                                </Stack>
                            </form>
                        )}

                    </Formik>
                </Box>

                {/*  */}
                {/* <VStack
                    // boxShadow={useColorModeValue(
                    //     '0 3px 4px rgba(160, 174, 192, 0.6)',
                    //     '0 3px 4px rgba(9, 17, 28, 0.9)'
                    // )}
                    border="1px solid" borderColor="gray.400"
                    rounded="md"
                    overflow="hidden"
                    spacing={0}
                    pr="3"
                    pl="3"
                    pb="3"
                    maxW={"sm"}
                    // hidden in mobile screen
                    display={{ base: "none", lg: "flex" }}
                >
                    <Heading size="sm" p={4}>Recent Activites</Heading>
                    {notifications.map((notification, index) => (
                        <Fragment key={index}>
                            <Flex
                                w="100%"
                                justify="space-between"
                                alignItems="center"
                                _hover={{ bg: useColorModeValue('gray.200', 'gray.700') }}
                            >
                                <Stack spacing={0} direction="row" alignItems="center">
                                    <Flex p={4}>
                                        <Avatar size="md" name={notification.userName} src={notification.userAvatar} />
                                    </Flex>
                                    <Flex direction="column" p={2}>
                                        <Text
                                            color={useColorModeValue('black', 'white')}
                                            fontSize={{ base: 'sm', sm: 'sm', md: 'lg' }}
                                            dangerouslySetInnerHTML={{ __html: notification.notification }}
                                        />
                                        <Text
                                            color={useColorModeValue('gray.400', 'gray.200')}
                                            fontSize={{ base: 'sm', sm: 'sm' }}
                                        >
                                            {notification.dateTime}
                                        </Text>
                                    </Flex>
                                </Stack>
                                {notification.isOnline && (
                                    <Flex p={4}>
                                        <Icon as={GoPrimitiveDot} w={5} h={5} color="blue.400" />
                                    </Flex>
                                )}
                            </Flex>
                            {notifications.length - 1 !== index && <Divider m={0} />}
                        </Fragment>
                    ))}
                </VStack> */}
            </Flex>
            <TableContainer m="auto" maxW="80vw" mb="4" border="1px" p="2" pb="0" rounded="lg">
                <Heading size="md" p={4} textAlign={"center"}>Member Record</Heading>
                <Table variant='simple' mb="6">
                    {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}

                    <Thead>
                        <Tr>
                            <Th>Address</Th>
                            <Th>Name</Th>
                            <Th isNumeric>Proposal Title</Th>
                            <Th isNumeric>Status</Th>
                            <Th textAlign={"right"}>Amount requested</Th>
                            <Th textAlign={"right"}>DAO Token</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            fetchedProposals.map((proposal, index) => (
                                <Tr key={index}>
                                    <Td><Link to={`/dao/${proposal.proposalId}`}>{proposal.owner.toString().slice(0, 5) + "..." + proposal.owner.toString().slice(-4)}</Link></Td>
                                    <Td >{proposal.amount}</Td>
                                    <Td textAlign={"right"}>{proposal.isExecuted ? <Badge colorScheme='green'>Executed</Badge> : <Badge colorScheme='yellow'>Pending</Badge>}</Td>
                                    <Td textAlign={"right"}>{proposal.startTime}</Td>
                                    <Td textAlign={"right"}>{proposal.endTime}</Td>
                                    <Td textAlign={"right"}>{proposal.votesFor}</Td>
                                    <Td textAlign={"right"}>{proposal.votesAgainst}</Td>
                                    <Td textAlign={"right"}>{proposal.voters}</Td>
                                </Tr>))
                        }
                        <Tr>
                            <Td><Link to="/dao/343/343">0x10AbbDc83...CBa</Link></Td>
                            <Td >Jaydeep Dey</Td>
                            <Td textAlign={"right"}>Loan for Education</Td>
                            <Td textAlign={"right"}><Badge colorScheme='yellow'>Pending</Badge></Td>
                            <Td isNumeric>25.4</Td>
                            <Td isNumeric>25.4</Td>
                        </Tr>
                        <Tr>
                            <Td ><Link to="/dao/343/343">0x10AbbDc83...CBa</Link></Td>
                            <Td >Fidal Mathew</Td>
                            <Td textAlign={"right"}>Loan for Farmer</Td>
                            <Td textAlign={"right"}><Badge colorScheme='green'>Success</Badge></Td>
                            <Td textAlign={"right"}>30.48</Td>
                            <Td textAlign={"right"}>30.48</Td>
                        </Tr>
                        <Tr>
                            <Td ><Link to="/dao/343/343">0x10AbbDc83...CBa</Link></Td>
                            <Td>Aryan Vigyat</Td>
                            <Td textAlign={"right"}>Loan for VIT</Td>
                            <Td textAlign={"right"}><Badge colorScheme='red'>Expired</Badge></Td>
                            <Td textAlign={"right"}>0.91444</Td>
                            <Td textAlign={"right"}>0.91444</Td>
                        </Tr>
                    </Tbody>
                    {/* <Tfoot>
                        <Tr>
                            <Th>To convert</Th>
                            <Th>into</Th>
                            <Th isNumeric>multiply by</Th>
                        </Tr>
                    </Tfoot> */}
                </Table>
            </TableContainer>
        </>
    )
}

function StatsCard(props) {
    const { title, stat } = props;
    return (
        <Stat
            px={{ base: 4, md: 8 }}
            py={'5'}
            shadow={'xl'}
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


export default DAO
