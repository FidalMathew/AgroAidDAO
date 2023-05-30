import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { Box } from '@chakra-ui/react'
import DAO from './pages/DAO'
import Proposal from './pages/Proposal'
import Profile from './pages/Profile'
import Location from './pages/Location'
function App() {

  return (
    <Box overflowX={"hidden"}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location" element={<Location />} />
        <Route path="/:id" element={<Profile />} />
        {/* dynamic route for each dao page */}
        <Route path="/dao/:daoId" element={<DAO />} />
        <Route path="/dao/:daoId/:id" element={<Proposal />} />
      </Routes>
    </Box>
  )
}

export default App
