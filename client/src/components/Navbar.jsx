import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Badge,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
  Switch,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import ToggleTheme from './Toggletheme';
import useGlobalContext from '../hooks/useGlobalContext';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Field, Formik } from 'formik';
import * as Yup from 'yup';
import { ethers } from 'ethers';
import useCurrentLocation from '../hooks/useCurrentLocation';

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const defaulterModal = useDisclosure()
  const contributeModal = useDisclosure()
  const navigate = useNavigate()
  const toast = useToast()
  const { currency } = useCurrentLocation()


  const { connectWallet, currentAccount, disconnectWallet, daoContract, togglePrice, isETHPrice } = useGlobalContext()
  // console.log(currentAccount, 'accountss')

  const [defaulters, setDefaulters] = useState([])
  useEffect(() => {
    if (currentAccount === undefined) {
      navigate('/')
    }
  }, [])

  useEffect(() => {
    const fetchDefaulters = async () => {
      try {
        if (daoContract) {
          const res = await daoContract.viewDefaulters();
          // res.map(async(defaulter)=>{
          //   const farmerDetails = await daoContract.members(defaulter);

          // })
          res.map(async (member
          ) => {
            const farmerDetails = await daoContract.members(member);
            console.log(farmerDetails, 'farmerDetails')
            setDefaulters(defaulters => [...defaulters, { address: member, loan: farmerDetails.loan }]);
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchDefaulters()
    console.log('defaulters', defaulters)
  }, [daoContract])

  const [contributeLoading, setContributeLoading] = useState(false)

  const ContributeDAO = async (amount) => {
    setContributeLoading(true)
    try {
      if (daoContract) {
        setContributeLoading(true)
        const transaction = await daoContract.fundDAO({
          value: ethers.utils.parseEther(amount.toString())
        });
        await transaction.wait()
        console.log(transaction)
        contributeModal.onClose()
        toast({
          title: 'Success',
          description: 'Contribution successful',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error',
        description: "Couldn't contribute",
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setContributeLoading(false)
    } finally {
      setContributeLoading(false)
    }
  }


  return (
    <>
      <Box w="100vw">
        <Flex
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.900')}
          align={'center'}>
          <Flex
            flex={{ base: 1, md: 'auto' }}
            ml={{ base: -2 }}
            display={{ base: 'flex', lg: 'none' }}>
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
              }
              variant={'ghost'}
              aria-label={'Toggle Navigation'}
            />
          </Flex>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <Text
              as={Link}
              to='/dao'
              textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
              fontFamily={'heading'}
              color={useColorModeValue('gray.800', 'white')}
              bgGradient='linear(to-r,  #A4D79E, #357945)'
              bgClip='text'
              fontSize='lg'
              fontWeight='extrabold'
            >
              AgroDAO
            </Text>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}>
            <Button onClick={togglePrice}>
              {
                !isETHPrice ? 'Toggle to ETH' : `Toggle to ${currency}`
              }
            </Button>

            <Button
              display={{ base: 'none', lg: 'inline-flex' }}
              fontSize={'sm'}
              fontWeight={600}
              colorScheme='teal'
              variant={'solid'}
              onClick={contributeModal.onOpen}
            >
              Contribute
            </Button>
            <Button
              display={{ base: 'none', lg: 'inline-flex' }}
              fontSize={'sm'}
              fontWeight={600}
              colorScheme='teal'
              variant={'outline'}
              onClick={defaulterModal.onOpen}
            >
              Defaulters
            </Button>

            <Link to="/leaderboard">
              <Button
                display={{ base: 'none', lg: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                colorScheme='teal'
                variant={'outline'}
              >
                Leaderboard
              </Button>
            </Link>
            {!currentAccount ?
              <Button
                onClick={connectWallet}
                as={'a'}
                display={'inline-flex'}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'green.400'}
                href={'#'}
                _hover={{
                  bg: 'green.300',
                }}>
                Connect wallet
              </Button>
              :
              <Menu>
                <MenuButton
                  as={Button}
                  display={'inline-flex'}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  bg={'green.400'}
                  _hover={{
                    bg: 'green.300',
                  }}
                >
                  {currentAccount.slice(0, 6) + '...' + currentAccount.slice(-4)}
                </MenuButton>
                <MenuList>
                  {/* Add menu items here */}
                  <Link to={currentAccount && `/profile/${currentAccount}`}><MenuItem>Profile</MenuItem></Link>
                  <MenuItem onClick={disconnectWallet}>Disconnect Wallet</MenuItem>
                </MenuList>
              </Menu>
            }
            <ToggleTheme />
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav defaulterModal={defaulterModal} contributeModal={contributeModal} />
        </Collapse>
      </Box>

      <Modal onClose={defaulterModal.onClose} size={'2xl'} isOpen={defaulterModal.isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>DAO Defaulters</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {
              defaulters.length > 0 ? (
                <TableContainer>
                  <Table variant='simple'>
                    {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
                    <Thead>
                      <Tr>
                        <Th>Addresses</Th>
                        <Th>Loan</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {defaulters.map((defaulter, index) => (
                        <Tr key={index}>
                          <Td>{defaulter.address}</Td>
                          <Td>{defaulter.loan}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              ) : (
                <Text textAlign={'center'}>No defaulters</Text>
              )
            }
          </ModalBody>
          <ModalFooter>
            {/* <Button onClick={defaulterModal.onClose}>Close</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal onClose={contributeModal.onClose} size={'2xl'} isOpen={contributeModal.isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Contribute DAO</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ amount: '' }}
              validationSchema={Yup.object({
                amount: Yup.number().min(0, 'Amount can not be less than zero').required('Amount is required')
              })}
              onSubmit={(values, action) => {
                ContributeDAO(values.amount)
                console.log(values)
                action.resetForm()
              }}
            >
              {
                (formik) => (
                  <form onSubmit={formik.handleSubmit}>
                    <FormControl id="amount"
                      isInvalid={formik.errors.amount && formik.touched.amount}
                    >
                      <FormLabel>Amount</FormLabel>
                      <Field
                        type="number"
                        name="amount"
                        placeholder="Enter amount"
                        as={Input}
                      />
                      <FormErrorMessage>{formik.errors.amount}</FormErrorMessage>
                    </FormControl>
                    <Button
                      mt={4}
                      colorScheme="teal"
                      loadingText="Contributing..."
                      isLoading={contributeLoading}
                      type="submit"
                    >
                      Contribute
                    </Button>
                  </form>
                )
              }
            </Formik>
          </ModalBody>
          <ModalFooter>
            {/* <Button onClick={defaulterModal.onClose}>Close</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

const MobileNav = ({ defaulterModal, contributeModal }) => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ lg: 'none' }}>
      <MobileNavItem text={"Leaderboard"} link={`/leaderboard`} />
      <MobileNavItem text={"Defaulters"} onClickfunction={defaulterModal.onOpen} />
      <MobileNavItem text={"Contribute"} onClickfunction={contributeModal.onOpen} />
    </Stack>
  );
};

const MobileNavItem = ({ text, onClickfunction, link }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={onToggle}>
      <Flex
        py={2}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}>
        {onClickfunction && (
          <Text
            onClick={onClickfunction}
            cursor={'pointer'}
            fontWeight={600}
            color={useColorModeValue('gray.600', 'gray.200')}
          >{text}</Text>
        )}

        {link && (
          <Text as={Link} to={link}
            fontWeight={600}
            color={useColorModeValue('gray.600', 'gray.200')}
          >{text}</Text>
        )
        }
      </Flex>
    </Stack>
  );
};
