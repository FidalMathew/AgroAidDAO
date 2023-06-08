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
            display={{ base: 'flex', md: 'none' }}>
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
              color={useColorModeValue('gray.800', 'white')}>
              AgriDAO
            </Text>

            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav />
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}>
            <Button onClick={togglePrice}>
              {
                isETHPrice ? 'Toggle to ETH' : `Toggle to ${currency}`
              }
            </Button>

            <Button
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize={'sm'}
              fontWeight={600}
              colorScheme='teal'
              variant={'solid'}
              onClick={contributeModal.onOpen}
            >
              Contribute
            </Button>
            <Button
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize={'sm'}
              fontWeight={600}
              colorScheme='teal'
              variant={'outline'}
              onClick={contributeModal.onOpen}
            >
              Defaulters
            </Button>

            <Link to="/leaderboard">
              <Button
                display={{ base: 'none', md: 'inline-flex' }}
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
          <MobileNav />
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

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Stack direction={'row'} spacing={4}>
      {/* {NAV_ITEMS.map((navItem) => (
          <Box key={navItem.label}>
            <Popover trigger={'hover'} placement={'bottom-start'}>
              <PopoverTrigger>
                <Link
                  p={2}
                  href={navItem.href ?? '#'}
                  fontSize={'sm'}
                  fontWeight={500}
                  color={linkColor}
                  _hover={{
                    textDecoration: 'none',
                    color: linkHoverColor,
                  }}>
                  {navItem.label}
                </Link>
              </PopoverTrigger>
  
              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow={'xl'}
                  bg={popoverContentBgColor}
                  p={4}
                  rounded={'xl'}
                  minW={'sm'}>
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
                    ))}
                  </Stack>
                </PopoverContent>
              )}
            </Popover>
          </Box>
        ))} */}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: 'pink.400' }}
            fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}>
          <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}>
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}>
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}>
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}>
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};


const NAV_ITEMS = [
  {
    label: 'Inspiration',
    children: [
      {
        label: 'Explore Design Work',
        subLabel: 'Trending Design to inspire you',
        href: '#',
      },
      {
        label: 'New & Noteworthy',
        subLabel: 'Up-and-coming Designers',
        href: '#',
      },
    ],
  },
  {
    label: 'Find Work',
    children: [
      {
        label: 'Job Board',
        subLabel: 'Find your dream design job',
        href: '#',
      },
      {
        label: 'Freelance Projects',
        subLabel: 'An exclusive list for contract work',
        href: '#',
      },
    ],
  },
  {
    label: 'Learn Design',
    href: '#',
  },
  {
    label: 'Hire Designers',
    href: '#',
  },
];