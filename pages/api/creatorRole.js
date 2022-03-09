import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { creatifyAddress, marketplaceAddress } from "../../config";
import Marketplace from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";

// export const buyNFT = async (nft, setmodel, setmodelmsg) => {
//   const web3Modal = new Web3Modal();
//   const connection = await web3Modal.connect();
//   const provider = new ethers.providers.Web3Provider(connection);
//   const signer = provider.getSigner();
//   const contract = new ethers.Contract(
//     marketplaceAddress,
//     Marketplace.abi,
//     signer
//   );
//   setmodel(true);
//   try {
    
//     const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

//     const transaction = await contract.createMarketSale(
//       creatifyAddress,
//       nft.tokenId,
//       {
//         value: price,
//       }
//     );
//     await transaction.wait();
//     setmodel(false);
//   } catch (e) {
//     console.log(e?.data?.message);
//     setmodelmsg(" Buying failed");
//   }
// };


export const buyNFT = async () => {
var axios = require('axios');
var data = '';

var config = {
  method: 'get',
  url: 'marketplace-engine.lazarus.network/flowid?walletAddress=0x313bfad1c87946bf893e2ecad141620eaa54943a',
  headers: { 
    'Authorization': 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ3YWxsZXRBZGRyZXNzIjoiMHhBMzEzOTQ5MjE2YmY0QmRiQ2RhZDNCRUI4ZTc4M2RhQzIxY0Y1MzIwIiwiZXhwIjoxNjQzNTA0MTczfQ.aCwJTd0xWt2LdZeAy_niGkzJiLOXR9TINL1OVZo2zm6i9WNDaBhDAIbKWcMQMWPZq_c-IH289g_gbwydr2hHOw'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
}