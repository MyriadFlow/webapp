import { ethers } from "ethers";
import SignatureSeries from '../../artifacts/contracts/signatureseries/SignatureSeries.sol/SignatureSeries.json';
import Tradehub from '../../artifacts/contracts/tradehub/TradeHub.sol/TradeHub.json';
import etherContract from "../../utils/web3Modal";

const tradhubAddress = process.env.NEXT_PUBLIC_TRADEHUB_ADDRESS;


export const sellItem = async (nft, quantity,price, setmodel, setmodelmsg) => {
  const signatureaddress = nft.nftContract;
  const tradhubContarct = await etherContract(tradhubAddress, Tradehub.abi)
  const signatureContarct = await etherContract(signatureaddress, SignatureSeries.abi)
  // setmodel(true);
  try {
    const options = {
      value: ethers.BigNumber.from(price).mul(quantity),
    };
    
    const signature = await signatureContarct.approve(tradhubAddress,nft.tokenId);
    const transaction = await tradhubContarct.listItem(nft.nftContract, nft.tokenId,price, quantity,false,0);
    console.log(transaction);
    await transaction.wait();
    // setmodel(false);
  } catch (e) {
    console.log(e?.data?.message);
    console.error(e);
    // setmodelmsg(" Buying failed");
  }
};
