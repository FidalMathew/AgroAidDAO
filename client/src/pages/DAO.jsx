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
    useToast,
} from "@chakra-ui/react"
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"
import { Fragment, useEffect } from "react";
import { Field, Formik } from 'formik';
import * as Yup from 'yup';
import { useState } from "react";
import useGlobalContext from "../hooks/useGlobalContext";
import { ethers } from "ethers";

const DAO = () => {
    const toast = useToast()
    const [checked, setChecked] = useState(false)
    useEffect(() => {
        console.log(checked, 'checked')
    }, [checked])


    const { daoContract, currentAccount } = useGlobalContext();

    const [daoBalance, setDaoBalance] = useState(0);
    const [daoToken, setDaoToken] = useState(0);
    // total proposals
    const [totalProposal, setTotalProposal] = useState(0);
    // total members
    const [totalMembers, setTotalMembers] = useState(0);
    const [members, setMembers] = useState([])
    const [fetchedProposals, setFetchedProposals] = useState([])

    const [Completed, setCompleted] = useState(false);
    const [currTime, setCurrTime] = useState(0);
    const [endTime, setEndTime] = useState(0);

    const now = new Date()

    useEffect(() => {
        setCurrTime(now)
    }, [now])




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

    const toDate = (date) => {
        return new Date(date)
    }

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
                        console.log("endTime", convertDateAndTime(proposalId[5]._hex))
                        proposalList.push(proposalValue);
                    }
                    console.log(proposalList, 'proposalList')
                    setFetchedProposals(proposalList);

                    setEndTime(endTime)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getAllProposals();
    }, [daoContract, totalProposal])


    const [proposalLoading, setProposalLoading] = useState(false);
    const CreateProposal = async (desc, amount) => {
        setProposalLoading(true);
        try {
            amount = String(amount)
            let temp = ethers.utils.parseEther(amount)
            const transaction = await daoContract.createProposal(desc, temp);
            await transaction.wait()
            console.log(transaction, 'proposal transaction')
            toast({
                // proposal creation
                title: "Proposal created.",
                status: "success",
                duration: 9000,
                isClosable: true,
            });
        } catch (error) {
            console.log(error);
            toast({
                title: "Error creating proposal.",
                description: "Please try again.",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        } finally {
            setProposalLoading(false);
        }
    }

    // use state for current time 


    useEffect(() => {

        const onNewProposal = (description, owner, amount, isExecuted, startTime, endTime, votesFor, votesAgainst, voters) => {
            // console.log("NewCandidate", candAddress, name, proposal, votes);
            // console.log("Proposal updated successfully",
            //     description, owner, Number(amount), isExecuted, convertDateAndTime(startTime._hex), convertDateAndTime(endTime._hex), Number(votesFor), Number(votesAgainst), voters
            // )

            setFetchedProposals(prevState => [
                ...prevState,
                {
                    proposalId: fetchedProposals.length + 1,
                    description: description,
                    owner: owner,
                    amount: Number(amount),
                    isExecuted: isExecuted,
                    startTime: convertDateAndTime(startTime._hex),
                    endTime: convertDateAndTime(endTime._hex),
                    votesFor: Number(votesFor),
                    votesAgainst: Number(votesAgainst),
                    voters: voters,
                }
            ]);
        };


        if (window.ethereum && daoContract) {
            daoContract.on("ProposalCreated", onNewProposal);
        }

        return () => {
            if (daoContract) {
                daoContract.off("ProposalCreated", onNewProposal);
            }
        };
    }, [daoContract]);


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
                <VStack minH="70vh" maxH="70vh" w={{ base: "80%", lg: "25vw" }} overflowY="scroll" className="members-list" border="1px solid" borderColor="gray.400" rounded="md" spacing={0} display={"flex"}>
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
                            {members.length !== index + 1 && <Divider m={0} />}
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
                    mt={{ base: 10, lg: 0 }}
                >
                    <Formik
                        initialValues={{
                            // title: '',
                            description: '',
                            askForPayment: false,
                            amount: 0,
                        }}

                        validationSchema={Yup.object({
                            // title: Yup.string().required('Title is required'),
                            description: Yup.string().required('Description is required'),
                            askForPayment: Yup.boolean(),
                            // amount can't be less than zero
                            amount: Yup.number().min(0, 'Amount can not be less than zero')
                        })}

                        onSubmit={(value, action) => {
                            CreateProposal(value.description, value.amount);
                            // console.log(value, 'value')
                            action.resetForm();
                        }}
                    >
                        {formik => (
                            <form onSubmit={formik.handleSubmit}>

                                <Heading size="md" pb={5} textAlign={"center"}>Create Proposals</Heading>
                                <Stack spacing={4}>
                                    {/* <FormControl
                                        id="title"
                                        isInvalid={formik.errors.title && formik.touched.title}
                                    >
                                        <FormLabel>Title</FormLabel>
                                        <Field name="title" as={Input} placeholder="Enter proposal title" />
                                        <FormErrorMessage fontSize="xs">{formik.errors.title}</FormErrorMessage>
                                    </FormControl> */}
                                    <FormControl id="description"
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
                                            }}
                                            isLoading={proposalLoading}
                                            loadingText="Creating Proposal.."
                                        >
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
            <TableContainer m="auto" maxW="80vw" mb="4" border="1px" p="2" pb="0" rounded="lg" maxH={"80vh"} overflowY={"scroll"} className="members-list">
                <Heading size="md" p={4} textAlign={"center"}>Member Record</Heading>
                <Table variant='simple' mb="6" size="lg">
                    {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}

                    <Thead>
                        <Tr>
                            <Th>Address</Th>
                            <Th>Title</Th>
                            <Th textAlign={"center"}>Proposal/Loan</Th>
                            <Th textAlign={"right"}>Status</Th>
                            <Th textAlign={"right"}>Voting Percentage</Th>
                        </Tr>
                    </Thead>
                    {fetchedProposals.length === 0 && (
                        <Tbody>
                            <Tr>
                                <Td colSpan={4} textAlign={"center"}>No proposals found.</Td>
                            </Tr>
                        </Tbody>
                    )}
                    <Tbody>
                        {
                            fetchedProposals.map((proposal, index) => (
                                <Tr key={index}>
                                    <Td><Link to={`/proposal/${proposal.proposalId}`}>
                                        <Text as="u">
                                            {proposal.owner.toString().slice(0, 5) + "..." + proposal.owner.toString().slice(-4)}
                                        </Text>
                                    </Link>
                                    </Td>
                                    {/* <Td >{proposal.amount}</Td> */}
                                    {/*  <PulseComponent status={{isExecuted}===true ? "completed" : {currTime}>={endTime} ?  "expired" :"pending"} /> */}

                                    <Td>
                                        <Text>
                                            {proposal.description.length > 20
                                                ? proposal.description.slice(0, 20) + "..."
                                                : proposal.description}
                                        </Text>
                                    </Td>
                                    <Td textAlign={"left"}>{proposal.amount === 0 ?
                                        <Badge colorScheme='blue' w="full" textAlign={"center"}>General Proposal</Badge> : <Badge w="100%"
                                            textAlign={"center"} colorScheme='orange'>Loan Request</Badge>}</Td>
                                    <Td textAlign={"right"}>{proposal.isExecuted ? <Badge colorScheme='green'>Executed</Badge> : currTime >= toDate(proposal.endTime) ? <Badge colorScheme='red'>Expired</Badge> : <Badge colorScheme='yellow'>Pending</Badge>}</Td>
                                    <Td textAlign="right">
                                        {proposal.votesFor + proposal.votesAgainst === 0
                                            ? "No votes cast"
                                            : `${((proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100).toFixed(0)}%`}
                                    </Td>
                                    {/* <Td textAlign={"right"}>{proposal.endTime}</Td> */}


                                    {/* <Td textAlign={"right"}>{proposal.isExecuted ? "Execution completed": {currTime}>=Date(proposal.endTime) ? "Expired":"Pending"}</Td> */}
                                </Tr>))
                        }
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
