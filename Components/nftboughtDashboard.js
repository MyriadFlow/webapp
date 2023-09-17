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
import Tradhub from '../artifacts/contracts/tradehub/TradeHub.sol/TradeHub.json';
// import { buyNFT } from "../pages/api/buyNFT";
// import { buyNFT } from "./api/buyNFT";
import { sellItem }   from "../pages/api/sellItem";
const graphqlAPI = process.env.NEXT_PUBLIC_MARKETPLACE_API;

function NftboughtDashboard() {
  function getEthPrice(price) {
    return ethers.utils.formatEther(price);
  }

  const walletAddr = useSelector(selectUser);
  var wallet = walletAddr ? walletAddr[0] : "";
  const [data, setData] = useState([]);
  const [auction, setAuction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [model, setmodel] = useState(false);
  const [modelmsg, setmodelmsg] = useState("buying in progress!");

  const fetchUserAssests = async (walletAddr) => {
    const query = gql`
    query Query($where: ItemSold_filter) {
      itemSolds(first: 100, where: {buyer: "${walletAddr}"}) {
        itemId
        tokenId
        nftContract
        metadataURI
        seller
        buyer   
        blockTimestamp
        price
            }
          }
          `;
          const refineArray = {};
          refineArray.itemSolds = [];

          const response = await fetch(`/api/soldgraph?walletAddress=${walletAddr}`);
          const result = await response.json();

          const status = async () => {
            for (const obj of result.itemSolds) {
              const tradhubAddress = process.env.NEXT_PUBLIC_TRADEHUB_ADDRESS;
              const tradhubContarct = await etherContract(
                tradhubAddress,
                Tradhub.abi
              );
              const transaction = await tradhubContarct.idToMarketItem(obj.itemId);
              console.log("id" + obj.itemId);
              console.log("transaction", transaction);
              console.log("transaction", transaction.status == 3);
      
              // Only add items with transaction.status equal to 1 to the filtered array
          if (transaction.status == 3) {
            // refineArray[obj.itemId] = obj;
            refineArray.itemSolds.push(obj);
          }
            }
          };
      
            await status();
            console.log(refineArray);
console.log("sale assets count",refineArray.itemSolds.length);

    setLoading(true);
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
    const result = await request(graphqlAPI, query);
    setLoading(true);
    setAuction(result.auctionEndeds);
    setLoading(false);
  };

  async function loadNFTs() {
    setLoadingState("loaded");
  }
  async function sellNft(nft) {
    setmodelmsg("Buying in Progress");
    await sellItem(nft,1, setmodel, setmodelmsg);
  }

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
    <div className="min-h-screen body-back">
      {model && <BuyAsset open={model} setOpen={setmodel} message={modelmsg} />}
      <div>
        <div className=" p-4 mt-10  h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {data?.length > 0 ? (
            data?.map((item) => {
              return (
                <div
                  key={item.itemId}
                  className=" border-2 p-2.5 rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-500"
                >
                  <Link key={item?.itemId} href={`/assets/${item?.tokenId}`}>
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
                        <div className="text-md ml-2">{item?.buyer.slice(-6)}</div>
                      </div>
                    </div>
                  </Link>

                  <div className="px-4 py-4 bg-white  flex justify-center mt-5">
                    <button
                      onClick={() => sellNft(item)}
                      className="text-black font-bold"
                    >
                      Put to Marketplace
                    </button>
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
        <div className=" p-4 mt-10 h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
        </div>
      </div>
    </div>
  );
}

export default NftboughtDashboard;
