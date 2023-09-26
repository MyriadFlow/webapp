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
import Tradhub from '../artifacts/contracts/tradehub/TradeHub.sol/TradeHub.json'
import Loader from "./Loader";
import { saleStartedQuery } from "../utils/gqlUtil";
import etherContract from "../utils/web3Modal";
const tradhubAddress="0x0E934430687780555A24638730c6FC864485322E";
const accessmasterAddress = "0x480A3DE285b221B5A44B60Bc017a3F06256c3a6e";
import { useData } from "../context/data";

import { useAccount } from "wagmi";

const MyAssets = () => {

  const walletAddr = useAccount().address;

  const { resdata } = useData();

  const graphql = resdata?.Storefront.subgraphUrl;
  console.log(graphql);

  const regex = /^(.*?)(?=\/graphql)/;

  // Use the regular expression to extract the URL
  const match = graphql?.match(regex);

  // Extract the matched URL or set it to null if no match was found
  const graphqlAPI = match ? match[0] : null;
  console.log(graphqlAPI);

  const router = useRouter();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [wlt, setwlt] = useState();
  const [formInput, updateFormInput] = useState({ price: "" });
  const [model, setmodel] = useState(false);
  const [modelmsg, setmodelmsg] = useState("Transaction in progress!");
  const [alertMsg, setAlertMsg] = useState("Something went wrong");

  const fetchUserAssests = async () => {
    const refineArray = {};
          refineArray.saleStarteds = [];

          const response = await fetch(`/api/selfsalegraph?walletAddress=${walletAddr}?subgraphUrl=${graphqlAPI}`);
          const result = await response.json();

          setLoading(true);

          const status = async () => {
            const tokenTimestampMap = {};

            for (const obj of result.saleStarteds) {
              const tradhubAddress = "0x1509f86D76A683B3DD9199dd286e26eb7d136519";
              const tradhubContarct = await etherContract(
                tradhubAddress,
                Tradhub.abi
              );
              const transaction = await tradhubContarct.idToMarketItem(obj.itemId);
              console.log("id" + obj.itemId);
              console.log("transaction", transaction);
              console.log("transaction", transaction.status == 1);

              if (transaction.status == 1) {
                // Check if tokenId exists in tokenTimestampMap
                if (!tokenTimestampMap[obj.itemId]) {
                  // If tokenId doesn't exist, add it with the current obj
                  tokenTimestampMap[obj.itemId] = obj;
                } else {
                  // If tokenId exists, compare timestamps and update if current obj has a more recent timestamp
                  const currentTimestamp = obj.blockTimestamp;
                  const existingTimestamp = tokenTimestampMap[obj.itemId].blockTimestamp;
                  if (currentTimestamp > existingTimestamp) {
                    tokenTimestampMap[obj.itemId] = obj;
                  }
                }
              }
      
              console.log("tokenTimestampMap", tokenTimestampMap);
              // Only add items with transaction.status equal to 1 to the filtered array
              // Iterate over tokenTimestampMap and push each object to refineArray.saleStarteds
              refineArray.saleStarteds = Object.values(tokenTimestampMap);
            }
          };
      
            await status();
            console.log(refineArray);
console.log("self sale assets count",refineArray.saleStarteds.length);
    setLoading(true);
    setData(refineArray.saleStarteds);
    setLoading(false);
  };
  useEffect(() => {
    fetchUserAssests();
  }, []);

  const listItem = async (tokenId, price) => {
    let transaction;
    console.table(price);
    try {
      setmodelmsg("Transaction 2 in progress");
      const tradhubContarct = await etherContract(tradhubAddress,Tradhub.abi)
      transaction = await tradhubContarct.listItem(accessmasterAddress, tokenId, price, false,0);
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
                <Link key={item?.itemId} href={`/assets/${item?.tokenId}`}>
                  <div>
                    <HomeComp uri={item ? item?.metaDataURI : ""} />
                  </div>
                </Link>
              
                <div className="flex justify-between mt-3 text-gray-500 dark:text-white">
                  <div className="font-bold">Wallet Address :</div>
                  <div className="text-xs">{item?.seller?.slice(-6)}</div>
                </div>
                <div className="px-4 py-4 bg-white  flex justify-center mt-3">
                  <button
                    onClick={() => placeNft(item?.tokenId)}
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
