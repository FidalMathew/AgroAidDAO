const backup = () => {
    return (
        <div>
            {/* members */}
            <VStack maxW="70vh" overflowY="scroll" className="members-list" minW="xs" border="1px solid" borderColor="gray.400" rounded="md" overflow="hidden" spacing={0} display={{ base: "none", lg: "flex" }}>
                <Heading size="sm" p={4}>Members</Heading>
                {articles.map((article, index) => (
                    <Fragment key={index}>
                        <Box
                            w="100%"
                            p={{ base: 2, sm: 4 }}
                            gap={3}
                            alignItems="center"
                        // _hover={{ bg: useColorModeValue('gray.200', 'gray.700') }}
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
                <Formik
                    initialValues={{
                        title: '',
                        description: '',
                        askForPayment: false,
                        amount: 1,
                    }}

                    validationSchema={Yup.object(
                        {
                            title: Yup.string().required('Title is required'),
                            description: Yup.string().required('Description is required'),
                            askForPayment: Yup.boolean(),
                            amount: Yup.number().min(1, 'Amount must be greater than 0').required('Amount is required'),
                        }
                    )}

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
                                        <Field name="inputValue">
                                            {({ field, form }) => (
                                                <div>
                                                    <NumberInput
                                                        {...field}
                                                        defaultValue={1}
                                                        placeholder="Enter amount.."
                                                        isDisabled={!checked}
                                                        clampValueOnBlur={false}
                                                        min={1}
                                                        max={6}
                                                    >
                                                        <NumberInputField />
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                    <FormErrorMessage fontSize="xs">{formik.errors.amount}</FormErrorMessage>
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

            <Flex justifyContent={"center"} w="100vw" m="auto" flexDir={{ base: "column", sm: "row" }} alignItems={"center"} p={{ base: 5, md: 10 }}>



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




            <HStack w="100%" spacing="10" style={{ margin: '2rem' }}>
                <Card border="1px solid" borderColor={useColorModeValue('gray.800', 'gray.500')} rounded="lg" w='100%' h='35vh' bg={useColorModeValue('whiteAlpha.100', 'blackAlpha.400')}>
                    <CardBody >
                        <Text textAlign={'left'} fontSize={'sm'} fontWeight={'semibold'}>Proposals</Text>
                        <VStack >
                            <Box rounded="xl" mt="5" w="full">
                                <Text textAlign={'left'} fontSize={'md'} fontWeight={'semibold'}>Election</Text>
                                <Text textAlign={'left'} fontSize={'sm'} fontWeight={'normal'}>Request for Loan</Text>
                                <Progress value={80} mt="3" size="sm" />
                            </Box>
                        </VStack>
                    </CardBody>
                </Card>
                <Card border="1px solid" borderColor={useColorModeValue('gray.800', 'gray.500')} rounded="lg" w='100%' h='35vh' bg={useColorModeValue('whiteAlpha.100', 'blackAlpha.400')}>
                    <CardBody>
                        <Text textAlign={'left'} fontSize={'xl'} fontWeight={'semibold'}>Proposals</Text>
                    </CardBody>
                </Card>
            </HStack>

            <Fragment key={index}>
                <Box
                    w="100%"
                    p={{ base: 2, sm: 4 }}
                    gap={3}
                    alignItems="center"
                >
                    <Center flexDirection="column">
                        <chakra.h3 fontWeight="bold" fontSize="lg">
                            {article[6]} {/* Access the name value */}
                        </chakra.h3>
                        <chakra.p
                            fontWeight="medium"
                            fontSize="sm"
                            color={useColorModeValue('gray.600', 'gray.300')}
                        >
                            Address: {article[0]} {/* Access the address value */}
                        </chakra.p>
                    </Center>
                </Box>
                {articles.length - 1 !== index && <Divider m={0} />}
            </Fragment>

            <CardBody>
                            {!joined && (
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
                                        const data = {
                                            name: values.name,
                                            latitude: latitude,
                                            longitude: longitude
                                        }
                                        console.log(data, 'data')
                                        action.resetForm()
                                        join(latitude, longitude, values.name)
                                    }}
                                >
                                    {(formik) => (
                                        <form onSubmit={formik.handleSubmit}>
                                            {/* Rest of the form fields */}
                                            <Button
                                                width="full"
                                                isLoading={joinLoading}
                                                mt={4}
                                                loadingText="Submitting"
                                                colorScheme="teal"
                                                type="submit"
                                            >
                                                Join DAO
                                            </Button>
                                        </form>
                                    )}
                                </Formik>
                            )}

                            {joined && (
                                <Button
                                    width="full"
                                    mt={4}
                                    colorScheme="teal"
                                    onClick={() => navigate("/dao")}
                                >
                                    Go to DAO
                                </Button>
                            )}
                        </CardBody>
        </div>
    )
}

export default backup
