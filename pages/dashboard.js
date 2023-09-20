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
import { useAccount } from "wagmi";

export default function CreatorDashboard() {
  const walletAddr = useAccount().address;
  var wallet = walletAddr ? walletAddr[0] : "";

  const [data, setData] = useState([]);
  const [auction, setAuction] = useState([]);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("bought");

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
    const result = [];
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
    const result = [];
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
    <Layout title="Dashboard" description="You will find all your created NFTs, assets you buy, sell and market here.">
           
            
      <div className="dark:body-back body-back-light">
      <div className="text-2xl font-semibold mb-4 pt-10 text-center border-b pb-6">Dashboard</div>
        <div className="pb-4 lg:px-32 md:px-10 px-4 grid grid-cols-2 gap-8 sm:gap-20 lg:grid-cols-4 md:grid-cols-4 w-full">
          {/* <div
            className={`rounded-full text-center text-gray-500 dark:text-gray dark:hover:bg-white  cursor-pointer p-3 border-b-2 border-transparent transition-all ${
              page === "created" ? "bg-white" : ""
            }`}
            onClick={() => setPage("created")}
          >
              <div className="text-sm lg:text-xl md:text-lg font-semibold">Create</div>
          </div> */}

          <div
            className={`rounded-full text-center text-gray-500 dark:text-gray dark:hover:bg-white  cursor-pointer p-3 border-b-2 border-transparent transition-all ${
              page === "bought" ? "bg-white" : ""
            }`}
            onClick={() => setPage("bought")}
          >
              <div className="text-sm lg:text-xl md:text-lg font-semibold">Owned</div>

          </div>

          {/* <div
            className={`rounded-full text-center text-gray-500 dark:text-gray dark:hover:bg-white  cursor-pointer p-3 border-b-2 border-transparent transition-all ${
              page === "sold" ? "bg-white" : ""
            }`}
            onClick={() => setPage("sold")}
          >

              <div className="text-sm lg:text-xl md:text-lg font-semibold">Sold</div>

          </div> */}

          <div
            className={`rounded-full text-center text-gray-500 dark:text-gray dark:hover:bg-white  cursor-pointer p-3 border-b-2 border-transparent transition-all ${
              page === "market" ? "bg-white" : ""
            }`}
            onClick={() => setPage("market")}
          >
              <div className="text-sm lg:text-xl md:text-lg font-semibold">Market</div>
          </div>
        </div>

        {page === "sold" && (
          <div>
          <div className="p-4 px-10 min-h-screen ">
            <div  className=" p-4 mt-10  h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
              {data?.length > 0 ? (
                data?.map((item) => {
                  return (
                    <div 
                      key={item?.itemId}
                      className=" border-2 p-2.5 bg-white dark:bg-gray-900  rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-800"
                    >
                      <Link key={item?.itemId} href={`/assets/${item?.tokenId}`}>
                        <div>
                          <HomeComp uri={item ? item?.metadataURI : ""} />

                         
                          <div className=" flex items-center justify-between mb-2 mt-3">
                            <div className="font-1 text-sm font-bold text-gray-500 dark:text-white">
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
                <div className="text-2xl text-center font-bold text-gray-500 dark:text-white">
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
                    <div 
                      key={item?.id}
                      className=" border-2 p-2.5 bg-white dark:bg-gray-900  rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-800"
                    >
                      <Link key={item.itemId} href={`/assets/${item?.id}`}>
                        <div>
                          <HomeComp uri={item ? item?.metadataURI : ""} />

                         
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
                  <div className="text-xs">{item?.owner?.slice(-6)}</div>
                </div>
                        </div>
                      </Link>
                     
                    </div>
                  );
                })
              ) : loading ? (
                <Loader />
              ) : (
                <div className="text-2xl text-center font-bold text-gray-500 dark:text-white">
                  You Haven&apos;t Sold Any Auction.
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
