import Web3Modal from "web3modal";
import { ethers } from "ethers";
import Marketplace from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import WalletConnectProvider from "@walletconnect/web3-provider";

const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
export const buyNFT = async (nft, setmodel, setmodelmsg) => {
  /* needs the user to sign the transaction, so will use Web3Provider and sign it */
  // const web3Modal = new Web3Modal();
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
    cacheProvider: true,
    providerOptions,
    network: "testnet",
    version: "mumbai",
  });
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(
    marketplaceAddress,
    Marketplace.abi,
    signer
  );

  /* user will be prompted to pay the asking proces to complete the transaction */
  setmodel(true);
  try {
    const options = {
      value: ethers.BigNumber.from(nft.price),
    };
    const transaction = await contract.createMarketSale(nft.itemId, options);
    console.log(transaction);
    await transaction.wait();
    setmodel(false);
  } catch (e) {
    console.log(e?.data?.message);
    console.error(e);
    setmodelmsg(" Buying failed");
  }
};
