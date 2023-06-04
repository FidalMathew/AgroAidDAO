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
import useGlobalContext from '../hooks/useGlobalContext'
import { useEffect, useState } from 'react'

const Leaderboard = () => {

    const { daoContract, currentAccount } = useGlobalContext()

    const [prevContributors, setPrevContributors] = useState([])
    const [leaderboard, setLeaderboard] = useState([])

    useEffect(() => {
        const getPrevContributors = async () => {
            if (!daoContract) return

            try {
                const prevContributors = await daoContract.getTopContributors()
                console.log("prevContributors ", prevContributors)
                setPrevContributors(prevContributors)
            } catch (error) {
                console.log("error ", error)
            }
        }
        getPrevContributors()
    }, [daoContract])

    useEffect(() => {
        const getLeaderboard = async () => {
            if (!daoContract) return

            let tempLeaderboard = []
            try {
                const leaderboard = await daoContract.getMemberAddresses()
                console.log("leaderboard ", leaderboard)
                for (const address of leaderboard) {
                    const member = await daoContract.members(address)
                    console.log("member ", member)
                    tempLeaderboard.push({ address, reputation: Number(member.reputation._hex) })
                }
                console.log("tempLeaderboard ", tempLeaderboard)

                tempLeaderboard.sort((a, b) => b.reputation - a.reputation)
                setLeaderboard(tempLeaderboard)
            } catch (error) {
                console.log("error ", error)
            }
        }
        getLeaderboard()
    }, [daoContract])

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
                                {leaderboard.map((val, index) => (
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
                                        <Td>{val.address.toLowerCase() === currentAccount.toLowerCase() ? "You" : val.address}</Td>
                                        <Td isNumeric>{val.reputation}</Td>
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

export default Leaderboard;
