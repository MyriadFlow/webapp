// /* pages/my-artifacts.js */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import Link from "next/link";
import { selectUser } from "../slices/userSlice";
import { useSelector } from "react-redux";
import HomeComp from "./homeComp";
import HomeComp2 from "./homecomp2";
import { useRouter } from "next/router";
import BuyAsset from "../Components/buyAssetModal";
import { request, gql } from "graphql-request";
import StoreFront from "../artifacts/contracts/StoreFront.sol/StoreFront.json";
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
const storeFrontAddress = process.env.NEXT_PUBLIC_STOREFRONT_ADDRESS;
const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHQL_API;

const MyAssets = () => {
  const walletAddr = useSelector(selectUser);
  var wallet = walletAddr ? walletAddr[0] : "";

  const router = useRouter();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [wlt, setwlt] = useState();
  const [formInput, updateFormInput] = useState({ price: "" });
  const [model, setmodel] = useState(false);
  const [modelmsg, setmodelmsg] = useState("Transaction in progress!");
  const [alertMsg, setAlertMsg] = useState("Something went wrong");

  const fetchUserAssests = async (walletAddr) => {
    const query = gql`
      query Query($where: MarketplaceItem_filter) {
        marketplaceItems(first: 100,where: {owner: "${walletAddr}"}) {
          itemId
          tokenId
          nftContract
          metaDataURI
          seller
          owner
          forSale
          activity
          blockTimestamp
          price
        }
      }
    `;

    const result = await request(graphqlAPI, query);
    setLoading(true);
    setData(result.marketplaceItems);
    setLoading(false);
  };
  useEffect(() => {
    if (!localStorage.getItem("platform_wallet") && wallet !== undefined) {
      localStorage.setItem("platform_wallet", wallet);
    } else {
      setwlt(localStorage.getItem("platform_wallet"));
    }
    fetchUserAssests(`${localStorage.getItem("platform_wallet")}`);
  }, []);

  const listItem = async (tokenId, price, signer) => {
    let contract;
    let transaction;
    console.table(price);
    console.log(tokenId);
    try {
      setmodelmsg("Transaction 2 in progress");
      contract = new ethers.Contract(
        marketplaceAddress,
        Marketplace.abi,
        signer
      );
      transaction = await contract.createMarketItem(
        storeFrontAddress,
        tokenId,
        price
      );
      await transaction.wait();
      console.log("transaction completed");
      setmodelmsg("Transaction 2 Complete !!");
    } catch (e) {
      console.log(e);
      setmodelmsg("Transaction 2 failed");
    }
  };

  async function placeNft(tokenId) {
    const { price } = formInput;
    console.log("price",price);
    if (!price) {
      setAlertMsg("Please Fill the Required Fields");
      setOpen(true);
      return;
    }
    setmodelmsg("Transaction in progress");
    setmodel(true);

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(
      storeFrontAddress,
      StoreFront.abi,
      signer
    );

    try {
      let transaction = await contract.createArtifact(url);
      let tx = await transaction.wait();
      setmodelmsg("Transaction 1 Complete");
      let event = tx.events[0]
      let value = event.args[2]
      let tokenId = value.toNumber()
      const price = ethers.utils.parseUnits(formInput.price, "ether");
      console.log(price);
      await listItem(tokenId, price, signer);
    } catch (e) {
      console.log(e);
      setmodelmsg("Transaction failed");
      return;
    }
    router.push("/explore");
  }

  return (
    <div className="p-4 px-10 min-h-screen gradient-blue">
      {model && <BuyAsset open={model} setOpen={setmodel} message={modelmsg} />}
      <div className=" p-4 mt-20  h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {
          data?.map((item) => {
            return (
              <div style={{border:"2px solid"}}
                key={item.itemId}
                className="bg-[white] dark:bg-[#1c1c24]  rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-800"
              >
                <Link key={item.itemId} href={`/assets/${item.itemId}`}>
                  <div>
                    <HomeComp uri={item ? item.metaDataURI : ""} />

                    {/* <div className="flex px-4 py-6">
                      <HomeComp2 uri={item ? item.metaDataURI : ""} />
                    </div> */}
                   
                  </div>
                </Link>
                <div className="form-item w-full">
                  <input
                    type="text"
                    placeholder="Asset Price in Matic"
                    className="w-full input_background bg-white dark:bg-gray-900 rounded-md shadow-sm p-3 outline-none "
                    onChange={(e) =>
                      updateFormInput({ ...formInput, price: e.target.value })
                    }
                  />
                </div>
                <div className="px-4 py-4 bg-gray-100 dark:bg-gray-700 flex justify-between">
                  <button
                    onClick={() => placeNft(item.itemId)}
                    className="text-blue-500 hover:text-blue-400 font-bold"
                  >
                    Place asset to market
                  </button>
                </div>
              </div>
            );
          })
         
        }
      </div>
    </div>
  );
};
export default MyAssets;
