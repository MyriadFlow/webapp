import { ethers } from "ethers";
import Tradhub from '../../artifacts/contracts/tradehub/TradeHub.sol/TradeHub.json';
import etherContract from "../../utils/web3Modal";

export const startAuction = async (nft, tradhubAddress, auctiontime) => {
  const tradhubContarct = await etherContract(tradhubAddress, Tradhub.abi)

  try {
    const transaction = await tradhubContarct.startAuction(nft.itemId,auctiontime);
    console.log(transaction);
    await transaction.wait();
  } catch (e) {
    console.log(e?.data?.message);
    console.error(e);
  }
};