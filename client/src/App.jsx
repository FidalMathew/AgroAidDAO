import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import { Box } from '@chakra-ui/react'
import DAO from './pages/DAO'
import Proposal from './pages/Proposal'
import Profile from './pages/Profile'
import Location from './pages/Location'
import Connectwallet from './pages/Connectwallet'
import useGlobalContext from './hooks/useGlobalContext'

function App() {
  const { currentAccount } = useGlobalContext()

  if (!currentAccount) {
    return (
      <Box overflowX="hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/location" element={<Location />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/dao/:daoId" element={<DAO />} />
          <Route path="/dao/:daoId/:id" element={<Proposal />} />
          <Route path="/connectwallet" element={<Connectwallet />} />
          <Route path="/*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    )
  } else {
    return (
      <Box overflowX="hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/location" element={<Location />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/dao/" element={<DAO />} />
          <Route path="/proposal/:id" element={<Proposal />} />
          <Route path="/*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    )
  }
}

export default App
