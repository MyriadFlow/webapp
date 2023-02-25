import React from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import WalletConnect from "@walletconnect/web3-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { useState, useEffect } from "react";

import Layout from "../Components/Layout";
// const providerOptions = {
//   walletconnect: {
//     package: WalletConnect,
//     options: {
//       infuraId: process.env.NEXT_PUBLIC_RPC_PROVIDER,
//     },
//   },
// };
// let web3Modal;
// if (typeof window !== "undefined") {
//   web3Modal = new Web3Modal({
//     network: "mainnet",
//     cacheProvider: true,
//     providerOptions,
//   });
// }



const options = new WalletConnectProvider({
    rpc: {
      137: "https://rpc-mumbai.maticvigil.com/v1/f336dfba703440ee198bf937d5c065b8fe04891c",
    },
    rpcUrl:
      "https://rpc-mumbai.maticvigil.com/v1/f336dfba703440ee198bf937d5c065b8fe04891c",
    infuraId: process.env.INFURA_KEY,
  });
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: options,
    },
  };

 
let web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions,
    network: "testnet",
    version: "mumbai",
  });
}
export default function notConnectWallet() {
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState();
  const [error, setError] = useState("");

  const connectWallet = async () => {
    try {
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      setProvider(provider);
      if (accounts) {
        setAccount(accounts[0]);
      }
    } catch (error) {
      setError(error);
    }
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  };

  const refreshState = () => {
    setAccount(undefined);
  };




  useEffect(() => {
    const asyncFn = async () => {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      /* next, create the item */
    
    };
    asyncFn();
  }, []);
  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts) => {
        console.log("accountsChanged", accounts);
        if (accounts) setAccount(accounts[0]);
      };
      const handleDisconnect = () => {
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  return (
    <Layout>
    <div className="body-back">
      {!account ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            connectWallet();
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <button onClick={disconnect}>Disconnect</button>
      )}
    </div>
    </Layout>
  );
}
