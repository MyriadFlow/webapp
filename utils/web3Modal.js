import Web3Modal from "web3modal";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

const etherContract=async(contractAddress,abi)=>{
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
    const web3Modal = new Web3Modal({
      network: "mainnet",
      providerOptions,
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    /* next, create the item */
    
   return new ethers.Contract(
      contractAddress,
      abi,
      signer
    );
    
}

export default etherContract