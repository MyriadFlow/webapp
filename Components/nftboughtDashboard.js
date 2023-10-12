import { useEffect, useState } from "react";
import { selectUser } from "../slices/userSlice";
import { useSelector } from "react-redux";
import Link from "next/link";
import HomeComp from "../Components/homeComp";
import { FaEthereum } from "react-icons/fa";
import { request, gql } from "graphql-request";
import { ethers } from "ethers";
import Loader from "../Components/Loader";
import BuyAsset from "./buyAssetModal";
import etherContract from "../utils/web3Modal";
import Tradhub from "../artifacts/contracts/tradehub/TradeHub.sol/TradeHub.json";
// import { buyNFT } from "../pages/api/buyNFT";
// import { buyNFT } from "./api/buyNFT";
import { sellItem } from "../pages/api/sellItem";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { useData } from "../context/data";
import axios from "axios";

function NftboughtDashboard() {
  const router = useRouter();

  const { resdata } = useData();

  const graphql = resdata?.Storefront.subgraphUrl;
  console.log(graphql);

  const regex = /^(.*?)(?=\/graphql)/;

  // Use the regular expression to extract the URL
  const match = graphql?.match(regex);

  // Extract the matched URL or set it to null if no match was found
  const graphqlAPI = match ? match[0] : null;
  console.log(graphqlAPI);

  function getEthPrice(price) {
    return ethers.utils.formatEther(price);
  }

  const walletAddr = useAccount().address;
  console.log("walletmy", walletAddr);
  var wallet = walletAddr ? walletAddr[0] : "";
  const [data, setData] = useState([]);
  const [auction, setAuction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [model, setmodel] = useState(false);
  const [modelmsg, setmodelmsg] = useState("buying in progress!");
  const [isPriceInputVisible, setIsPriceInputVisible] = useState(false);
  const [price, setPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);

  const handleInputChange = () => {
    setToggle1(!toggle1); // Toggle the state
    setToggle2(!toggle2);
  };

  const fetchUserAssests = async (walletAddr) => {
  
    const refineArray = {};
    refineArray.itemSolds = [];

    let result = {};
    if (graphqlAPI && walletAddr) {
      const endPoint = `${graphqlAPI}`;
      const headers = {
        "Content-Type": "application/json",
      };

      const AllBuildingQuery = `{
        itemSolds(where: {buyer: "${walletAddr}"}) {
          id
          itemId
          metadataURI
          nftContract
          price
          seller
          tokenId
          transactionHash
          buyer
          blockNumber
          blockTimestamp
    }
  }`;

      const graphqlQuery = {
        operationName: "itemSolds",
        query: `query itemSolds ${AllBuildingQuery}`,
        variables: {},
      };

      const response = await axios.post(endPoint, graphqlQuery, { headers: headers });

      // const response = await fetch(`/api/soldgraph?walletAddress=${walletAddr}?subgraphUrl=${graphqlAPI}`);
      result = await response.data.data;

      console.log("result new", result);


      setLoading(true);

      const status = async () => {
        const tokenTimestampMap = {};

        for (const obj of result.itemSolds) {
          const tradhubAddress = resdata?.TradehubAddress;
          const tradhubContarct = await etherContract(
            tradhubAddress,
            Tradhub.abi
          );
          const transaction = await tradhubContarct.idToMarketItem(obj.itemId);
          console.log("id" + obj.itemId);
          console.log("transaction", transaction);
          console.log("transaction", transaction.status == 3);

          if (transaction.status == 3) {
            // Check if tokenId exists in tokenTimestampMap
            if (!tokenTimestampMap[obj.itemId]) {
              // If tokenId doesn't exist, add it with the current obj
              tokenTimestampMap[obj.itemId] = obj;
            } else {
              // If tokenId exists, compare timestamps and update if current obj has a more recent timestamp
              const currentTimestamp = obj.blockTimestamp;
              const existingTimestamp =
                tokenTimestampMap[obj.itemId].blockTimestamp;
              if (currentTimestamp > existingTimestamp) {
                tokenTimestampMap[obj.itemId] = obj;
              }
            }
          }

          console.log("tokenTimestampMap", tokenTimestampMap);

          // Only add items with transaction.status equal to 1 to the filtered array
          // Iterate over tokenTimestampMap and push each object to refineArray.saleStarteds
          refineArray.itemSolds = Object.values(tokenTimestampMap);
        }
      };

      await status();
    }
    console.log(refineArray);
    console.log("buy assets count", refineArray.itemSolds.length);

    setData(refineArray.itemSolds);
    setLoading(false);
  };

  const fetchAuction = async (walletAddr) => {
    const query = gql`
    query Query($where: AuctionEnded_filter) {
      auctionEndeds(first: 100, where: {highestBidder: "${walletAddr}"}) {
        id
        tokenId
        nftContract
        metadataURI
        highestBidder   
        blockTimestamp
            }
          }
          `;
    const result = [];
    // setLoading(true);
    setAuction(result.auctionEndeds);
    // setLoading(false);
  };

  async function loadNFTs() {
    setLoadingState("loaded");
  }
  async function sellNft(nft, price) {
    setmodelmsg("Buying in Progress");
    setIsPriceInputVisible(false);
    setLoading(true);
    const newprice = ethers.utils.parseEther(price.toString());
    await sellItem(nft, 1, newprice, setmodel, setmodelmsg);
    router.push("/explore");
    setLoading(false);
  }

  const submitNft = (nft) => {
    // Implement your logic for selling the NFT here
    // You can set isPriceInputVisible to true when you want to show the input field.
    // setIsPriceInputVisible(true);
    setSelectedNFT(nft);
    setShowModal(true);
  };

  const handlePriceChange = (event) => {
    const newPrice = event.target.valueAsNumber; // Parse the input value as a number
    setPrice(newPrice);
  };

  useEffect(() => {
    if (!localStorage.getItem("platform_wallet") && wallet !== undefined) {
      localStorage.setItem("platform_wallet", wallet);
    } else {
    }
    fetchUserAssests(`${localStorage.getItem("platform_wallet")}`);
    fetchAuction(`${localStorage.getItem("platform_wallet")}`);
  }, []);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  });
  return (
    <div className="min-h-screen dark:body-back body-back-light">
      {model && <BuyAsset open={model} setOpen={setmodel} message={modelmsg} />}
      <div>
        {showModal && selectedNFT ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none dark:body-back body-back-light">
              <div
                className="py-12 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0"
                id="modal"
              >
                <div
                  role="alert"
                  className="container mx-auto w-2/3 rounded-lg"
                >
                  <div className="relative py-4 bg-white shadow-md rounded border border-gray-400 rounded-2xl">
                    <div className="w-full flex justify-start text-gray-600 mb-3">
                      <button onClick={() => setShowModal(false)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-x mr-4 ml-4"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          stroke-width="2.5"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
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
                        <div class="flex items-center mb-4 justify-between">
                          <div>
                            <h3 className="text-2xl font-semibold text-gray-900">
                              Fixed Price
                            </h3>
                            <p className="font-semibold text-gray-900">
                              The item is listed at the price you set.
                            </p>
                          </div>
                          <input
                            // checked
                            onClick={handleInputChange}
                            id="default-radio-1"
                            type="radio"
                            value=""
                            name="default-radio"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                        </div>
                        <div class="flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl font-semibold text-gray-900">
                              Sell to higher bidder
                            </h3>
                            <p className="font-semibold text-gray-900">
                              The item is listed for auction.
                            </p>
                          </div>

                          <input
                            onClick={handleInputChange}
                            id="default-radio-2"
                            type="radio"
                            value=""
                            name="default-radio"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                        </div>
                        {
                          toggle1 && (
                            <>
                              <h3 className="text-2xl font-semibold text-gray-900 mt-10">
                                Set a price
                              </h3>
                              <p className="font-semibold text-gray-900 mt-4 mb-2">
                                Starting Price
                              </p>
                              <div className="mb-2">
                                <input
                                  type="number"
                                  id="default-input"
                                  placeholder="Enter Price"
                                  value={price}
                                  onChange={handlePriceChange}
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  required
                                />
                              </div>
                              {/* <p className="font-semibold text-gray-900 mt-4 mb-2">Duration</p>
                        <div className="mb-2">
                          <input type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div> */}
                              <button
                                className="text-white bg-blue-500 text-sm px-20 py-3 mt-4 rounded-full border border-white shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => sellNft(selectedNFT, price)}
                              >
                                Set
                              </button>
                            </>
                          )
                        }
                      </div>
                      <div class="w-1/3 ml-10">
                        <img src="/vr.png" className="rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
        <div className=" p-4 mt-10  h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {data?.length > 0 ? (
            data?.map((item) => {
              return (
                <div
                  key={item.itemId}
                  className=" border-2 p-2.5 rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-500"
                >
                  <Link key={item?.itemId} href={`/assets/${item?.itemId}`}>
                    <div>
                      <HomeComp uri={item ? item?.metadataURI : ""} />

                      <div className=" flex items-center justify-between mb-2">
                        <div className="font-1 text-sm font-bold mt-3">
                          Price:{" "}
                        </div>
                        <div className="flex items-center ml-4">
                          <FaEthereum className="h-4 w-4 text-blue-400" />
                          <div className="font-extralight dark:text-gray-400 ml-4">
                            {getEthPrice(item?.price)} MATIC
                          </div>
                        </div>
                      </div>
                      <div class="flex">
                        <div className="font-bold">Wallet Address: </div>
                        <div className="text-md ml-2">
                          {item?.buyer.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* <div className="flex items-center md:justify-end lg:-my-16 lg:mx-8 md:-my-16 md:mx-8 mt-8 justify-center lg:justify-end">
                    <button
                        className=" text-black text-sm px-8 py-3 rounded-full border border-white shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModal(true)}
                    >
                        Put to Marketplace
                    </button>
                </div> */}
                  <div className="px-4 py-4 bg-white  flex justify-center mt-5">
                    <button
                      // onClick={() => submitNft()}
                      onClick={() => submitNft(item)}
                      className="text-black font-bold"
                    >
                      Put to marketplace
                    </button>

                    {isPriceInputVisible && (
                      <div>
                        {/* Price input field */}
                        <input
                          type="number"
                          placeholder="Enter Price"
                          value={price}
                          onChange={handlePriceChange}
                          className="border border-gray-300 p-2 mt-2"
                        />

                        {/* Add a button to submit the price */}
                        <button
                          onClick={() => sellNft(item, price)}
                          className="bg-blue-500 text-white px-4 py-2 mt-2"
                        >
                          Put {price} to Marketplace
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : loading ? (
            <Loader />
          ) : (
            <div className="text-2xl pb-10 text-center font-bold text-gray-500 dark:text-white">
              You Haven&apos;t Buy Any Asset.
            </div>
          )}
        </div>
        {/* <div className=" p-4 mt-10 h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {auction.length > 0 ? (
            auction.map((item) => {
              return (
                <div
                  key={item?.id}
                  className=" border-2 p-2.5 bg-white dark:bg-gray-900  rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-800"
                >
                  <Link key={item?.itemId} href={`/assets/${item?.id}`}>
                    <div>
                      <HomeComp uri={item ? item?.metadataURI : ""} />

                      <div>
                        <div className="font-bold mt-3">Wallet Address :</div>
                        <div className="text-xs">
                          {item?.highestBidder?.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </Link>

                 
                </div>
              );
            })
          ) : loading ? (
            <Loader />
          ) : (
            <div className="text-2xl pb-10 font-bold text-center text-gray-500 dark:text-white">
              You haven&apos;t Buy Any Auction.
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}

export default NftboughtDashboard;
