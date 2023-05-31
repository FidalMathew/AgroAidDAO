import { Container, chakra, Stack, Text, Button, Box, Heading, Image, FormControl, FormLabel, HStack, NumberInputField, NumberInputStepper, NumberIncrementStepper, Input, Textarea, Checkbox, Flex, useColorModeValue, VStack, FormErrorMessage, Card, CardBody } from '@chakra-ui/react';
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
                <Box h="100vh" w="50%" bg="#A4D79E">
                    <Image src="/pics/farmerbg.png" h="100vh" w="100%" fit={"cover"} />
                </Box>
                <VStack w="50%" h="100vh" p="10">
                    {/* form */}
                    <Text
                        bgGradient='linear(to-l,  #A4D79E, #357945)'
                        bgClip='text'
                        fontSize='5xl'
                        fontWeight='extrabold'
                        height="30%"
                    >
                        Welcome to AgriDAO
                    </Text>
                    <Card w="100%" m="auto" p="10">
                        <CardBody>
                            <Button
                                width="full"
                                mt={4}
                                loadingText="Submitting"
                                colorScheme="teal"
                                type="submit"
                            >
                                Join DAO
                            </Button>
                        </CardBody>
                    </Card>
                </VStack>
            </Flex>
        </>
    )
}

export default Home
