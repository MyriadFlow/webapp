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
import Loader from "../Components/Loader";
import Layout from "../Components/Layout";
import { getMetaData, removePrefix } from "../utils/ipfsUtil";
import { MarketPlaceCard } from "../Components/Cards/MarketPlaceCard";
import { NavLink } from "reactstrap";
import { useRouter } from "next/router";
import HomeComp from "../Components/homeComp";
import { buyItem } from "../pages/api/buyItem";
import { saleStartedQuery } from "../utils/gqlUtil";
import axios from "axios";
import etherContract from "../utils/web3Modal";
import Tradhub from "../artifacts/contracts/tradehub/TradeHub.sol/TradeHub.json";
import { useAccount } from "wagmi";
import { useData } from "../context/data";

const BASE_URL = "https://testnet.launch.myriadflow.com/";

const Home = () => {
  const walletaddr = useAccount().address;

  const { resdata } = useData();

  const graphql = resdata?.Storefront.subgraphUrl;
  // console.log(graphql);

  const regex = /^(.*?)(?=\/graphql)/;

  // Use the regular expression to extract the URL
  const match = graphql?.match(regex);

  // Extract the matched URL or set it to null if no match was found
  const graphqlAPI = match ? match[0] : null;
  console.log(graphqlAPI);

  const allfilter = {
    minPrice: 0.1,
    maxPrice: 100,
    allassets: "",
    buynow: "",
    availability: "",
  };

  const onUpdatefilter = (e) => {
    const { name, value } = e.target;
    setfiltersection({ ...filterSection, [name]: value });
  };

  const router = useRouter();
  const [sortOldNew, setsortOldNew] = useState("Newest");
  const [filterSection, setfiltersection] = useState({ ...allfilter });
  const [inputValue, setInputValue] = useState(0); // Initial value can be set accordingly

  const handleInputChange = (e) => {
    const newValue = e.target.value; // Convert to float or integer as needed
    setInputValue(newValue);
  };

  const [inputmaxValue, setInputmaxValue] = useState(100); // Initial value can be set accordingly

  const handleInputmaxChange = (e) => {
    const newValue = e.target.value; // Convert to float or integer as needed
    setInputmaxValue(newValue);
  };

  const [allnfts, setAllNFTs] = useState([]);
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
  const [page, setPage] = useState("sale");

  const datasort = [
    { id: 0, label: sortOldNew },
    { id: 1, label: sortOldNew },
  ];

  const handleButtonClick = () => {
    market("new"); // Call the market function with 'new'
    setbuttonstyle("new");
  };

  const handleoldButtonClick = () => {
    market("old"); // Call the market function with 'new'
    setbuttonstyle("old");
  };

  const [buttonstyle, setbuttonstyle] = useState(null);

  const [isOpenSortOldNew, setOpenSortOldNew] = useState(false);
  const toggleDropdownSort = () => setOpenSortOldNew(!isOpenSortOldNew);
  const [isOpenMedia, setOpenMedia] = useState(false);
  const toggleDropdownMedia = () => setOpenMedia(!isOpenMedia);
  const [isOpenAvail, setOpenAvail] = useState(false);
  const toggleDropAvail = () => setOpenAvail(!isOpenAvail);
  const [isOpenCreator, setOpenCreator] = useState(false);
  const toggleDropCreator = () => setOpenCreator(!isOpenCreator);
  const [isopenprice, setOpenPrice] = useState(false);
  const togglePriceDropdown = () => setOpenPrice(!isopenprice);
  const [isOpenChain, setOpenChain] = useState(false);
  const toggleDropChain = () => setOpenChain(!isOpenChain);
  const [isOpenContract, setOpenContract] = useState(false);
  const toggleDropContract = () => setOpenContract(!isOpenContract);
  const [items, setItem] = useState(datasort);
  const [hidefilter, setHideFilter] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedMedia, setSelectMedia] = useState(null);
  const [selectedPrice, setSelectPrice] = useState(null);
  const [selectedAvail, setSelectedAvail] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [selectedChain, setSelectedChain] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
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
    setCategory(data.categories);
  };

  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  });

  const pricefilter = () => {
    let filteredData = [...shallowData];
    filteredData = filteredData.filter(
      (item) =>
        getEthPrice(item.price) >= inputValue &&
        getEthPrice(item.price) <= inputmaxValue
    );

    setData(filteredData);
  };

  useEffect(() => {
    // Filter data based on min and max prices
    pricefilter();
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
    console.log("show all", [...shallowData]);
    let localData = [...shallowData];
    localData = localData.filter((item) => {
      if (item?.categories?.length && item?.categories?.includes(cat)) {
        return true;
      }
      return false;
    });
    setData(localData);
  };
  async function buyNft(nft) {
    setmodelmsg("Buying in Progress");
    setLoading(true);
    await buyItem(nft, 1, setmodel, setmodelmsg);
    router.push("/dashboard");
    setLoading(false);
  }
  useEffect(() => {
    filterNFTs();
  }, []);
  const AddLike = (itemId) => {
    const token = walletaddr;
    axios
      .post(
        `${BASE_URL}/api/v1.0/like/addUserLike/${itemId}`,
        {},
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (response) => {
        console.log("addlike data", response);
        await axios.post(
          `${BASE_URL}/api/v1.0/wishlist/addToUserWishlist/${itemId}`,
          {},
          {
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      })

      .catch((error) => {
        console.log("err", error);
      });
  };

  const applyFilter = (type) => {
    let filterproducts = [...data];
    switch (type) {
      case "price":
        filterproducts = filterproducts.filter(
          (item) =>
            item.price >= filterSection.minPrice &&
            item.price <= filterSection.maxPrice
        );
        setData(filterproducts);
        break;
      default:
        setData(filterproducts);
    }
  };
  const market = async (sortType) => {
    const refineArray = {};
    refineArray.saleStarteds = [];
let result = {};
    if(graphqlAPI)
    {
      const endPoint = `${graphqlAPI}`;
      const headers = {
        "Content-Type": "application/json",
      };

      const AllBuildingQuery = `{
        saleStarteds(orderBy: id,where: {itemId_not: "3"}) {
          itemId
      metaDataURI
      nftContract
      seller
      tokenId
      id
      price
      transactionHash
      blockTimestamp
      blockNumber
    }
  }`;

      const graphqlQuery = {
        operationName: "saleStarteds",
        query: `query saleStarteds ${AllBuildingQuery}`,
        variables: {},
      };

      const response = await axios.post(endPoint, graphqlQuery, { headers: headers });

      // const response = await fetch(`/api/soldgraph?walletAddress=${walletAddr}?subgraphUrl=${graphqlAPI}`);
      result = await response.data.data;
  
    console.log("result", result);

    const status = async () => {
      const tokenTimestampMap = {};

      for (const obj of result.saleStarteds) {
        const tradhubAddress = "0x2B6c5bd1da04BCcf7186879288a0E6dF266BcA17";
        const tradhubContarct = await etherContract(
          tradhubAddress,
          Tradhub.abi
        );
        const transaction = await tradhubContarct.idToMarketItem(obj.itemId);
        console.log("id" + obj.itemId);
        console.log("transaction", transaction);
        console.log("transaction", transaction.status == 1);

        if (transaction.status == 1) {
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
        refineArray.saleStarteds = Object.values(tokenTimestampMap);
      }
  
    };

    await status();
    console.log(refineArray);
    console.log("sale assets count", refineArray.saleStarteds.length);
}

    let fResult = [];

    if (refineArray.saleStarteds.length > 0) {
      fResult = await Promise.all(
        refineArray.saleStarteds.map(async function (obj, index) {
          const nftData = await getMetaData(obj.metaDataURI);
          const { name, description, categories, image } = nftData;
          const likeCount = await getLikes(obj.itemId);
          const date = new Date(
            parseInt(obj.blockTimestamp + "000")
          ).toDateString();
          console.log("date", date);
          return {
            ...obj,
            date,
            likeCount,
            name,
            description,
            categories: categories,
            image: nftData?.image
              ? `https://cloudflare-ipfs.com/ipfs/${removePrefix(image)}`
              : "",
          };
        })
      );
    }

    let sortedNFts;

    if (sortType === "new") {
      sortedNFts = [...fResult]
        .filter(
          (item) =>
            new Date(item.date).getMonth() ===
              (new Date().getMonth() - 1 + 12) % 12 ||
            new Date(item.date).getMonth() === new Date().getMonth()
        )
        .sort((a, b) => {
          const dateComparison = new Date(a.date) - new Date(b.date);
          if (dateComparison === 0) {
            return a.itemId - b.itemId;
          }
          return dateComparison;
        });
    } else if (sortType === "old") {
      sortedNFts = [...fResult].sort((a, b) => {
        const dateComparison = new Date(a.date) - new Date(b.date);
        if (dateComparison === 0) {
          return a.itemId - b.itemId;
        }
        return dateComparison;
      });
    } else {
      sortedNFts = [...fResult].sort((a, b) => a.itemId - b.itemId);
    }

    setData(sortedNFts);
    setItem(sortedNFts);
    setAllNFTs(sortedNFts);
    setsortOldNew(sortOldNew);
    setShallowData(sortedNFts);
  };

  useEffect(() => {
    market();
  }, []);
  useEffect(() => {
    fetchAuction();
  }, []);

  const handleItemClick = (id) => {
    selectedItem == id ? setSelectedItem(null) : setSelectedItem(id);
  };
  const getLikes = async (itemId) => {
    try {
      const token = walletaddr;
      const config = {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}/api/v1.0/like/allUsersLikesCount/${itemId}`,
        config
      );
      return data.payload;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
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
    const refineArray = {};
    refineArray.auctionStarteds = [];
    const response = await fetch("/api/auctionput");
    const result = await response.json();
    console.log("result", response);
    setLoading(true);
    // setAuction(result.auctionStarteds);
    setLoading(false);
  };
  return (
    <Layout
      title="Explore"
      description="Shows the created categories of the Nfts"
    >
      {model && <BuyAsset open={model} setOpen={setmodel} message={modelmsg} />}

      <main className="dark:body-back body-back-light min-h-screen">
        <div className="border-b py-4 w-full flex justify-evenly">
          <div
            className={`rounded-full text-center text-gray-700 dark:text-gray-200 dark:hover:bg-white dark:hover:text-gray-800 hover:bg-blue-500 cursor-pointer px-20 py-3 border-b-2 border-transparent transition-all ${
              page === "sale" ? "dark:bg-white bg-blue-500 text-white dark:text-gray-800" : ""
            }`}
            onClick={() => setPage("sale")}
          >
            <div className="text-sm lg:text-xl md:text-lg font-semibold">
              Sale
            </div>
          </div>
          <div
            className={`rounded-full text-center text-gray-700 dark:text-gray-200 dark:hover:bg-white dark:hover:text-gray-800 hover:bg-blue-500 cursor-pointer px-16 py-3 border-b-2 border-transparent transition-all ${
              page === "auction" ? "dark:bg-white bg-blue-500 text-white dark:text-gray-800" : ""
            }`}
            onClick={() => setPage("auction")}
          >
            <div className="text-sm lg:text-xl md:text-lg font-semibold">
              Auction
            </div>
          </div>
        </div>

        <button
          data-drawer-target="logo-sidebar"
          data-drawer-toggle="logo-sidebar"
          aria-controls="logo-sidebar"
          type="button"
          onClick={() => {
            setHideFilter(!hidefilter);
          }}
          className="inline-flex items-center p-2 mt-2 ml-6 text-xl text-gray-800 dark:text-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="mr-36">Sort assets</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>

        {/* <div>
          <div
            className={`fa fa-chevron-right hide ${hidefilter && "open"}`}
            onClick={() => {
              setHideFilter(!hidefilter);
            }}
          >
            Hide Filter
          </div>
        </div> */}
        <div className="flex lg:flex-row md:flex-row flex-col">
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
                  <div className="flex justify-between mt-5">
                    <button
                      className={`bg-blue-500 font-bold py-2 px-8 rounded-full ${
                        buttonstyle === "new"
                          ? "bg-white text-black"
                          : "text-white hover:bg-white hover:text-black"
                      }`}
                      onClick={handleButtonClick}
                    >
                      Newest
                    </button>
                    <button
                      className={`bg-blue-500 font-bold py-2 px-10 rounded-full ${
                        buttonstyle === "old"
                          ? "bg-white text-black"
                          : "text-white hover:bg-white hover:text-black"
                      }`}
                      onClick={handleoldButtonClick}
                    >
                      Oldest
                    </button>
                  </div>

                  {items
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((item) => {
                      return (
                        <div
                          className="dropdown-item"
                          onClick={(e) => handleItemClick(e.target.itemId)}
                          id={item.itemId}
                          key={item.itemId}
                        >
                          <span
                            className={`dropdown-item-dot ${
                              item.itemId == selectedItem && "selected"
                            }`}
                          >
                            {" "}
                          </span>
                          {item.date}
                        </div>
                      );
                    })}
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
                <div className={`dropdown-body-media ${isOpenMedia && "open"}`}>
                  {categories.map((category, key) => {
                    return (
                      <div className="flex mt-5 " key={key}>
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
                  <div className="flex justify-between mt-5">
                    <div
                      onClick={() => applyFilter("availibility", "allassets")}
                      value={filterSection.allassets}
                      className="all-buy"
                    >
                      {" "}
                      All
                    </div>
                    <div
                      onClick={() => applyFilter("buyNow", "allassets")}
                      value={filterSection.buynow}
                      className="media-type"
                    >
                      {" "}
                      Buy Now
                    </div>
                  </div>
                </div>
              </div>

              <div className="dropdown">
                <div className="dropdown-header" onClick={toggleDropCreator}>
                  {selectedCreator
                    ? items.find((item) => item.id == selectedCreator).label
                    : "Creator Status"}
                  <i
                    className={`fa fa-chevron-right icon ${
                      isOpenCreator && "open"
                    }`}
                  ></i>
                </div>
                <div className={`dropdown-body ${isOpenCreator && "open"}`}>
                  <div className="flex justify-between mt-5">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded-full">
                      All
                    </button>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 rounded-full">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>

              <div className="dropdown">
                <div className="dropdown-header" onClick={togglePriceDropdown}>
                  {selectedPrice
                    ? items.find((item) => item.id == selectedPrice).label
                    : "Price"}
                  <i
                    className={`fa fa-chevron-right icon ${
                      isopenprice && "open"
                    }`}
                  ></i>
                </div>
                <div className={`dropdown-body ${isopenprice && "open"}`}>
                  <div className="flex justify-between">
                    <div className="input-type">
                      <input
                        className="input-number"
                        id="mininput"
                        type="number"
                        placeholder="Min"
                        // name='min'
                        // min={0.1}
                        // value={filterSection.minPrice}
                        // onChange={(e) => applyFilter("price", e.target.value)}

                        value={inputValue}
                        onChange={handleInputChange}
                      ></input>
                    </div>
                    <div className="input-type ml-3">
                      <input
                        className="input-number"
                        id="maxinput"
                        type="number"
                        placeholder="Max"
                        // max={100}
                        // name="maxPrice"
                        // value={filterSection.maxPrice}
                        // onChange={(e) => {
                        //   onUpdatefilter(e)
                        //   applyFilter("price", e.target.value)
                        // }}
                        value={inputmaxValue}
                        onChange={handleInputmaxChange}
                      ></input>
                    </div>
                    <div className="m-2 p-2 mt-4 rounded bg-blue-100 dark:bg-blue-900">
                      <button
                        className="text-blue-500 dark:text-blue-200"
                        onClick={pricefilter}
                      >
                        Filter
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dropdown">
                <div className="dropdown-header" onClick={toggleDropChain}>
                  {selectedChain
                    ? items.find((item) => item.id == selectedChain).label
                    : "Chain"}
                  <i
                    className={`fa fa-chevron-right icon ${
                      isOpenChain && "open"
                    }`}
                  ></i>
                </div>
                <div className={`dropdown-body ${isOpenChain && "open"}`}>
                  <ul
                    className="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownCheckboxButton"
                  >
                    <li>
                      <div className="flex items-center">
                        <input
                          id="checkbox-item-1"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="checkbox-item-1"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Ethereum
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <input
                          id="checkbox-item-2"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="checkbox-item-2"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Polygon
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <input
                          id="checkbox-item-3"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="checkbox-item-3"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Optimism
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <input
                          id="checkbox-item-4"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="checkbox-item-4"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Arbitrum
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="dropdown">
                <div className="dropdown-header" onClick={toggleDropContract}>
                  {selectedContract
                    ? items.find((item) => item.id == selectedContract).label
                    : "Contract"}
                  <i
                    className={`fa fa-chevron-right icon ${
                      isOpenContract && "open"
                    }`}
                  ></i>
                </div>
                <div className={`dropdown-body ${isOpenContract && "open"}`}>
                  <ul
                    className="p-3 space-y-3 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="dropdownCheckboxButton"
                  >
                    <li>
                      <div className="flex items-center">
                        <input
                          id="checkbox-item-5"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="checkbox-item-5"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Edition
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <input
                          id="checkbox-item-6"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="checkbox-item-6"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Rentable
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <input
                          id="checkbox-item-7"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="checkbox-item-7"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Crescendo
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <input
                          id="checkbox-item-8"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="checkbox-item-8"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          ZKEdition
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <input
                          id="checkbox-item-9"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="checkbox-item-9"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Staking
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center">
                        <input
                          id="checkbox-item-10"
                          type="checkbox"
                          value=""
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="checkbox-item-10"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Treasury
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          {page == "sale" && (
            <div className="my-10 lg:mx-6 md:mx-4 mx-0 h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
              {data?.length ? (
                data?.map((item) => {
                  return (
                    <div
                      key={item?.itemId}
                      className=" border-white mycard p-3 shadow-lg w-full cursor-pointer"
                    >
                      <Link
                        key={item?.itemId}
                        href={`/explore/${item?.itemId}`}
                      >
                        <div>
                          <HomeComp uri={item ? item?.metaDataURI : ""} />
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-bold text-gray-500 dark:text-white">
                              Price{" "}
                            </div>
                            <div className="flex items-center">
                              <FaEthereum className="w-4 text-gray-500 dark:text-white" />
                              <div className="text-gray-500 dark:text-white font-semibold">
                                {getEthPrice(item?.price)} MATIC
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      {/* <button onClick={() => AddLike(item?.itemId)}>
                      likes:{item?.likeCount}
                      {item?.date}
                      {item?.categories}
                    </button> */}

                      <button
                        onClick={() => buyNft(item)}
                        className="text-gray-500 dark:text-black bg-[#CAFC01] w-full rounded-md py-2 font-bold"
                      >
                        Buy Now
                      </button>
                    </div>
                  );
                })
              ) : loading ? (
                <Loader />
              ) : (
                !loading &&
                !data && (
                  <div className="flex">
                    <div className="text-2xl pb-10 font-bold text-center text-gray-500 dark:text-white">
                      You have not created Any Assets
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {page == "auction" && <div className="p-4 px-10">auction data</div>}

          {/* <div className=" p-4">
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
            </div> */}
        </div>
      </main>
    </Layout>
  );
};
export default Home;
