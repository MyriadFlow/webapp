import { ethers } from "ethers";
import SignatureSeries from '../../artifacts/contracts/signatureseries/SignatureSeries.sol/SignatureSeries.json';
import FusionSeries from '../../artifacts/contracts/fusionseries/FusionSeries.sol/FusionSeries.json';
import InstaGen from '../../artifacts/contracts/instagen/InstaGen.sol/InstaGen.json';
import EternumPass from '../../artifacts/contracts/eturnumpass/EternumPass.sol/EternumPass.json';
import Tradehub from '../../artifacts/contracts/tradehub/TradeHub.sol/TradeHub.json';
import etherContract from "../../utils/web3Modal";

// const tradhubAddress = "0x2B6c5bd1da04BCcf7186879288a0E6dF266BcA17";


export const sellItem = async (nft, quantity,price, setmodel, setmodelmsg,tradhubAddress) => {
  const signatureaddress = nft.nftContract;
  const tradhubContarct = await etherContract(tradhubAddress, Tradehub.abi)
  const signatureContarct = await etherContract(signatureaddress, SignatureSeries.abi)
  const fusionContarct = await etherContract(signatureaddress, FusionSeries.abi)
  const instagenContarct = await etherContract(signatureaddress, InstaGen.abi)
  const eternumContarct = await etherContract(signatureaddress, EternumPass.abi)
  // setmodel(true);
  try {
    const options = {
      value: ethers.BigNumber.from(price).mul(quantity),
    };
    
    const signature = await signatureContarct.approve(tradhubAddress,nft.tokenId);
    const transaction = await tradhubContarct.listItem(nft.nftContract, nft.tokenId,price, quantity,false,0);

    //fusionseries only-
    //  const value =  ethers.BigNumber.from(price).mul(quantity)
    // const signature = await signatureContarct.approve(tradhubAddress,nft.tokenId);
    // const transaction = await tradhubContarct.listItem(nft.nftContract, nft.tokenId, value, quantity,false,0);
    console.log(transaction);
    await transaction.wait();
    // setmodel(false);
  } catch (e) {
    console.log(e?.data?.message);
    console.error(e);
    // setmodelmsg(" Buying failed");
  }
};
