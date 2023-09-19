import { ethers } from "ethers";
import SignatureSeries from '../../artifacts/contracts/signatureseries/SignatureSeries.sol/SignatureSeries.json';
import Tradehub from '../../artifacts/contracts/tradehub/TradeHub.sol/TradeHub.json';
import etherContract from "../../utils/web3Modal";

const tradhubAddress = process.env.NEXT_PUBLIC_TRADEHUB_ADDRESS;
const signatureaddress = "0xaD4296C0e35Eef8b8b9b7AC27D204f798B7A7FD2";

export const sellItem = async (nft, quantity, setmodel, setmodelmsg) => {
  const tradhubContarct = await etherContract(tradhubAddress, Tradehub.abi)
  const signatureContarct = await etherContract(signatureaddress, SignatureSeries.abi)
  // setmodel(true);
  try {
    const options = {
      value: ethers.BigNumber.from(nft.price).mul(quantity),
    };
    
    const signature = await signatureContarct.approve(tradhubAddress,nft.tokenId);
    const transaction = await tradhubContarct.listItem(nft.nftContract, nft.tokenId,nft.price, quantity,false,0);
    console.log(transaction);
    await transaction.wait();
    // setmodel(false);
  } catch (e) {
    console.log(e?.data?.message);
    console.error(e);
    // setmodelmsg(" Buying failed");
  }
};
