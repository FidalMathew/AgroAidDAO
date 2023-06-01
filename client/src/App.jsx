import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import { Box } from '@chakra-ui/react'
import DAO from './pages/DAO'
import Proposal from './pages/Proposal'
import Profile from './pages/Profile'
import Location from './pages/Location'
import Connectwallet from './pages/Connectwallet'
import useGlobalContext from './hooks/useGlobalContext'
import Error from './pages/Error'

function App() {
  
  return (
    <Box overflowX="hidden">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location" element={<Location />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/dao/" element={<DAO />} />
        <Route path="/dao/:id" element={<Proposal />} />
        <Route path="/connectwallet" element={<Connectwallet />} />
        <Route path="/*" element={<Error />} />
      </Routes>
    </Box>
  )
}

export default App
