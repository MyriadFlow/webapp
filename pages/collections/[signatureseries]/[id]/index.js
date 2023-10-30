import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import HomeComp from "../../../../Components/homeComp";
import { FaEthereum } from "react-icons/fa";
import { ethers } from "ethers";
import Loader from "../../../../Components/Loader";
import Layout from "../../../../Components/Layout";
import { useAccount } from "wagmi";
import FusionSeries from "../../../../artifacts/contracts/fusionseries/FusionSeries.sol/FusionSeries.json";
import etherContract from "../../../../utils/web3Modal";
import { useData } from "../../../../context/data";
import axios from "axios";
import EternumPass from "../../../../artifacts/contracts/eturnumpass/EternumPass.sol/EternumPass.json";
import Instagen from "../../../../artifacts/contracts/instagen/InstaGen.sol/InstaGen.json";

export default function CollectionItem() {
  const { resdata } = useData();

  const graphql = resdata?.Storefront.subgraphUrl;
  console.log(graphql);

  const regex = /^(.*?)(?=\/graphql)/;

  // Use the regular expression to extract the URL
  const match = graphql?.match(regex);

  // Extract the matched URL or set it to null if no match was found
  const graphqlAPI = match ? match[0] : null;
  console.log(graphqlAPI);

  const router = useRouter();
  const { signatureseries, id } = router.query;

  // Fetch data for the specific collection item based on signatureseries and id
  // You can use these parameters to fetch the relevant data from your data source

  function getEthPrice(price) {
    return ethers.utils.formatEther(price);
  }

  const walletAddr = useAccount().address;
  var wallet = walletAddr ? walletAddr[0] : "";
  const [data, setData] = useState([]);
  const [auction, setAuction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [model, setmodel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [modelmsg, setmodelmsg] = useState("buying in progress!");
  const [assetsData, setAsseetsData] = useState([]);
  const [num, setNum] = useState(null);

  const [categories, setCategory] = useState([
    "All",
    "Listed",
    "On Auction",
    "New",
    "Has Offers",
  ]);

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

  const pricefilter = () => {
    let filteredData = [...shallowData];
    filteredData = filteredData.filter(
      (item) =>
        getEthPrice(item.price) >= inputValue &&
        getEthPrice(item.price) <= inputmaxValue
    );

    setData(filteredData);
  };

  const fetchUserAssests = async (walletAddr) => {
    let result = [];
    // if (signatureseries == "SignatureSeries") {
    //   const response = await fetch(`/api/sigseriescreated?subgraphUrl=${graphqlAPI}`);
    //   result = await response.json();
    // }
    // else if (signatureseries == "FusionSeries") {
    //   const response = await fetch(`/api/fusioncreated?subgraphUrl=${graphqlAPI}`);
    //   result = await response.json();
    // }
    // else if (signatureseries == "InstaGen") {
    //   const response = await fetch(`/api/instagencreated?subgraphUrl=${graphqlAPI}`);
    //   result = await response.json();
    // }
    // else if (signatureseries == "EternumPass") {
    //   const response = await fetch(`/api/eternumcreated?subgraphUrl=${graphqlAPI}`);
    //   result = await response.json();
    // }
    // console.log("graphql data", result);

    const contractaddr = { id };

    // Function to convert a transaction hash and compare it
    const convertAndCompareTransaction = async (transactionHash) => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const tx = await provider.getTransaction(transactionHash);
      console.log("transactionHash", transactionHash, "tx.to", tx.to);
      console.log("here", id, " ", tx.to);
      if (tx.to === id) {
        return true;
      }

      return false;
    };

    if (signatureseries == "SignatureSeries") {
      const { id } = router.query;

      const getSignetureSeriesAssets = async () => {
        const endPoint = `${graphqlAPI}`;
        const headers = {
          "Content-Type": "application/json",
        };

        const AllBuildingQuery = `{
        signatureSeriesAssetCreateds(orderBy: id) {
          id
            tokenID
            creator
            metaDataURI
            blockNumber
            blockTimestamp
            transactionHash
        }
      }`;

        const graphqlQuery = {
          operationName: "signatureSeriesAssetCreateds",
          query: `query signatureSeriesAssetCreateds ${AllBuildingQuery}`,
          variables: {},
        };

        const response = await axios.post(endPoint, graphqlQuery, {
          headers: headers,
        });

        // const response = await fetch(`/api/soldgraph?walletAddress=${walletAddr}?subgraphUrl=${graphqlAPI}`);
        result = await response.data.data;

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let tranasactionHashArray = result.signatureSeriesAssetCreateds?.map(
          (asset) => asset.transactionHash
        );
        const innerContractAddress = [];
        await Promise?.all(
          tranasactionHashArray?.map(async (hash) => {
            const contractAddress = await provider.getTransaction(hash);
            if (contractAddress.to == id) {
              console.log(
                "Condition>>>",
                contractAddress.to == id,
                contractAddress.to,
                id
              );
              innerContractAddress.push(
                result.signatureSeriesAssetCreateds.find(
                  (asset) => asset.transactionHash === hash
                )
              );
            }
            setAsseetsData(innerContractAddress);
          })
        ).then(() => {
          console.log("innerContractAddress", innerContractAddress);
        });
      };

      await getSignetureSeriesAssets();
    } else if (signatureseries == "FusionSeries") {
      const { id } = router.query;

      const getSignetureSeriesAssets = async () => {
        const endPoint = `${graphqlAPI}`;
        const headers = {
          "Content-Type": "application/json",
        };

        const AllBuildingQuery = `{
        fusionSeriesAssetCreateds(orderBy: id) {
          amount
          blockNumber
          blockTimestamp
          creator
          id
          tokenID
          transactionHash
        }
      }`;

        const graphqlQuery = {
          operationName: "fusionSeriesAssetCreateds",
          query: `query fusionSeriesAssetCreateds ${AllBuildingQuery}`,
          variables: {},
        };

        const response = await axios.post(endPoint, graphqlQuery, {
          headers: headers,
        });

        // const response = await fetch(`/api/soldgraph?walletAddress=${walletAddr}?subgraphUrl=${graphqlAPI}`);
        result = await response.data.data;

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let tranasactionHashArray = result.fusionSeriesAssetCreateds?.map(
          (asset) => asset.transactionHash
        );

        const innerContractAddress = [];
        await Promise?.all(
          tranasactionHashArray?.map(async (hash) => {
            const contractAddress = await provider.getTransaction(hash);
            if (contractAddress.to == id) {
              console.log(
                "Condition>>>",
                contractAddress.to == id,
                contractAddress.to,
                id
              );
              // Find the asset with the matching transaction hash
              const asset = result.fusionSeriesAssetCreateds.find(
                (asset) => asset.transactionHash === hash
              );
              if (asset) {
                const fusionAddress = id;
                const fusioncontract = await etherContract(
                  fusionAddress,
                  FusionSeries.abi
                );
                // Fetch metadata for the item using values from the asset
                const tokenId = asset.tokenID; // Replace with the actual property name in your asset object
                const meta = await fusioncontract.uri(tokenId);
                console.log("meta data fusion", meta);
                // Create an object containing both the asset and its meta data
                asset.metaDataURI = meta;

                innerContractAddress.push(asset);
              }
            }
            setAsseetsData(innerContractAddress);
          })
        ).then(() => {
          console.log("innerContractAddress", innerContractAddress);
        });
      };

      await getSignetureSeriesAssets();
    } else if (signatureseries == "InstaGen" && result != null) {
      const { id } = router.query;

      const getSignetureSeriesAssets = async () => {
        const endPoint = `${graphqlAPI}`;
        const headers = {
          "Content-Type": "application/json",
        };

        const AllBuildingQuery = `{
        instaGenAssetCreateds(orderBy: id){
          creator
          blockNumber
          blockTimestamp
          currentIndex
          id
          quantity
          transactionHash
          }
        }`;

        const graphqlQuery = {
          operationName: "instaGenAssetCreateds",
          query: `query instaGenAssetCreateds ${AllBuildingQuery}`,
          variables: {},
        };

        const response = await axios.post(endPoint, graphqlQuery, {
          headers: headers,
        });

        // const response = await fetch(`/api/soldgraph?walletAddress=${walletAddr}?subgraphUrl=${graphqlAPI}`);
        result = await response.data.data;

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let tranasactionHashArray = result.instaGenAssetCreateds?.map(
          (asset) => asset.transactionHash
        );
        const innerContractAddress = [];
        await Promise?.all(
          tranasactionHashArray?.map(async (hash) => {
            const contractAddress = await provider.getTransaction(hash);
            if (contractAddress.to == id) {
              console.log(
                "Condition>>>",
                contractAddress.to == id,
                contractAddress.to,
                id
              );
              innerContractAddress.push(
                result.instaGenAssetCreateds.find(
                  (asset) => asset.transactionHash === hash
                )
              );
            }
            setAsseetsData(innerContractAddress);
          })
        ).then(() => {
          console.log("innerContractAddress", innerContractAddress);
        });
      };

      await getSignetureSeriesAssets();
    } else if (signatureseries == "EternumPass") {
      const { id } = router.query;

      const getSignetureSeriesAssets = async () => {
        const endPoint = `${graphqlAPI}`;
        const headers = {
          "Content-Type": "application/json",
        };

        const AllBuildingQuery = `{
        nftminteds(orderBy: id) {
          id
    owner
    tokenId
    transactionHash
    blockTimestamp
    blockNumber
        }
      }`;

        const graphqlQuery = {
          operationName: "nftminteds",
          query: `query nftminteds ${AllBuildingQuery}`,
          variables: {},
        };

        const response = await axios.post(endPoint, graphqlQuery, {
          headers: headers,
        });

        // const response = await fetch(`/api/soldgraph?walletAddress=${walletAddr}?subgraphUrl=${graphqlAPI}`);
        result = await response.data.data;

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        let tranasactionHashArray = result.nftminteds?.map(
          (asset) => asset.transactionHash
        );
        const innerContractAddress = [];
        await Promise?.all(
          tranasactionHashArray?.map(async (hash) => {
            const contractAddress = await provider.getTransaction(hash);
            if (contractAddress.to == id) {
              console.log(
                "Condition>>>",
                contractAddress.to == id,
                contractAddress.to,
                id
              );
              innerContractAddress.push(
                result.nftminteds.find(
                  (asset) => asset.transactionHash === hash
                )
              );
            }
            setAsseetsData(innerContractAddress);
          })
        ).then(() => {
          console.log("innerContractAddress", innerContractAddress);
        });
      };

      await getSignetureSeriesAssets();
    }

    setLoading(true);
    // setData(filteredData);
    setLoading(false);
  };

  async function loadNFTs() {
    setLoadingState("loaded");
  }

  useEffect(() => {
    if (!localStorage.getItem("platform_wallet") && wallet !== undefined) {
      localStorage.setItem("platform_wallet", wallet);
    } else {
    }
    fetchUserAssests();
  }, []);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  });

  const handlenumberChange = (event) => {
    const newnum = event.target.valueAsNumber; // Parse the input value as a number
    setNum(newnum);
  };

  async function subscribeNft() {
    setmodelmsg("Buying in Progress");
    setLoading(true);
    const eternumcontract = await etherContract(id, EternumPass.abi);
    const pubSalePrice = await eternumcontract.publicSalePrice();
    await eternumcontract.subscribe({ value: pubSalePrice });
    setLoading(false);
    setShowModal(false);
  }

  async function mintNft() {
    setmodelmsg("Buying in Progress");
    setLoading(true);
    const instagencontract = await etherContract(id, Instagen.abi);
    const saleprice = await instagencontract.salePrice();
    // const finalprice = ethers.utils.parseEther((saleprice).toString())*num;
    await instagencontract.mint(num, { value: saleprice.mul(num) });
    setLoading(false);
    setShowModal2(false);
  }

  return (
    <Layout>
      {/* <div>{id}</div> */}
      <div className="min-h-screen body-back">
        {showModal && (
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
                    </div>

                    <div class="flex p-10 ml-10">
                      {/* <input type="file" className="btn btn-primary btn-md ml-36" style={{ marginBottom: 20, marginTop: 20, width: "50%" }} onChange={(e) => { uploadImage(e) }} /> */}
                      <div className="w-1/2">
                        <div class="items-center mb-4 justify-between">
                          <div>
                            <h3 className="text-2xl font-semibold text-gray-900">
                              Name
                            </h3>
                            <p className="font-semibold text-gray-900">
                              Thecgfj
                            </p>
                          </div>
                          <div class="items-center mb-4 justify-between mt-4">
                            <div>
                              <h3 className="text-2xl font-semibold text-gray-900">
                                Description
                              </h3>
                              <p className="font-semibold text-gray-900">
                                Thehdj
                              </p>
                            </div>
                          </div>
                          <div class="items-center mb-4 justify-between">
                            <div>
                              <h3 className="text-2xl font-semibold text-gray-900">
                                Price
                              </h3>
                              <p className="font-semibold text-gray-900">
                                0.038
                              </p>
                            </div>
                          </div>
                          <button
                            className="text-white bg-blue-500 text-sm px-20 py-3 mt-4 rounded-full border border-white shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => subscribeNft()}
                          >
                            Subscribe
                          </button>
                        </div>
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
        )}

        {showModal2 && (
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
                      <button onClick={() => setShowModal2(false)}>
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
                    </div>

                    <div class="flex p-10 ml-10">
                      {/* <input type="file" className="btn btn-primary btn-md ml-36" style={{ marginBottom: 20, marginTop: 20, width: "50%" }} onChange={(e) => { uploadImage(e) }} /> */}
                      <div className="w-1/2">
                        <div>Enter No. of NFTs</div>
                        <input
                          type="number"
                          id="default-input"
                          placeholder="Enter number"
                          value={num}
                          onChange={handlenumberChange}
                          className="my-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required
                        />
                        <div class="items-center mb-4 justify-between">
                          <div className="flex">
                            <h3 className="text-2xl font-semibold text-gray-900">
                              Price
                            </h3>
                            <p className="text-2xl font-semibold text-gray-900 ml-4">
                              0.038
                            </p>
                          </div>

                          <button
                            className="text-white bg-blue-500 text-sm px-20 py-3 mt-4 rounded-full border border-white shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => mintNft()}
                          >
                            Mint
                          </button>
                        </div>
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
        )}
        <div
          className="w-full h-72 object-cover bg-gray-200"
          style={{
            backgroundImage: `url("/image181.png")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></div>

        <div className="flex lg:flex-row md:flex-row flex-col items-center justify-start lg:-mt-24 md:-mt-24 -mt-16 lg:ml-16 md:ml-16">
          <div className="rounded-xl h-48 w-48 ring-offset-2 ring-1 ring-black bg-gray-200">
            {/* <img
                                className="text-3xl text-gray-500 w-48 h-48 rounded-xl"
                                alt=""
                                src={resdata?.Storefront.Profileimage}
                            /> */}
                            <img
                                className="text-3xl text-gray-500 w-48 h-48 rounded-xl"
                                alt=""
                                src="/monkey.png"
                            />
          </div>
        </div>

        {signatureseries == "EternumPass" && (
          <div className="flex items-center md:justify-end lg:-my-16 lg:mx-8 md:-my-16 md:mx-8 mt-8 justify-center lg:justify-end">
            <button
              className="bg-blue-500 text-white text-sm px-8 py-3 rounded-full border border-white shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => setShowModal(true)}
            >
              Subscribe
            </button>
          </div>
        )}
        {signatureseries == "InstaGen" && (
          <div className="flex items-center md:justify-end lg:-my-16 lg:mx-8 md:-my-16 md:mx-8 mt-8 justify-center lg:justify-end">
            <button
              className="bg-blue-500 text-white text-sm px-8 py-3 rounded-full border border-white shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => setShowModal2(true)}
            >
              Mint NFT
            </button>
          </div>
        )}
        <div className="ml-16 mt-10 text-2xl font-bold">{signatureseries}</div>
        <div className="ml-16 mt-4 text-xl font-bold">By Owner name</div>
        <div className="flex lg:flex-row md:flex-row flex-col mb-10">
        <div className="ml-16 mt-4 text-xl font-bold">Items {assetsData.length}</div>
        <div className="lg:ml-8 ml-16 mt-4 text-xl font-bold">Created oct 2023</div>
        <div className="lg:ml-8 ml-16 mt-4 text-xl font-bold">Chain Polygon</div>
        <div className="lg:ml-8 ml-16 mt-4 text-xl font-bold">Category</div>
        </div>

        <div className="lg:flex">

<div>
              <div className="dropdown2 lg:ml-16 md:ml-16 mt-10 ml-4">
                 <div className="text-xl font-bold">Status</div>
                    <div className={`dropdown-body-media ${true && "open"}`}>
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

                  <div className="dropdown2 lg:ml-16 md:ml-16 mt-10 ml-4">
                <div className="text-xl font-bold">
                  Price
                </div>
                <div className={`dropdown-body ${true && "open"}`}>
                  <div className="flex justify-between">
                    <div className="input-type">
                      <input
                        className="input-number"
                        id="mininput"
                        type="number"
                        placeholder="Min"
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
              </div>

        <div className="text-center lg:w-3/4 mt-10">
          
            {assetsData?.length > 0 ? (
              assetsData?.map((item) => {
                return (
                  <div className=" p-4 h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div
                    key={item.tokenID}
                    className=" border-2 p-2.5 rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-500"
                  >
                    <Link
                      key={item?.tokenID}
                      href={`/collections/${signatureseries}/${id}/${item?.tokenID}`}
                    >
                      <div>
                        {(signatureseries == "InstaGen" ||
                          signatureseries == "EternumPass") && (
                          <img src="https://cloudflare-ipfs.com/ipfs/bafybeigyw25q6g6qetggruuocduhbxf6a7vrppl6lskve2th2lin37thnm" />
                        )}

                        {signatureseries != "InstaGen" &&
                          signatureseries != "EternumPass" && (
                            <HomeComp uri={item ? item?.metaDataURI : ""} />
                          )}
                        {/* <HomeComp uri={item ? item?.metaDataURI : ""} /> */}

                        <div className=" flex items-center justify-between mb-2">
                          <div className="font-1 text-sm font-bold mt-3">
                            {/* Price:{" "} */}
                          </div>
                          <div className="flex items-center ml-4">
                            {/* <FaEthereum className="h-4 w-4 text-blue-400" /> */}
                            <div className="font-extralight dark:text-gray-400 ml-4">
                              {/* token id: {item?.tokenID} {getEthPrice(item?.price)} MATIC */}

                              {/* meta: {uri(item?.tokenId)} */}
                            </div>
                          </div>
                        </div>
                        <div class="flex">
                          <div className="font-bold">Rental Status: </div>
                          {/* <div className="text-md ml-2">{item?.buyer.slice(-6)}</div> */}
                        </div>
                      </div>
                    </Link>
                  </div>
                  </div>
                );
              })
            ) : loading ? (
              <Loader />
            ) : (
              <div className="text-2xl pb-10 text-center font-bold text-gray-500 dark:text-white">
                No assets in this collection.
              </div>
            )}
          </div>
        </div>
        </div>
    </Layout>
  );
}
