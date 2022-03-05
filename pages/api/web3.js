import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { marketplaceAddress, creatifyAddress } from "../../config";
import Creatify from "../../artifacts/contracts/Creatify.sol/Creatify.json";
import Marketplace from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";

export const handleConnect = async () => {
  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
  });
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();

  const marketContract = new ethers.Contract(
    marketplaceAddress,
    Marketplace.abi,
    signer
  );
  const tokenContract = new ethers.Contract(
    creatifyAddress,
    Creatify.abi,
    provider
  );
//   const data = await marketContract.fetchMyNFTs();

//   const items = await Promise.all(
//     data.map(async (i) => {
//       const tokenUri = await tokenContract.tokenURI(i.tokenId);
//       const meta = await axios.get(tokenUri);
//       let price = ethers.utils.formatUnits(i.price.toString(), "ether");
//       let item = {
//         price,
//         tokenId: i.tokenId.toNumber(),
//         seller: i.seller,
//         owner: i.owner,
//         image: meta.data.image,
//       };
//       return item;
//     })
//   );
};