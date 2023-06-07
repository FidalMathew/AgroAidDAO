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
import PrivateRoutes from './components/Protectedroute'
import Leaderboard from './pages/Leaderboard'
import JoinProtected from './components/JoinProtected'

function App() {

  return (
    <Box overflowX="hidden">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location" element={<Location />} />
        <Route element={<JoinProtected />}>
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/dao/" element={<DAO />} />
          <Route path="/proposal/:id" element={<Proposal />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/defaulter" element={<Connectwallet />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path="/connectwallet" element={<Connectwallet />} />
        </Route>
        <Route path="/*" element={<Error />} />
      </Routes>
    </Box>
  )
}

export default App
