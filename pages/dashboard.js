/* pages/creator-dashboard.js */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { FaEthereum } from "react-icons/fa";
import Link from "next/link";
import Layout from "../Components/Layout";
import { selectUser } from "../slices/userSlice";
import { useSelector } from "react-redux";
import HomeComp from "../Components/homeComp";
import HomeComp2 from "../Components/homecomp2";
import BoughtItems from "../Components/nftboughtDashboard";
import Myartifacts from "../Components/my-artifacts";
import Placemarket from "../Components/placemarket";
import Loader from "../Components/Loader";
import { BsShop } from "react-icons/bs";
import { IoCreate, IoEaselSharp } from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { request, gql } from "graphql-request";
const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHQL_API;

export default function CreatorDashboard() {
  function getEthPrice(price) {
    return ethers.utils.formatEther(price);
  }
  const walletAddr = useSelector(selectUser);
  var wallet = walletAddr ? walletAddr[0] : "";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("created");

  const fetchUserAssests = async (walletAddr) => {
    const query = gql`
      query Query($where: MarketplaceItem_filter) {
        marketplaceItems(where: { activity: "itemSale" }) {
          itemId
          tokenId
          nftContract
          metaDataURI
          seller
          owner
          forSale
          activity
          blockTimestamp
        }
      }
    `;
    const result = await request(graphqlAPI, query);
    setLoading(true);
    setData(result.marketplaceItems);
    setLoading(false);
    // console.log(result);
  };

  useEffect(() => {
    if (!localStorage.getItem("platform_wallet") && wallet !== undefined) {
      localStorage.setItem("platform_wallet", wallet);
    } else {
    }
    fetchUserAssests(`${localStorage.getItem("platform_wallet")}`);
    loadNFTs();
    // console.log(user);
  }, []);
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mumbai",
      cacheProvider: true,
    });

    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
  }
  return (
    <Layout>
      <div className="p-4">
        <div className="bg-[#1e1f26] flex items-center rounded-sm flex justify-center">
          <div
            className={`dark:text-white hover:text-gray-400 dark:hover:bg-[#131417] text-gray-900 cursor-pointer p-3 border-b-2 border-transparent hover:border-[#47cf73] transition-all ${
              page === "created" ? "bg-[#131417] border-[#47cf73]" : ""
            }`}
            onClick={() => setPage("created")}
          >
            <div className="flex items-center gap-x-2">
              <IoCreate className="text-xl dark:text-white" />
              <p className="text-xl font-semibold">Created</p>
            </div>
          </div>

          <div
            className={`dark:text-white hover:text-gray-400 dark:hover:bg-[#131417] text-gray-900 cursor-pointer p-3 border-b-2 border-transparent hover:border-[#47cf73] transition-all ${
              page === "sold" ? "bg-[#131417] border-[#47cf73]" : ""
            }`}
            onClick={() => setPage("sold")}
          >
            <div className="flex items-center gap-x-2">
              <RiMoneyDollarCircleLine className="text-xl dark:text-white" />
              <p className="text-xl font-semibold">Sold</p>
            </div>
          </div>

          <div
            className={`dark:text-white hover:text-gray-400 dark:hover:bg-[#131417] text-gray-900 cursor-pointer p-3 border-b-2 border-transparent hover:border-[#47cf73] transition-all ${
              page === "bought" ? "bg-[#131417] border-[#47cf73]" : ""
            }`}
            onClick={() => setPage("bought")}
          >
            <div className="flex items-center gap-x-2">
              <IoEaselSharp className="text-xl" />
              <p className="text-xl font-semibold">Bought</p>
            </div>
          </div>

          <div
            className={`dark:text-white hover:text-gray-400 dark:hover:bg-[#131417] text-gray-900 cursor-pointer p-3 border-b-2 border-transparent hover:border-[#47cf73] transition-all ${
              page === "market" ? "bg-[#131417] border-[#47cf73]" : ""
            }`}
            onClick={() => setPage("market")}
          >
            <div className="flex items-center gap-x-2">
              <BsShop className="text-xl" />
              <p className="text-xl font-semibold">Market</p>
            </div>
          </div>
        </div>

        {page === "sold" && (
          <div className="p-4 px-10 min-h-screen">
            <div className=" p-4 mt-10  h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {data?.length > 0 ? (
                data?.map((item) => {
                  return (
                    <div
                      key={item.itemId}
                      className="bg-white dark:bg-gray-900  rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-800"
                    >
                      <Link key={item.itemId} href={`/create/${item.itemId}`}>
                        <div>
                          <HomeComp uri={item ? item.metaDataURI : ""} />

                          <div className="flex px-4 py-6">
                            <HomeComp2 uri={item ? item.metaDataURI : ""} />
                          </div>
                          <div className=" flex items-center justify-between px-4 mb-2">
                            <p className="font-1 text-sm font-bold">
                              Sold at price{" "}
                            </p>
                            <div className="flex items-center">
                              <FaEthereum className="h-4 w-4 text-blue-400" />
                              <p className="font-extralight dark:text-gray-400">
                                {/* {getEthPrice(item.price)} MATIC */}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                      {/* <div className="px-4 py-4 bg-gray-100 dark:bg-gray-700 flex justify-between">
                  <button
                    onClick={() => buyNft(nft)}
                    className="text-blue-500 hover:text-blue-400 font-bold"
                  >
                    Buy now
                  </button>
                </div> */}
                    </div>
                  );
                })
              ) : loading ? (
                <Loader />
              ) : (
                <div className="text-xl pb-10 ">
                  You haven&apos;t sold any asset.
                </div>
              )}
            </div>
          </div>
        )}
        {page === "bought" && (
          <div className="p-4 px-10">
            <BoughtItems />
          </div>
        )}

        {page == "created" && (
          <div className="p-4 px-10">
            <Myartifacts />
          </div>
        )}

        {page == "market" && (
          <div className="p-4 px-10">
            <Placemarket />
          </div>
        )}
      </div>
    </Layout>
  );
}
