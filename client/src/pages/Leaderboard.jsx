import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    chakra,
    TableContainer,
    Box,
    Heading,
    VStack,
    Stack,
    useColorModeValue,
} from '@chakra-ui/react'
import Navbar from '../components/Navbar'

const Leaderboard = () => {
    return (
        <>
            <Navbar />
            <Stack
                maxW={'5xl'}
                margin={'auto'}
                px={{ base: '6', md: '8' }}
                py={{ base: '8', sm: '10' }}
                textAlign='center'
                spacing={{ base: '8', md: '14' }}
            >
                <Heading
                    bgGradient='linear(to-r,  #A4D79E, #357945)'
                    bgClip='text'
                    fontSize='4xl'
                    fontWeight='extrabold'
                    height="30%"
                    size='xl'
                >
                    Leaderboard
                </Heading>
                <TableContainer
                    border="1px solid"
                    // different from dark and light mode
                    borderColor={useColorModeValue('gray.600', 'gray.200')}
                    borderRadius="md"
                    boxShadow="md"
                // fontSize={{ base: 'sm', md: 'lg' }}
                >
                    <Table
                        variant='simple'
                        size="lg"
                    >
                        <Thead>
                            <Tr>
                                <Th>Rank</Th>
                                <Th>Address (Name)</Th>
                                <Th isNumeric>Reputation</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <>
                                {[1, 2, 3, 4, 5].map((_, index) => (
                                    <Tr
                                        key={index}
                                        style={{ marginBottom: "8px" }}>
                                        <Td>
                                            <chakra.span bg={
                                                index === 0 ? "red.400" :
                                                    index === 1 ? "orange.400" :
                                                        index === 2 ? "cyan.600" : ""
                                            } rounded={"sm"}
                                                px={2} color={
                                                    index === 0 ? "white" :
                                                        index === 1 ? "white" :
                                                            index === 2 ? "white" : ""
                                                }>{index + 1}</chakra.span>
                                        </Td>
                                        <Td>0xA10...01cD</Td>
                                        <Td isNumeric>100</Td>
                                    </Tr>
                                ))}
                            </>
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
            </Stack>
        </>
    )
}

export default Leaderboard
