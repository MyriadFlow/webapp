/* pages/index.js */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { FaEthereum } from "react-icons/fa";
import Link from "next/link";
import { selectModel } from "../slices/modelSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/userSlice";
import { logoutbalance } from "../slices/balanceSlice";
import { close } from "../slices/modelSlice";
import HomeComp from "../Components/homeComp";
import HomeComp2 from "../Components/homecomp2";
import { request, gql } from "graphql-request";
import BuyAsset from "../Components/buyAssetModal";
import { buyNFT } from "./api/buyNFT";
import Layout from "../Components/Layout";
const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHQL_API;

const Home = () => {
  const logoutmodel = useSelector(selectModel);
  const dispatch = useDispatch();

  // function for logout
  const logoutmetamask = () => {
    dispatch(logout());
    dispatch(logoutbalance());
    dispatch(close());
  };

  // function for closing logout model
  const closelogoutmodel = () => {
    dispatch(close());
  };
  const [filter, Setfilter] = useState(false);
  const [model, setmodel] = useState(false);
  const [modelmsg, setmodelmsg] = useState("buying in progress!");

  const toogle = () => {
    Setfilter(!filter);
  };

  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);

  function getEthPrice(price) {
    return ethers.utils.formatEther(price);
  }

  async function loadNFTs() {
    setLoadingState("loaded");
  }
  async function buyNft(nft) {
    // console.log(nft.price)
    setmodelmsg("Buying in Progress");
    await buyNFT(nft, setmodel, setmodelmsg);
    // loadNFTs();
  }

  const [data, setData] = useState([]);

  const market = async () => {
    const query = gql`
      query Query($where: MarketplaceItem_filter) {
        marketplaceItems(where: { forSale: true }) {
          itemId
          tokenId
          nftContract
          metaDataURI
          seller
          owner
          forSale
          activity
          blockTimestamp
          price
        }
      }
    `;

    console.log(process.env);
    const result = await request(graphqlAPI, query);
    setData(result.marketplaceItems);
    console.log(result);
  };

  useEffect(() => {
    market();
  }, []);

  return (
    <Layout>
      {model && <BuyAsset open={model} setOpen={setmodel} message={modelmsg} />}

      {/* logout model  */}

      {logoutmodel && (
        <div className="flex items-center  shadow-md justify-center w-full h-screen model-overlay fixed  top-0 z-50">
          <div className="h-56 w-80 bg-white  dark:bg-gray-800 shadow-lg rounded-md fixed z-50 flex items-center justify-center  ring-offset-2 ring-2 ring-blue-400">
            <div className="flex flex-col justify-center items-center">
              <p className="text-lg font-semibold dark:text-gray-200">
                {" "}
                Are you sure wanna logout ?
              </p>
              <div className="flex items-center space-x-8 mt-10 ">
                <div>
                  <button
                    onClick={logoutmetamask}
                    className="font-semibold bg-blue-500 hover:bg-blue-700 shadow-md p-1 px-4 rounded-md"
                  >
                    Ok
                  </button>
                </div>
                <div>
                  {" "}
                  <button
                    onClick={closelogoutmodel}
                    className="font-semibold bg-gray-200 hover:bg-gray-300  dark:text-gray-400 flex items-center p-1 px-4 rounded-md shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
 
      <main>
       
      <div className="min-h-screen">
        <div className="flex" style={{padding:"20px"}}>
        <button className="bg-blue-100 text-blue-800 text-lg font-medium mr-3 px-2 py-2 rounded dark:bg-blue-900 dark:text-blue-300">All</button>
        <button className="bg-gray-100 text-gray-800 text-lg font-medium mr-3 px-2 py-2 rounded dark:bg-gray-700 dark:text-gray-300">Art</button>
        <button className="bg-red-100 text-red-800 text-lg font-medium mr-3 px-2 py-2 rounded dark:bg-red-900 dark:text-red-300">Games</button>
        <button className="bg-purple-100 text-purple-800 text-lg font-medium mr-3 px-2 py-2 rounded dark:bg-purple-900 dark:text-purple-300">Metaverses</button>

      </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 lg:gap-24 p-4">
            
            {data.map((item) => {
              console.log(item);
              console.log("Image url", item.metaDataURI);
              return (
                <div style={{border:"2px solid"}}
                  key={item.tokenId}
                  className="mycard p-3 shadow-lg w-full lg:w-72 cursor-pointer"
                >
                  <Link key={item.tokenId} href={`/explore/${item.tokenId}`}>
                    <div>
                      <HomeComp uri={item ? item.metaDataURI : ""} />

                      <HomeComp2 uri={item ? item.metaDataURI : ""} />
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold">Price </p>
                        <div className="flex items-center">
                          <FaEthereum className="w-4 text-white" />
                          <p className=" dark:text-white font-semibold">
                            {getEthPrice(item.price)} MATIC
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => buyNft(item)}
                    className="text-black bg-[#CAFC01] w-full rounded-md py-2 font-bold"
                  >
                    Buy Now
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </Layout>
  );
};
export default Home;
