import { useEffect, useState } from "react";
import { selectUser } from "../slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import HomeComp from "../Components/homeComp";
import HomeComp2 from "../Components/homecomp2";
import { FaEthereum } from "react-icons/fa";
import { request, gql } from "graphql-request";
import { ethers } from "ethers";
import Loader from "../Components/Loader";

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHQL_API;

function nftboughtDashboard() {
  function getEthPrice(price) {
    return ethers.utils.formatEther(price);
  }
  const walletAddr = useSelector(selectUser);
  // console.log(walletAddr);
  // console.log(walletAddr ? walletAddr[0] : "");
  var wallet = walletAddr ? walletAddr[0] : "";

  const [data, setData] = useState([]);
  const [loading,setLoading]=useState(true);

  const fetchUserAssests = async (walletAddr) => {
    const query = gql`
    query Query($where: MarketItem_filter) {
            marketItems(first: 100, where: {owner: "${walletAddr}",deleted:false,sold:true}) {
              price
              itemId
              seller
              forSale
              id
              metaDataUri
            }
          }
          `;
    const result = await request(graphqlAPI, query);
    setLoading(true);
    setData(result.marketItems);
    setLoading(false);
    // console.log(result);
  };

  useEffect(() => {
    if(!localStorage.getItem('platform_wallet')&& wallet!==undefined)
    {
      localStorage.setItem("platform_wallet",wallet);
    }
    else
    {
    }
    fetchUserAssests(`${localStorage.getItem('platform_wallet')}`);
    // console.log(user);
  },[]);

  return (
    <div className="min-h-screen">
      {/* <h2 className="text-xl pt-20 pb-4 border-b-2">Items Bought</h2> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 lg:gap-24 p-4 mt-10 h-auto">
        { data.length>0 ? data.map((item) => {
          return (
            <div
              key={item.itemId}
              className="bg-white dark:bg-gray-900  rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-800"
            >
              <Link key={item.itemId} href={`/assets/${item.itemId}`}>
                <div>
                  <HomeComp uri={item ? item.metaDataUri.substr(7, 50) : ""} />
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
                        {getEthPrice(item.price)} MATIC
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
                  Sell now
                </button>
              </div>
            </div>
          );
        }): (loading?<Loader/>:<div className="text-xl pb-10">
        You haven&apos;t buy any asset.
      </div>)  }
      </div>
    </div>
  );
}

export default nftboughtDashboard;
