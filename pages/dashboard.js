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
import BoughtItems from "../Components/nftboughtDashboard";
import Myartifacts from "../Components/my-artifacts";
import Placemarket from "../Components/placemarket";
import Loader from "../Components/Loader";
import { BsShop } from "react-icons/bs";
import { IoCreate, IoEaselSharp } from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { request, gql } from "graphql-request";
const graphqlAPI = process.env.NEXT_PUBLIC_MARKETPLACE_API;

export default function CreatorDashboard() {
  const walletAddr = useSelector(selectUser);
  var wallet = walletAddr ? walletAddr[0] : "";

  const [data, setData] = useState([]);
  const [auction, setAuction] = useState([]);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("created");

  const fetchUserAssests = async (walletAddr) => {
    const query = gql`
      query Query($where: ItemSold_filter) {
        itemSolds(first:100, where:{seller: "${walletAddr}"}) {
          itemId
          tokenId
          nftContract
          metadataURI
          seller
          blockTimestamp
        }
      }
    `;
    const result = await request(graphqlAPI, query);
    setLoading(true);
    setData(result.itemSolds);
    setLoading(false);
  };

  const fetchAuction = async (walletAddr) => {
    const query = gql`
      query Query($where: AuctionEnded_filter) {
        auctionEndeds(first:100, where:{auctioneer: "${walletAddr}"}) {
          auctioneer
          tokenId
          nftContract
          metadataURI
          blockTimestamp
        }
      }
    `;
    const result = await request(graphqlAPI, query);
    setLoading(true);
    setAuction(result.auctionEndeds);
    setLoading(false);
  };



  
  useEffect(() => {
    if (!localStorage.getItem("platform_wallet") && wallet !== undefined) {
      localStorage.setItem("platform_wallet", wallet);
    } else {
    }
    fetchUserAssests(`${localStorage.getItem("platform_wallet")}`);
    fetchAuction(`${localStorage.getItem("platform_wallet")}`);

    loadNFTs();
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
    <Layout title="Dashboard"description="This is used to show the Create,Buy,Sell and Market the NFTs ">
           
            
      <div className="p-4 body-back">
        <div className="bg-[#1e1f26] flex items-center rounded-sm flex justify-center">
          <div
            className={`text-gray-500 dark:text-white hover:text-gray-400 dark:hover:bg-[#131417]  cursor-pointer p-3 border-b-2 border-transparent hover:border-[#47cf73] transition-all ${
              page === "created" ? "bg-[#131417] border-[#47cf73]" : ""
            }`}
            onClick={() => setPage("created")}
          >
            <div className="flex items-center gap-x-2">
              <IoCreate className="text-xl text-gray-500 dark:text-white" />
              <div className="text-xl font-semibold">Created</div>
            </div>
          </div>

          <div
            className={`text-gray-500 dark:text-white hover:text-gray-400 dark:hover:bg-[#131417]  cursor-pointer p-3 border-b-2 border-transparent hover:border-[#47cf73] transition-all ${
              page === "sold" ? "bg-[#131417] border-[#47cf73]" : ""
            }`}
            onClick={() => setPage("sold")}
          >
            <div className="flex items-center gap-x-2">
              <RiMoneyDollarCircleLine className="text-xl text-gray-500 dark:text-white" />
              <div className="text-xl font-semibold">Sold</div>
            </div>
          </div>

          <div
            className={`text-gray-500 dark:text-white hover:text-gray-400 dark:hover:bg-[#131417]  cursor-pointer p-3 border-b-2 border-transparent hover:border-[#47cf73] transition-all ${
              page === "bought" ? "bg-[#131417] border-[#47cf73]" : ""
            }`}
            onClick={() => setPage("bought")}
          >
            <div className="flex items-center gap-x-2">
              <IoEaselSharp className="text-xl" />
              <div className="text-xl font-semibold">Bought</div>
            </div>
          </div>

          <div
            className={`text-gray-500 dark:text-white hover:text-gray-400 dark:hover:bg-[#131417]  cursor-pointer p-3 border-b-2 border-transparent hover:border-[#47cf73] transition-all ${
              page === "market" ? "bg-[#131417] border-[#47cf73]" : ""
            }`}
            onClick={() => setPage("market")}
          >
            <div className="flex items-center gap-x-2">
              <BsShop className="text-xl" />
              <div className="text-xl font-semibold">Market</div>
            </div>
          </div>
        </div>

        {page === "sold" && (
          <div>
          <div className="p-4 px-10 min-h-screen ">
            <div  className=" p-4 mt-10  h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
              {data?.length > 0 ? (
                data?.map((item) => {
                  return (
                    <div style={{border:"2px solid",padding:'10px'}}
                      key={item.itemId}
                      className="bg-white dark:bg-gray-900  rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-800"
                    >
                      <Link key={item.itemId} href={`/assets/${item.itemId}`}>
                        <div>
                          <HomeComp uri={item ? item.metaDataURI : ""} />

                         
                          <div className=" flex items-center justify-between mb-2 mt-3">
                            <div className="font-1 text-sm font-bold">
                              Sold at Price :
                            </div>
                            <div className="flex items-center">
                              <FaEthereum className="h-4 w-4 text-blue-400" />
                              <div className="font-extralight dark:text-gray-400">
                              </div>
                            </div>
                          </div>
                          <div>
                </div>
                        </div>
                      </Link>
                     
                    </div>
                  );
                })
              ) : loading ? (
                <Loader />
              ) : (
                <div className="text-2xl pb-10 text-center font-bold text-gray-500 dark:text-white">
                  You Haven&apos;t Sold Any Asset.
                </div>
              )}
            </div>
          </div>
          <div className="p-4 px-10 min-h-screen ">
            <div  className=" p-4 mt-10  h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
              {auction?.length > 0 ? (
                auction?.map((item) => {
                  return (
                    <div style={{border:"2px solid",padding:'10px'}}
                      key={item.id}
                      className="bg-white dark:bg-gray-900  rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-800"
                    >
                      <Link key={item.itemId} href={`/assets/${item.id}`}>
                        <div>
                          <HomeComp uri={item ? item.metaDataURI : ""} />

                         
                          <div className=" flex items-center justify-between mb-2 mt-3">
                            <div className="font-1 text-sm font-bold">
                              Sold At Price :
                            </div>
                            <div className="flex items-center">
                              <FaEthereum className="h-4 w-4 text-blue-400" />
                              <div className="font-extralight dark:text-gray-400">
                              </div>
                            </div>
                          </div>
                          <div>
                  <div className="font-bold">Wallet Address :</div>
                  <div style={{fontSize:"12px"}}>{item.owner}</div>
                </div>
                        </div>
                      </Link>
                     
                    </div>
                  );
                })
              ) : loading ? (
                <Loader />
              ) : (
                <div className="text-2xl pb-10 text-center font-bold text-gray-500 dark:text-white">
                  You Haven&apos;t Sold Any Asset.
                </div>
              )}
            </div>
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
