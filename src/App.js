import './App.css';
import * as fcl from "@onflow/fcl"
import { useState, useEffect } from 'react';

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
      <h1>Account Address: {user && user.addr ? user.addr : ''}</h1>
      <button onClick={() => logIn()}>Log In</button>
      <button onClick={() => fcl.unauthenticate()}>Log Out</button>
    </div>
  );
}

export default App;
