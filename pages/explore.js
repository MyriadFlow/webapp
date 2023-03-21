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
import { request, gql } from "graphql-request";
import BuyAsset from "../Components/buyAssetModal";
import { buyNFT } from "./api/buyNFT";
import Loader from "../Components/Loader";

import Layout from "../Components/Layout";
import { getMetaData, removePrefix } from "../utils/ipfsUtil";
import { MarketPlaceCard } from "../Components/Cards/MarketPlaceCard";
import { NavLink } from "reactstrap";
import { useRouter } from "next/router";
import HomeComp from "../Components/homeComp";

import { saleStartedQuery } from "../utils/gqlUtil";
import axios from "axios";
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
import etherContract from "../utils/web3Modal";

const graphqlAPI = process.env.NEXT_PUBLIC_MARKETPLACE_API;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;

const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const itemStatus = new Map(
    ["NONEXISTANT", "SALE", "AUCTION", "SOLD", "REMOVED"].map((v, index) => [
      index,
      v,
    ])
  );

  const [data, setData] = useState([]);
  const [auction, setAuction] = useState([]);
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

  const datasort = [
    { id: 0, label: "Listed :Newest" },
    { id: 1, label: "Listed :Oldest" },
  ];

  const [isOpenSortOldNew, setOpenSortOldNew] = useState(false);
  const toggleDropdownSort = () => setOpenSortOldNew(!isOpenSortOldNew);

  const [isOpenMedia, setOpenMedia] = useState(false);
  const toggleDropdownMedia = () => setOpenMedia(!isOpenMedia);

  const [isOpenAvail, setOpenAvail] = useState(false);
  const toggleDropAvail = () => setOpenAvail(!isOpenAvail);

  const [isopenprice, setOpenPrice] = useState(false);
  const togglePriceDropdown = () => setOpenPrice(!isopenprice);
  const [items, setItem] = useState(datasort);

  const [hidefilter, setHideFilter] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedMedia, setSelectMedia] = useState(null);
  const [selectedAvail, setSelectAvail] = useState(null);
  const [selectedPrice, setSelectPrice] = useState(null);

  const [filter, Setfilter] = useState(false);
  const [model, setmodel] = useState(false);
  const [modelmsg, setmodelmsg] = useState("buying in progress!");
  const [categories, setCategory] = useState([
    "All",
    "Music",
    "Image",
    "Video",
    "Document",
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
  });

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
    console.log("show all", [...shallowData]);
    let localData = [...shallowData];
    localData = localData.filter((item) => {
      if (item?.categories?.length && item?.categories?.includes(cat)) {
        return true;
      }
      return false;
    });
    console.log("Filter by category", localData);
    setData(localData);
  };
  async function buyNft(nft) {
    setmodelmsg("Buying in Progress");
    await buyNFT(nft, setmodel, setmodelmsg);
  }
  useEffect(() => {
    filterNFTs();
  }, []);

  const market = async () => {
    const refineArray = [];

    const result = await request(graphqlAPI, saleStartedQuery);

    const fResult = await Promise.all(
      result.saleStarteds.map(async function (obj, index) {
        const nftData = await getMetaData(obj.metaDataURI);
        const { name, description, categories, image } = nftData;
        return {
          ...obj,
          name,
          description,
          categories: categories,
          image: nftData?.image
            ? `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${removePrefix(image)}`
            : "",
        };
      }),

      Promise.all(
        result.saleStarteds.map(async (item) => {
          const marketPlaceContarct = await etherContract(
            marketplaceAddress,
            Marketplace.abi
          );
          const itemResult = await marketPlaceContarct.idToMarketItem(
            item.tokenId
          );
          const status = itemStatus.get(parseInt(itemResult.status));
          if (status == "SALE") {
            refineArray.push(item.tokenId);
          }
        })
      ).then(() => {
        setData(
          result.saleStarteds.filter((assetItem) =>
            refineArray.some((item) => item === assetItem.tokenId)
          )
        );
      })
    );
    const sortedNFts = fResult.sort((a, b) => {
      if (a.itemId < b.itemId) return -1;
    });

    setData(sortedNFts);
    setShallowData(sortedNFts);
  };

  // useEffect(()=>{
  //   const token = localStorage.getItem("platform_token");
  //   if (token) {
  //     getLikes();

  //   }
  // },[])
  useEffect(() => {
    market();
  }, []);
  useEffect(() => {
    if (!localStorage.getItem("platform_wallet") && wallet !== undefined) {
      localStorage.setItem("platform_wallet", wallet);
    }
    fetchAuction(`${localStorage.getItem("platform_wallet")}`);
  }, []);

  const handleItemClick = (id) => {
    selectedItem == id ? setSelectedItem(null) : setSelectedItem(id);
  };
  // const getLikes=(tokenid)=>{
  //   const token = localStorage.getItem("platform_token");
  //   const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;

  //   const config = {
  //     headers: {
  //       Accept: "application/json, text/plain, */*",
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };
  //   setLoading(true);
  //   axios
  //     .get(`${BASE_URL}/api/v1.0/marketplace/userLikes/:${marketplaceAddress}/:${tokenid}`, config)
  //     .then((res) => {
  //       const {
  //         data: {
  //           payload: {

  //           },
  //         },
  //       } = res;

  //       setProfileData({

  //       });
  //       setupdateProfile({

  //       });
  //       setLoading(true);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  const fetchAuction = async () => {
    const query = gql`
    query Query($where: AuctionEnded_filter) {
      auctionEndeds(first: 100) {
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

  return (
    <Layout
      title="Explore"
      description="Used to show the created categories of the Nfts"
    >
      {model && <BuyAsset open={model} setOpen={setmodel} message={modelmsg} />}
      {logoutmodel && (
        <div className="flex items-center  shadow-md justify-center w-full h-screen model-overlay fixed  top-0 z-50">
          <div className="h-56 w-80 bg-white  dark:bg-gray-800 shadow-lg rounded-md fixed z-50 flex items-center justify-center  ring-offset-2 ring-2 ring-blue-400">
            <div className="flex flex-col justify-center items-center">
              <div className="text-lg font-semibold dark:text-gray-200">
                {" "}
                Are You Sure Wanna Logout ?
              </div>
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

      <main className="body-back">
        <div className="flex justify-between p-4 border-y-2">
          <div className="mt-5 mr-5">
            <Link href="/explore">
              <NavLink
                className={router.pathname == "/explore" ? "active " : ""}
              >
                <button className="bg-white py-3 px-6  text-gray-500 dark:text-black font-semibold mb-8 lg:mb-0">
                  More Sale
                </button>
              </NavLink>
            </Link>
          </div>
          <div className="mt-5 font-bold text-2xl">Sale</div>
          <div className="mt-5 font-bold text-2xl">Auction</div>
        </div>
        <div>
          <div
            className={`fa fa-chevron-right hide ${hidefilter && "open"}`}
            onClick={() => {
              setHideFilter(!hidefilter);
            }}
          >
            Hide Filter
          </div>
        </div>
        <div className="flex justify-around">
          {hidefilter && (
            <div className="p-4">
              <div className="dropdown">
                <div className="dropdown-header" onClick={toggleDropdownSort}>
                  {selectedItem
                    ? items.find((item) => item.id == selectedItem).label
                    : "Select Newest and Oldest"}
                  <i
                    className={`fa fa-chevron-right icon ${
                      isOpenSortOldNew && "open"
                    }`}
                  ></i>
                </div>
                <div className={`dropdown-body ${isOpenSortOldNew && "open"}`}>
                  {items.map((item) => (
                    <div
                      className="dropdown-item"
                      onClick={(e) => handleItemClick(e.target.id)}
                      id={item.id}
                      key={item.id}
                    >
                      <span
                        className={`dropdown-item-dot ${
                          item.id == selectedItem && "selected"
                        }`}
                      >
                        •{" "}
                      </span>
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="dropdown">
                <div className="dropdown-header" onClick={toggleDropdownMedia}>
                  {selectedMedia
                    ? items.find((item) => item.id == selectedMedia).label
                    : "Media Type"}
                  <i
                    className={`fa fa-chevron-right icon ${
                      isOpenMedia && "open"
                    }`}
                  ></i>
                </div>
                <div className={`dropdown-body ${isOpenMedia && "open"}`}>
                  {categories.map((category, key) => {
                    return (
                      <div className="flex mt-5 " key={key}>
                        <button
                          onClick={() => filterNFTs(category)}
                          className="bg-blue-100 text-blue-800 text-lg mr-3 px-5 py-2 rounded dark:bg-blue-900 dark:text-blue-300 font-bold "
                        >
                          {/* <input type="checkbox"></input>  */}
                          {category}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="dropdown">
                <div className="dropdown-header" onClick={toggleDropAvail}>
                  {selectedAvail
                    ? items.find((item) => item.id == selectedAvail).label
                    : "Availability"}
                  <i
                    className={`fa fa-chevron-right icon ${
                      isOpenAvail && "open"
                    }`}
                  ></i>
                </div>
                <div className={`dropdown-body ${isOpenAvail && "open"}`}>
                  <div className="flex justify-between">
                    <div className="all-buy"> All</div>
                    <div className="media-type"> Buy Now</div>
                  </div>
                </div>
              </div>

              <div className="dropdown">
                <div className="dropdown-header" onClick={togglePriceDropdown}>
                  {selectedPrice
                    ? items.find((item) => item.id == selectedPrice).label
                    : "price"}
                  <i
                    className={`fa fa-chevron-right icon ${
                      isopenprice && "open"
                    }`}
                  ></i>
                </div>
                <div className={`dropdown-body ${isopenprice && "open"}`}>
                  <div className="flex justify-between">
                    <div className="media-type"> Max</div>
                    <div className="media-type">Min</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 lg:gap-24 p-4">
              {data?.length
                ? data?.map((item) => {
                    return (
                      <div
                        key={item.itemId}
                        className=" border-white mycard p-3 shadow-lg w-full cursor-pointer"
                      >
                        <Link
                          key={item.itemId}
                          href={`/explore/${item.itemId}`}
                        >
                          <div>
                            <MarketPlaceCard {...item} />
                            <div className="flex items-center justify-between mb-2">
                              <div className="text-sm font-bold text-gray-500 dark:text-white">
                                Price{" "}
                              </div>
                              <div className="flex items-center">
                                <FaEthereum className="w-4 text-gray-500 dark:text-white" />
                                <div className="text-gray-500 dark:text-white font-semibold">
                                  {getEthPrice(item.price)} MATIC
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                        <button
                          onClick={() => buyNft(item)}
                          className="text-gray-500 dark:text-black bg-[#CAFC01] w-full rounded-md py-2 font-bold"
                        >
                          Buy Now
                        </button>
                      </div>
                    );
                  })
                : null}
            </div>
            {data?.length == 0 && (
              <div className="font-bold text-2xl">
                You have not created any NFT
              </div>
            )}

            <div className="h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {auction.length > 0 ? (
                auction.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className=" border-2 p-2.5 bg-white dark:bg-gray-900  rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-800"
                    >
                      <Link key={item.itemId} href={`/assets/${item.id}`}>
                        <div>
                          <HomeComp uri={item ? item.metadataURI : ""} />

                          <div>
                            <div className="font-bold mt-3">
                              Wallet Address :
                            </div>
                            <div className="text-xs">
                              {item.highestBidder.slice(-6)}
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
                  You have not created Any Auction
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};
export default Home;
