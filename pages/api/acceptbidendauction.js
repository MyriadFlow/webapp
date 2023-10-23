import { ethers } from "ethers";
import Tradhub from '../../artifacts/contracts/tradehub/TradeHub.sol/TradeHub.json';
import etherContract from "../../utils/web3Modal";

export const acceptbidendauction = async (nft, tradhubAddress) => {
  const tradhubContarct = await etherContract(tradhubAddress, Tradhub.abi)

  try {
    const transaction = await tradhubContarct.acceptBidAndEndAuction(nft.itemId);
    console.log(transaction);
    await transaction.wait();
  } catch (e) {
    console.log(e?.data?.message);
    console.error(e);
  }
};