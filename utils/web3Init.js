import WalletConnect from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
const providerOptions = {
  walletconnect: {
    package: WalletConnect,
    options: {
      infuraId: process.env.INFURA_KEY,
    
    },
  },
};
let web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions,
  });
}

export default web3Modal;
