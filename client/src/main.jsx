import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import { extendTheme } from "@chakra-ui/react"
import DAOContextprovider from './context/DAOContext.jsx'

const theme = extendTheme({
  initialColorMode: "dark",
  useSystemColorMode: false,
  colors: {
    light: {},
    dark: {}
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <DAOContextprovider>
      <ChakraProvider theme={theme}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ChakraProvider>
    </DAOContextprovider>
  </BrowserRouter>
)
