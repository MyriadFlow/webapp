import React, { useState } from 'react'

import {
  useMetamask,
  useWalletConnect,
  useCoinbaseWallet,
  useNetwork,
  useAddress,
  useDisconnect,
} from '@thirdweb-dev/react';
import { useTheme } from "next-themes";

export const ConnectWallet = () => {
  const { theme, setTheme } = useTheme()

  const [toggle, setToggle] = useState(false)

  const connectWithCoinbaseWallet = useCoinbaseWallet();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const disconnectWallet = useDisconnect();
  const address = useAddress();
  const network = useNetwork();

  // If a wallet is connected, show address, chainId and disconnect button
  if (address) {
    return (
      <div>
        Address: {address}
        <br />
        Chain ID: {network[0].data.chain && network[0].data.chain.id}
        <br />
        <button onClick={disconnectWallet}>Disconnect</button>
      </div>
    );
  }

  // If no wallet is connected, show connect wallet options
  return (
    
    <div>
      
        <button className='ml-3' style={{background: "#f213a4",color:"white",padding:"10px 30px 10px 30px",borderRadius:"10px",fontSize:"14px",marginTop:"128px"}} onClick={() => setToggle(!toggle)}>Connect Wallet</button>
    
      {toggle && (  <div style={{border:"1px solid #f213a4",background:"black",color:"white",padding:"10px",borderRadius:"10px",marginTop:"6px",marginTop:"65px",marginTop:"4px"}}>
      <div className=''>
      <button onClick={() => connectWithCoinbaseWallet()}>
         Coinbase Wallet
      </button>
      </div>
     <div className=''>
     <button className='mt-3' onClick={() => connectWithMetamask()}> MetaMask</button>

     </div>
     <div className=''>
     <button className='mt-3' onClick={() => connectWithWalletConnect()}>
        WalletConnect
      </button>
     </div>
     <div className='mt-3'>
     <select style={{width:"100%",padding:"6px",borderRadius:"10px"}} className='text-pink-600 font-bold bg-white border-none ...'  value={theme} onChange={e => setTheme(e.target.value)}>
      <option className='font-bold' value="dark">Dark</option>
      <option className='font-bold' value="light">Light</option>
     </select>

     
    </div>
     </div>
      )}
    </div>
  );
};