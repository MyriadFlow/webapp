import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { creatifyAddress, marketplaceAddress } from "../../config";
import Creatify from "../../artifacts/contracts/Creatify.sol/Creatify.json";
import Marketplace from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";

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
    
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    // const price = nft.price

    const transaction = await contract.createMarketSale(
      creatifyAddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    await transaction.wait();
    setmodel(false);
  } catch (e) {
    console.log(e?.data?.message);
    setmodelmsg(" Buying failed");
  }
};