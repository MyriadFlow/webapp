import Web3Modal from "web3modal";
import { ethers } from "ethers";
import StoreFront from "../../artifacts/contracts/StoreFront.sol/StoreFront.json";
import Marketplace from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";

const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
const storeFrontAddress = process.env.NEXT_PUBLIC_STOREFRONT_ADDRESS;

export const handleConnect = async () => {

  const web3Modal = new Web3Modal({
    network: "mumbai",
    cacheProvider: true,
  });
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const marketContract = new ethers.Contract(
    marketplaceAddress,
    Marketplace.abi,
    signer
  );
  const tokenContract = new ethers.Contract(
    storeFrontAddress,
    StoreFront.abi,
    provider
  );

};