import Web3Modal from "web3modal";
import { ethers } from "ethers";
// import { storeFrontAddress, marketplaceAddress } from "../../config";
import StoreFront from "../../artifacts/contracts/StoreFront.sol/StoreFront.json";
import Marketplace from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";

const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
const storeFrontAddress = process.env.NEXT_PUBLIC_STOREFRONT_ADDRESS;

export const buyNFT = async (nft, setmodel, setmodelmsg) => {

  /* needs the user to sign the transaction, so will use Web3Provider and sign it */
  const web3Modal = new Web3Modal();
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
    const transaction = await contract.createMarketSale(
      storeFrontAddress,
      nft.itemId,
      options
    );
    console.log(transaction);
    await transaction.wait();
    setmodel(false);
  } catch (e) {
    console.log(e?.data?.message);
    console.error(e);
    setmodelmsg(" Buying failed");
  }
};
