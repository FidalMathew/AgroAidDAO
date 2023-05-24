import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { Box } from '@chakra-ui/react'
import DAO from './pages/DAO'
function App() {

  return (
    <Box overflowX={"hidden"}>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* dynamic route for each dao page */}
        <Route path="/dao/:daoId" element={<DAO />} />
      </Routes>
    </Box>
  )
}

export default App
