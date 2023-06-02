import { Routes, Route,Router } from 'react-router-dom'
import Home from './pages/Home'
import { Box } from '@chakra-ui/react'
import DAO from './pages/DAO'
import Proposal from './pages/Proposal'
import Profile from './pages/Profile'
import Location from './pages/Location'
import Connectwallet from './pages/Connectwallet'
import useGlobalContext from './hooks/useGlobalContext'
import Error from './pages/Error'
import PrivateRoutes from './utils/PrivateRoutes'

function App() {
  
  return (
    <Box overflowX="hidden">
      {/* <Router> */}
        <Routes>
          <Route element={<PrivateRoutes/>}>
            <Route element={<Home/>} path="/" exact/>
          </Route>
            <Route element={<DAO/>} path="/dao"/>
          <Route element={<Connectwallet/>} path="/connectWallet" />
      </Routes>
      {/* </Router> */}
    </Box>
  )
}

export default App
