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
import { Category } from "@mui/icons-material";
import { getMetaData, removePrefix } from "../utils/ipfsUtil";
import { MarketPlaceCard } from "../Components/Cards/MarketPlaceCard";
const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHQL_API;

const Home = () => {
  const [data, setData] = useState([]);
  const [shallowData, setShallowData] = useState([]);
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
  const [categories, setCategory] = useState([
    "All",
    "Music",
    "Image",
    "Video",
    "Document",
    "Others",
  ]);

  const HomeProps = (data) => {
    console.log("explore data", data.categories);
    setCategory(data.categories);
  };

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
  const filterNFTs = (cat) => {
    if (cat === "All") {
      setData(shallowData);
      return;
    }
    let localData = [...data];
    localData = localData.filter((item) => item.categories.includes(cat));
    console.log("Filter by category", localData);
    setData(localData);
  };
  async function buyNft(nft) {
    setmodelmsg("Buying in Progress");
    await buyNFT(nft, setmodel, setmodelmsg);
  }

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

    const result = await request(graphqlAPI, query);
    const fResult = await Promise.all(
      result.marketplaceItems.map(async function (obj, index) {
        const nftData = await getMetaData(obj.metaDataURI);
        const { name, description, categories, image } = nftData;
        return {
          ...obj,
          name,
          description,
          categories: categories,
          image: nftData?.image? `${process.env.NEXT_PUBLIC_IPFS_CLIENT}${removePrefix(
            image
          )}`:"",
        };
      })
    );
    const sortedNFts = fResult.sort((a, b) => {
      if (a.itemId < b.itemId) return -1;
    });
    setData(sortedNFts);
    setShallowData(sortedNFts);
  };

  useEffect(() => {
    market();
  }, []);
  return (
    <Layout>
      {model && <BuyAsset open={model} setOpen={setmodel} message={modelmsg} />}
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

      <main className="gradient-blue">
        <div className="min-h-screen">
          <div className="flex justify-center mt-5 ml-5 "style={{borderBottom:"2px solid",padding:"18px"}}>
            <div>
              <div className="flex gap-6">
                {categories.map((category, key) => {
                  return (
                    <div key={key}>
                      <button
                        onClick={() => filterNFTs(category)}
                        className="bg-blue-100 text-blue-800 text-lg mr-3 px-5 py-2 rounded dark:bg-blue-900 dark:text-blue-300 font-bold "
                      >
                        {category}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 lg:gap-24 p-4">
            {data.length ? data?.map((item) => {
              return (
                <div
                  style={{ border: "2px solid" }}
                  key={item.tokenId}
                  className="mycard p-3 shadow-lg w-full lg:w-72 cursor-pointer"
                >
                  <Link key={item.tokenId} href={`/explore/${item.tokenId}`}>
                    <div>
                      <MarketPlaceCard {...item} />
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
            }):
            <div className="font-bold text-2xl">No NFT found for selected category</div>
            }
          </div>
        </div>
      </main>
    </Layout>
  );
};
export default Home;
