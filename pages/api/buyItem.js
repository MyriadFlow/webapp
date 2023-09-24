import { ethers } from "ethers";
import Tradhub from '../../artifacts/contracts/tradehub/TradeHub.sol/TradeHub.json';
import etherContract from "../../utils/web3Modal";

const tradhubAddress = "0x1509f86D76A683B3DD9199dd286e26eb7d136519";
export const buyItem = async (nft, quantity, setmodel, setmodelmsg) => {
  const tradhubContarct = await etherContract(tradhubAddress, Tradhub.abi)
  // setmodel(true);
  try {
    const options = {
      value: ethers.BigNumber.from(nft.price).mul(quantity),
    };
    const transaction = await tradhubContarct.buyItem(nft.itemId, quantity, options);
    console.log(transaction);
    await transaction.wait();
    // setmodel(false);
  } catch (e) {
    console.log(e?.data?.message);
    console.error(e);
    // setmodelmsg(" Buying failed");
  }
};
