import { Button, HStack, Heading } from '@chakra-ui/react';
import './App.css';
import * as fcl from "@onflow/fcl"
import { useState, useEffect } from 'react';
import ToggleTheme from './components/Toggletheme';

fcl.config()
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

function App() {

  const [user, setUser] = useState()

  useEffect(() => {
    fcl.currentUser().subscribe(setUser)
  }, [])


  const logIn = () => {
    fcl.authenticate()
  }
  return (
    <div className="App">
      <ToggleTheme />
      <Heading>Account Address: {user && user.addr ? user.addr : ''}</Heading>
      <HStack justifyContent={"center"} spacing={"10"}>
        <Button onClick={() => logIn()}>Log In</Button>
        <Button onClick={() => fcl.unauthenticate()}>Log Out</Button>
      </HStack>
    </div>
  );
}

export default App;
