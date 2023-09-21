import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import Link from "next/link";
import HomeComp from "../../../Components/homeComp";
import { FaEthereum } from "react-icons/fa";
import { ethers } from "ethers";
import Loader from "../../../Components/Loader";
import Layout from "../../../Components/Layout";
import { useAccount } from "wagmi";

export default function CollectionItem() {

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

  const [modelmsg, setmodelmsg] = useState("buying in progress!");

  const fetchUserAssests = async (walletAddr) => {

    let result = [];
    if (signatureseries == "SignatureSeries") {
      const response = await fetch(`/api/sigseriescreated`);
      result = await response.json();
    }
    else if (signatureseries == "FusionSeries") {
      const response = await fetch(`/api/fusioncreated`);
      result = await response.json();
    }
    else if (signatureseries == "InstaGen") {
      const response = await fetch(`/api/instagencreated`);
      result = await response.json();
    }
    else if (signatureseries == "EternumPass") {
      const response = await fetch(`/api/eternumcreated`);
      result = await response.json();
    }
    console.log("graphql data", result);

    const contractaddr = { id };

    // Function to convert a transaction hash and compare it
    const convertAndCompareTransaction = async (transactionHash) => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const tx = await provider.getTransaction(transactionHash);
      console.log("transactionHash", transactionHash, "tx.to", tx.to);
      if (tx.to === contractaddr) {
        return true;
      }

      return false;
    };

    let filteredData = [];

    if (signatureseries == "SignatureSeries") {
      filteredData = result.signatureSeriesAssetCreateds.filter(async (item) => {
        const transactionHash = item.transactionHash;
        return await convertAndCompareTransaction(transactionHash); });
    }
    else if (signatureseries == "FusionSeries") {
      filteredData = result.fusionSeriesAssetCreateds.filter(async (item) => {
        const transactionHash = item.transactionHash;
        return await convertAndCompareTransaction(transactionHash); });
    }
    else if (signatureseries == "InstaGen") {
      filteredData = result.instaGenAssetCreated.filter(async (item) => {
        const transactionHash = item.transactionHash;
        return await convertAndCompareTransaction(transactionHash); });
    }
    else if (signatureseries == "EternumPass") {
      filteredData = result.fusionSeriesAssetCreateds.filter(async (item) => {
        const transactionHash = item.transactionHash;
        return await convertAndCompareTransaction(transactionHash); });
    }
    

    // const tx = await provider.getTransaction(txHash)
    // setCa(tx.to);
    // console.log("tx.to", tx.to)
    console.log("filteredData", filteredData);

    // Filter the data based on the transactionHash property
    // const filteredData = result.saleStarteds.filter((item) => item.transactionHash === "3628712395");

    setLoading(true);
    setData(filteredData);
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

  return (
    <Layout>
      <div>
        <h1>Collection Item Page</h1>
        <p>Signature Series: {signatureseries}</p>
        <p>contract address: {id}</p>
        {/* <p>Tx convertion: {ca}</p> */}
        {/* Display data for the specific collection item here */}
      </div>
      <div className="min-h-screen body-back">
        <div>
          <div className=" p-4 h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                              item id: {item?.tokenId} {/* {getEthPrice(item?.price)} MATIC */}
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
