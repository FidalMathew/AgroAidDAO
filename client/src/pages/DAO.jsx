import {
    Avatar, Box, Container, Divider, Flex, Grid, HStack, Heading, Icon, SimpleGrid, Stack, Stat, StatLabel, StatNumber, Text, VStack, useColorModeValue, chakra, Link, Center, FormControl, FormLabel, Input, Checkbox, Button, Textarea, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Badge,
} from "@chakra-ui/react"
import Navbar from "../components/Navbar"
import { Fragment } from "react";
import { GoPrimitiveDot } from 'react-icons/go';
import { FaRegComment, FaRegHeart, FaRegEye } from 'react-icons/fa';

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
    },
];


const DAO = () => {
    return (
        <>
            <Navbar />
            <HStack>

                <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
                    <Heading
                        textAlign={'center'}
                        fontSize={'4xl'}
                        pb={10}
                        fontWeight={'bold'}>
                        DAO Community Name
                    </Heading>
                    <SimpleGrid w="70vw" columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }} m="auto">
                        <StatsCard title={'DAO Balance'} stat={'1000 ETH'} />
                        <StatsCard title={'No of Proposals active'} stat={'30'} />
                        <StatsCard title={'Number of Members'} stat={'10'} />
                    </SimpleGrid>
                </Box>
            </HStack>
            <Flex justifyContent={"space-between"} flexDir={{ base: "column", sm: "row" }} alignItems={"center"} p={{ base: 5, md: 10 }}>

                {/* members */}
                <VStack minW="xs" border="1px solid" borderColor="gray.400" rounded="md" overflow="hidden" spacing={0} display={{ base: "none", lg: "flex" }}>
                    <Heading size="sm" p={4}>Members</Heading>
                    {articles.map((article, index) => (
                        <Fragment key={index}>
                            <Box
                                w="100%"
                                p={{ base: 2, sm: 4 }}
                                gap={3}
                                alignItems="center"
                                _hover={{ bg: useColorModeValue('gray.200', 'gray.700') }}
                            >
                                <Center flexDirection={"column"}>
                                    <chakra.h3 isExternal fontWeight="bold" fontSize="lg">
                                        {article.title}
                                    </chakra.h3>
                                    <chakra.p
                                        fontWeight="medium"
                                        fontSize="sm"
                                        color={useColorModeValue('gray.600', 'gray.300')}
                                    >
                                        Joined: {article.created_at}
                                    </chakra.p>
                                </Center>
                            </Box>
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
                    <Heading size="md" pb={5} textAlign={"center"}>Enter your Proposals</Heading>
                    <Stack spacing={4}>
                        <FormControl id="title">
                            <FormLabel>Title</FormLabel>
                            <Input type="text" placeholder="Proposal Title" />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Description</FormLabel>
                            <Textarea placeholder="Enter proposal description" />
                        </FormControl>
                        <Stack spacing={5}>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'start'}>
                                <Checkbox>Ask for Payment?</Checkbox>
                            </Stack>
                            <NumberInput defaultValue={1} max={6} min={1} clampValueOnBlur={false}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Button
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}>
                                Create Proposal
                            </Button>
                        </Stack>
                    </Stack>
                </Box>

                {/*  */}
                <VStack
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
                </VStack>
            </Flex>
            <TableContainer m="auto" maxW="80vw">
                <Heading size="md" p={4} textAlign={"center"}>Proposals Record</Heading>
                <Table variant='striped' mb="6">
                    {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                    <Thead>
                        <Tr>
                            <Th>Address</Th>
                            <Th>Name</Th>
                            <Th isNumeric>Proposal Title</Th>
                            <Th isNumeric>Status</Th>
                            <Th>Amount requested</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>inches</Td>
                            <Td>millimetres (mm)</Td>
                            <Td isNumeric>25.4</Td>
                            <Td><Badge colorScheme='green'>Success</Badge></Td>
                            <Td isNumeric>25.4</Td>
                        </Tr>
                        <Tr>
                            <Td>feet</Td>
                            <Td>centimetres (cm)</Td>
                            <Td isNumeric>30.48</Td>
                            <Td><Badge colorScheme='green'>Success</Badge></Td>
                            <Td isNumeric>30.48</Td>
                        </Tr>
                        <Tr>
                            <Td>yards</Td>
                            <Td>metres (m)</Td>
                            <Td isNumeric>0.91444</Td>
                            <Td><Badge colorScheme='green'>Success</Badge></Td>
                            <Td isNumeric>0.91444</Td>
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
