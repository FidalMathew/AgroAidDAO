import { Container, chakra, Stack, Text, Button, Box, Heading } from '@chakra-ui/react';
import Navbar from "../components/Navbar"
import CardComponent from "../components/Cardcomponent"
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            <Navbar />
            <Box p={{ base: 8, sm: 14 }} mt="10">
                <Stack direction="column" m="auto" alignItems="center" w="70vw">
                    {/* <Heading
                        fontSize={'7xl'}
                        fontWeight="bold"
                        textAlign="center"
                        maxW="600px"
                    >
                        Create accessible React apps{' '}
                        <chakra.span color="teal">
                            with speed
                        </chakra.span>
                    </Heading>
                    <Text maxW="550px" fontSize="xl" textAlign="center" color="gray.500">
                        Chakra UI is a simple, modular and accessible component library that gives you the
                        building blocks you need to build your React applications.
                    </Text> */}
                    <Stack
                        direction={{ base: 'column', sm: 'row' }}
                        w={{ base: '100%', sm: 'auto' }}
                        spacing={5}
                    >
                        <Link to="/dao/3443"><Button
                            colorScheme="teal"
                            variant="outline"
                            rounded="md"
                            size="lg"
                            height="3.5rem"
                            fontSize="1.2rem"
                        >
                            Get Started
                        </Button></Link>
                    </Stack>
                </Stack>
            </Box>
        </>
    )
}

export default Home
