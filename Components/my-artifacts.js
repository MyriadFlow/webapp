// /* pages/my-artifacts.js */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { FaEthereum } from "react-icons/fa";
import Link from "next/link";
import Layout from "./Layout";
import { selectUser } from "../slices/userSlice";
import { useSelector } from "react-redux";
import HomeComp from "./homeComp";
import HomeComp2 from "./homecomp2";
import Loader from "./Loader";
import { request, gql } from "graphql-request";

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHQL_API;

const MyAssets = () => {
  const walletAddr = useSelector(selectUser);
  var wallet = walletAddr ? walletAddr[0] : "";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wlt, setwlt] = useState();

  const fetchUserAssests = async (walletAddr) => {
    const query = gql`
    query Query($where: AssetCreated_filter) {
      assetCreateds(first:100, where:{creator: "${walletAddr}"}){
        id
        tokenID
        creator
        blockNumber
        blockTimestamp
        metaDataURI
      }
          }
          `;
    const result = await request(graphqlAPI, query);
    setLoading(true);
    setData(result.assetCreateds);
    setLoading(false);
    console.log(result);
  };
  function getEthPrice(price) {
    return ethers.utils.formatEther(price);
  }
  useEffect(() => {
    if (!localStorage.getItem("platform_wallet") && wallet !== undefined) {
      localStorage.setItem("platform_wallet", wallet);
    } else {
      setwlt(localStorage.getItem("platform_wallet"));
    }
    fetchUserAssests(`${localStorage.getItem("platform_wallet")}`);
  }, []);
console.log("My artifact Data",data);
  return (
    <div className="p-4 px-10 min-h-screen">
      <div className="p-4 mt-20  h-auto flex justify-center">
        {data?.length > 0 ? (
          data.map((item) => {
            console.log(item);
            return (
              <div
                key={item.id}
                className="bg-[white] dark:bg-[#1c1c24]  rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-800"
              >
                <Link key={item.itemId} href={`/create/${item.itemId}`}>
                  <div>
                    <HomeComp uri={item ? item.metaDataURI : ""} />

                    <div className="flex px-4 py-6">
                      <HomeComp2 uri={item ? item.metaDataURI : ""} />
                    </div>
                    {/* <div className=" flex items-center justify-between px-4 mb-2">
                    <p className="font-1 text-sm font-bold">Price </p>
                    <div className="flex items-center">
                      <FaEthereum className="h-4 w-4 text-blue-400" />
                      <p className="font-extralight dark:text-gray-400">
                        {getEthPrice(item.price)} MATIC
                      </p>
                    </div>
                  </div> */}
                  </div>
                </Link>
                {/* <div className="px-4 py-4 bg-gray-100 dark:bg-gray-700 flex justify-between">
                    <button
                      onClick={() => buyNft(nft)}
                      className="text-blue-500 hover:text-blue-400 font-bold"
                    >
                      Place asset to market
                    </button>
                  </div> */}
              </div>
            );
          })
        ) : loading ? (
          <Loader />
        ) : (
          <div className="text-xl pb-10 ">
            You haven&apos;t created any asset.
          </div>
        )}
      </div>
    </div>
  );
};
export default MyAssets;
