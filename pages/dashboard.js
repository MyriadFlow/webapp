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
  const [showModal, setShowModal]=useState(false);

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
        <div className="border-b py-4 w-full flex justify-evenly">
          {/* <div
            className={`rounded-full text-center text-gray-500 dark:text-gray dark:hover:bg-white  cursor-pointer p-3 border-b-2 border-transparent transition-all ${
              page === "created" ? "bg-white" : ""
            }`}
            onClick={() => setPage("created")}
          >
              <div className="text-sm lg:text-xl md:text-lg font-semibold">Create</div>
          </div> */}

          <div
            className={`rounded-full text-center text-gray-500 dark:text-gray dark:hover:bg-white  cursor-pointer px-20 py-3 border-b-2 border-transparent transition-all ${
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
            className={`rounded-full text-center text-gray-500 dark:text-gray dark:hover:bg-white  cursor-pointer px-20 py-3 border-b-2 border-transparent transition-all ${
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
                      <Link key={item?.itemId} href={`/assets/${item?.itemId}`}>
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
            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none dark:body-back body-back-light">


                        <div className="py-12 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0" id="modal">
                            <div role="alert" className="container mx-auto w-2/3 rounded-lg">
                                <div className="relative py-4 bg-white shadow-md rounded border border-gray-400 rounded-2xl">
                                    <div className="w-full flex justify-start text-gray-600 mb-3">
                                        <button onClick={() => setShowModal(false)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-x mr-4 ml-4" width="20" height="20" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>

                                        <h3 className="text-2xl font-semibold text-gray-900 ml-6">
                                        Choose a type of Sale
                                        </h3>
                                    </div>

                                    <div class="flex p-10 ml-10">
                                        {/* <input type="file" className="btn btn-primary btn-md ml-36" style={{ marginBottom: 20, marginTop: 20, width: "50%" }} onChange={(e) => { uploadImage(e) }} /> */}
                                        <div className="w-1/2">
                                        <h3 className="text-2xl font-semibold text-gray-900">
                                        Fixed Price
                                        </h3>
                                        <p className="font-semibold text-gray-900">
                                        the item is listed at the price you set.
                                        </p>
                                        <h3 className="text-2xl font-semibold text-gray-900">
                                        Sell to higher bidder
                                        </h3>
                                        <p className="font-semibold text-gray-900">
                                        the item is listed for auction.
                                        </p>
                                        <h3 className="text-2xl font-semibold text-gray-900">
                                        Set a price
                                        </h3>
                                        <p className="font-semibold text-gray-900">Starting Price</p>
                                        <div className="mb-2">
                                            <label for="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">instagram URL (Optional)</label>
                                            <input type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                        </div>
                                        <p className="font-semibold text-gray-900">Duration</p>
                                        <div className="mb-2">
                                            <label for="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">instagram URL (Optional)</label>
                                            <input type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                        </div>
                                        <button
                                        className="text-white bg-blue-500 text-sm px-8 py-3 rounded-full border border-white shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                    >
                                        Add
                                    </button>
                                        </div>
                                        <div class="w-1/3 ml-10">
                                        <img src="/vr.png" className="rounded-lg"/>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

            {/* <div className="flex items-center md:justify-end lg:-my-16 lg:mx-8 md:-my-16 md:mx-8 mt-8 justify-center lg:justify-end">
                    <button
                        className=" text-white text-sm px-8 py-3 rounded-full border border-white shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModal(true)}
                    >
                        Edit Profile
                    </button>
                </div> */}
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
