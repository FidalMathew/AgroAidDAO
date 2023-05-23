import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import { Box } from '@chakra-ui/react'
function App() {

  return (
    <Box overflowX={"hidden"}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Box>
  )
}

export default App
