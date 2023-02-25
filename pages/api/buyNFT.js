import { ethers } from "ethers";
import Marketplace from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";
import etherContract from "../../utils/web3Modal";

const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
export const buyNFT = async (nft, setmodel, setmodelmsg) => {
  const marketPlaceContarct = await etherContract(marketplaceAddress, Marketplace.abi)
  setmodel(true);
  try {
    const options = {
      value: ethers.BigNumber.from(nft.price),
    };
    const transaction = await marketPlaceContarct.buyItem(nft.itemId, options);
    console.log(transaction);
    await transaction.wait();
    setmodel(false);
  } catch (e) {
    console.log(e?.data?.message);
    console.error(e);
    setmodelmsg(" Buying failed");
  }
};
