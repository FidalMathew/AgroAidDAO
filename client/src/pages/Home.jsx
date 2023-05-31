import { Container, chakra, Stack, Text, Button, Box, Heading, Image, FormControl, FormLabel, HStack, NumberInputField, NumberInputStepper, NumberIncrementStepper, Input, Textarea, Checkbox, Flex, useColorModeValue, VStack, FormErrorMessage, Card, CardBody, FormHelperText, Icon } from '@chakra-ui/react';
import Navbar from "../components/Navbar"
import CardComponent from "../components/Cardcomponent"
import { CiLocationOn } from 'react-icons/ci';
import { Link, useNavigate } from 'react-router-dom';
import useGlobalContext from '../hooks/useGlobalContext';
import { useEffect } from 'react';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';
import useCurrentLocation from '../hooks/useCurrentLocation';
import { LockIcon } from '@chakra-ui/icons';

const Home = () => {
    const { currentAccount, joinLoading, joinDAO } = useGlobalContext()
    const navigate = useNavigate()


    useEffect(() => {
        if (currentAccount === undefined) {
            navigate('/connectwallet')
        }
    }, [currentAccount])

    const { latitude, longitude } = useCurrentLocation()

    // console log the current location
    useEffect(() => {
        if (latitude && longitude) {
            console.log(latitude, longitude, 'location')
        }
    }, [latitude, longitude])

    return (
        <>
            <Flex w="100vw" h="100vh">
                <Box h="100vh" w="50%" bg="#A4D79E">
                    <Image src="/pics/farmerimg.png" h="100vh" w="100%" fit={"cover"} />
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
                    <Card w={{base: "100%", lg:"80%"}} m="auto" p="10">
                        <CardBody>
                            <Formik
                                initialValues={{
                                    name: "",
                                }}
                                validationSchema={Yup.object({
                                    name: Yup.string()
                                        .max(15, 'Must be 15 characters or less')
                                        .required('Required'),
                                })}
                                onSubmit={(values, action) => {
                                    // make a json with values and lat long embedded
                                    const data = {
                                        name: values.name,
                                        latitude: latitude,
                                        longitude: longitude
                                    }
                                    console.log(data, 'data')
                                    action.resetForm()
                                    joinDAO(latitude, longitude, values.name)
                                    // navigate("/dao")
                                }}>
                                {
                                    (formik) => (
                                        <form onSubmit={formik.handleSubmit}>
                                            <FormControl
                                                isInvalid={formik.errors.name && formik.touched.name}
                                            >
                                                <FormLabel id="name">Name</FormLabel>
                                                <Field
                                                    as={Input}
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    placeholder="Enter your name"
                                                    {...formik.getFieldProps('name')}
                                                />
                                                <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                                                {/* icon and text horizontally centered */}
                                                <HStack p="2" mt="3">
                                                    <Icon as={CiLocationOn} />
                                                    <FormHelperText>
                                                        Latitude: <chakra.span fontWeight={"semibold"}>{latitude}</chakra.span>{" "}
                                                        Longitude:<chakra.span fontWeight={"semibold"}> {longitude}</chakra.span>
                                                    </FormHelperText>
                                                </HStack>
                                            </FormControl>
                                            <Button
                                                width="full"
                                                mt={4}
                                                loadingText="Submitting"
                                                colorScheme="teal"
                                                type="submit"
                                            >
                                                Join DAO
                                            </Button>
                                        </form>
                                    )
                                }

                            </Formik>

                        </CardBody>
                    </Card>
                </VStack>
            </Flex>
        </>
    )
}

export default Home