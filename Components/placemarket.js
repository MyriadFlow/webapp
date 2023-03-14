// /* pages/my-artifacts.js */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import Link from "next/link";
import { selectUser } from "../slices/userSlice";
import { useSelector } from "react-redux";
import HomeComp from "./homeComp";
import { useRouter } from "next/router";
import BuyAsset from "../Components/buyAssetModal";
import { request } from "graphql-request";
import StoreFront from "../artifacts/contracts/StoreFront.sol/StoreFront.json";
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
import Loader from "./Loader";
import { saleStartedQuery } from "../utils/gqlUtil";
import etherContract from "../utils/web3Modal";
const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
const storeFrontAddress = process.env.NEXT_PUBLIC_STOREFRONT_ADDRESS;
const graphqlAPI = process.env.NEXT_PUBLIC_MARKETPLACE_API;

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
    const result = await request(graphqlAPI, saleStartedQuery,{where:{seller:walletAddr }});
    setLoading(true);
    setData(result.saleStarteds);
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

  const listItem = async (tokenId, price) => {
    let transaction;
    console.table(price);
    try {
      setmodelmsg("Transaction 2 in progress");
      const marketPlacecontract = await etherContract(marketplaceAddress,Marketplace.abi)
      transaction = await marketPlacecontract.listItem(storeFrontAddress, tokenId, price, false,0);
      await transaction.wait();
      setmodelmsg("Transaction 2 Complete !!");
    } catch (e) {
      console.log(e);
      setmodelmsg("Transaction 2 failed");
    }
  };

  async function placeNft(tokenId) {
    const { price } = formInput;
    if (!price) {
      setAlertMsg("Please Fill the Required Fields");
      setOpen(true);
      return;
    }
    setmodelmsg("Transaction in progress");
    setmodel(true);

    

    try {
      
      const price = ethers.utils.parseUnits(formInput.price, "ether");
      await listItem(tokenId, price);
    } catch (e) {
      console.log(e);
      setmodelmsg("Transaction failed");
      return;
    }
    router.push("/explore");
  }

  return (
    <div className="p-4 px-10 min-h-screen body-back">
      {model && <BuyAsset open={model} setOpen={setmodel} message={modelmsg} />}
      <div className=" p-4 mt-20  h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {data.length > 0 ? (
          data?.map((item) => {
            return (
              <div
                key={item.itemId}
                className=" border-2 p-2.5 dark:bg-[#1c1c24]  rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-800"
              >
                <Link key={item.itemId} href={`/assets/${item.tokenId}`}>
                  <div>
                    <HomeComp uri={item ? item.metaDataURI : ""} />
                  </div>
                </Link>
              
                <div className="flex justify-between mt-3 text-gray-500 dark:text-white">
                  <div className="font-bold">Wallet Address :</div>
                  <div className="text-xs">{item.seller.slice(-6)}</div>
                </div>
                <div className="px-4 py-4 bg-white  flex justify-center mt-3">
                  <button
                    onClick={() => placeNft(item.tokenId)}
                    className="text-blue-500 hover:text-blue-400 font-bold"
                  >
                    Manage
                  </button>
                </div>
              </div>
            );
          })
        ) : loading ? (
          <Loader />
        ) : (
          <div className="text-2xl pb-10 font-bold text-center">
            You haven&apos;t Place any item on market.
          </div>
        )}
      </div>
    </div>
  );
};
export default MyAssets;
