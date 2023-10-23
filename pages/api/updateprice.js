import { ethers } from "ethers";
import Tradhub from '../../artifacts/contracts/tradehub/TradeHub.sol/TradeHub.json';
import etherContract from "../../utils/web3Modal";

export const updatePrice = async (nft, tradhubAddress, updatesaleprice) => {
  const tradhubContarct = await etherContract(tradhubAddress, Tradhub.abi)

  try {
    const transaction = await tradhubContarct.updatePrice(nft.itemId,updatesaleprice);
    console.log(transaction);
    await transaction.wait();
  } catch (e) {
    console.log(e?.data?.message);
    console.error(e);
  }
};