import { Container, chakra, Stack, Text, Button, Box, Heading, Image, FormControl, FormLabel, HStack, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, Input, Textarea, Checkbox, Flex, useColorModeValue } from '@chakra-ui/react';
import Navbar from "../components/Navbar"
import CardComponent from "../components/Cardcomponent"
import { FaGithub } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useGlobalContext from '../hooks/useGlobalContext';
import { useEffect } from 'react';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';

const Home = () => {
    const { currentAccount } = useGlobalContext()
    const navigate = useNavigate()
    useEffect(() => {
        // redirect to connect wallet page if not connected
        if (!currentAccount) {
            navigate("/connectwallet")
        }
    }, [])

    return (
        <>
            <Flex w="100vw" h="100vh">
                <Box>
                    <Image src="/pics/farmerimg.jpg" alt="farmer" height={"full"} fit={"cover"} />
                </Box>
                <HStack
                    spacing={"10"}
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <FormControl id="email">
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" />
                        </FormControl>
                        <FormControl id="password">
                            <FormLabel>Password</FormLabel>
                            <Input type="password" />
                        </FormControl>
                        <Stack spacing={10}>
                            <Stack
                                direction={{ base: 'column', sm: 'row' }}
                                align={'start'}
                                justify={'space-between'}>
                                <Checkbox>Remember me</Checkbox>
                                <Link color={'blue.400'}>Forgot password?</Link>
                            </Stack>
                            <Button
                                bg={'blue.400'}
                                color={'white'}
                                _hover={{
                                    bg: 'blue.500',
                                }}>
                                Sign in
                            </Button>
                        </Stack>
                    </Stack>
                </HStack>
            </Flex>
        </>
    )
}

export default Home
