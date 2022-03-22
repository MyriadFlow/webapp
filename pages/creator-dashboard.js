/* pages/creator-dashboard.js */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { FaEthereum } from "react-icons/fa";

// import { marketplaceAddress, creatifyAddress } from "../config";
import Link from "next/link";
import Creatify from "../artifacts/contracts/Creatify.sol/Creatify.json";
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
import Layout from "../Components/Layout";
import { selectUser } from "../slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import HomeComp from "../Components/homeComp";
import HomeComp2 from "../Components/homecomp2";
import BoughtItems from "../Components/nftboughtDashboard";

import client from "../apollo-client";
import { request, gql } from "graphql-request";

const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
const creatifyAddress = process.env.NEXT_PUBLIC_CREATIFY_ADDRESS;

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHQL_API;

export default function CreatorDashboard() {
  function getEthPrice(price) {
    return ethers.utils.formatEther(price);
  }
  const walletAddr = useSelector(selectUser);
  // console.log(walletAddr);
  // console.log(walletAddr ? walletAddr[0] : "");
  var wallet = walletAddr ? walletAddr[0] : "";

  const [data, setData] = useState([]);

  const fetchUserAssests = async (walletAddr) => {
    const query = gql`
    query Query($where: MarketItem_filter) {
            marketItems(first: 20, where: {seller: "${walletAddr}",sold:true}) {
              price
              itemId
              seller
              forSale
              tokenId
              metaDataUri
            }
          }
          `;
    const result = await request(graphqlAPI, query);
    setData(result.marketItems);
    // console.log(result);
  };

  useEffect(() => {
    fetchUserAssests(`${wallet}`);
    loadNFTs();
    // console.log(user);
  }, []);

  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });

    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    // const marketContract = new ethers.Contract(
    //   marketplaceAddress,
    //   Marketplace.abi,
    //   signer
    // );
    // const tokenContract = new ethers.Contract(
    //   creatifyAddress,
    //   Creatify.abi,
    //   provider
    // );
  }
  return (
    <Layout>
      <div className="p-4 px-10 min-h-screen">
        <h2 className="text-xl pt-20 pb-4 border-b-2">Items Sold</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 lg:gap-24 p-4 mt-20  h-auto">
          {data.map((item) => {
            return (
              <div
                key={item.itemId}
                className="bg-white dark:bg-gray-900  rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-800"
              >
                <Link key={item.itemId} href={`/assets/${item.itemId}`}>
                  <div>
                    <HomeComp
                      uri={item ? item.metaDataUri.substr(7, 50) : ""}
                    />

                    <div className="flex px-4 py-6">
                      <HomeComp2
                        uri={item ? item.metaDataUri.substr(7, 50) : ""}
                      />
                    </div>
                    <div className=" flex items-center justify-between px-4 mb-2">
                      <p className="font-1 text-sm font-bold">Price </p>
                      <div className="flex items-center">
                        <FaEthereum className="h-4 w-4 text-blue-400" />
                        <p className="font-extralight dark:text-gray-400">
                          {getEthPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="px-4 py-4 bg-gray-100 dark:bg-gray-700 flex justify-between">
                  <button
                    onClick={() => buyNft(nft)}
                    className="text-blue-500 hover:text-blue-400 font-bold"
                  >
                    Buy now
                  </button>
                </div>
              </div>
            );
          })}
          {data.length == 0 && (
            <div className="text-xl pb-10">
              You haven&apos;t sold any asset.
            </div>
          )}
        </div>
      </div>
      <div className="p-4 px-10">
        <BoughtItems />
      </div>
    </Layout>
  );
}
