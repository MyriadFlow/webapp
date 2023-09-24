import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import Link from "next/link";
import HomeComp from "../../../../Components/homeComp";
import { FaEthereum } from "react-icons/fa";
import { ethers } from "ethers";
import Loader from "../../../../Components/Loader";
import Layout from "../../../../Components/Layout";
import { useAccount } from "wagmi";
import FusionSeries from '../../../../artifacts/contracts/fusionseries/FusionSeries.sol/FusionSeries.json';
import etherContract from "../../../../utils/web3Modal";
import { useData } from "../../../../context/data";

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

  const [modelmsg, setmodelmsg] = useState("buying in progress!");
  const [assetsData, setAsseetsData] = useState([]);

  const fetchUserAssests = async (walletAddr) => {

    let result = [];
    if (signatureseries == "SignatureSeries") {
      const response = await fetch(`/api/sigseriescreated?subgraphUrl=${graphqlAPI}`);
      result = await response.json();
    }
    else if (signatureseries == "FusionSeries") {
      const response = await fetch(`/api/fusioncreated?subgraphUrl=${graphqlAPI}`);
      result = await response.json();
    }
    else if (signatureseries == "InstaGen") {
      const response = await fetch(`/api/instagencreated?subgraphUrl=${graphqlAPI}`);
      result = await response.json();
    }
    else if (signatureseries == "EternumPass") {
      const response = await fetch(`/api/eternumcreated?subgraphUrl=${graphqlAPI}`);
      result = await response.json();
    }
    console.log("graphql data", result);

    const contractaddr = { id };

    // Function to convert a transaction hash and compare it
    const convertAndCompareTransaction = async (transactionHash) => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const tx = await provider.getTransaction(transactionHash);
      console.log("transactionHash", transactionHash, "tx.to", tx.to);
      console.log("here", id, " ", tx.to)
      if (tx.to === id) {
        return true;
      }

      return false;
    };

    if (signatureseries == "SignatureSeries") {

      const { id } = router.query;

      const getSignetureSeriesAssets = async () => {
        const response = await fetch(`/api/sigseriescreated?subgraphUrl=${graphqlAPI}`);
        result = await response.json();

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
                result.signatureSeriesAssetCreateds.find((asset) => asset.transactionHash === hash)
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
    else if (signatureseries == "FusionSeries") {
      const { id } = router.query;
      
      const getSignetureSeriesAssets = async () => {
        const response = await fetch(`/api/fusioncreated?subgraphUrl=${graphqlAPI}`);
        result = await response.json();

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
                const fusioncontract = await etherContract(fusionAddress, FusionSeries.abi)
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
    }
    else if (signatureseries == "InstaGen" && result != null) {
      const { id } = router.query;

      const getSignetureSeriesAssets = async () => {
        const response = await fetch(`/api/instagencreated?subgraphUrl=${graphqlAPI}`);
        result = await response.json();

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
                result.instaGenAssetCreateds.find((asset) => asset.transactionHash === hash)
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
    else if (signatureseries == "EternumPass") {
      const { id } = router.query;

      const getSignetureSeriesAssets = async () => {
        const response = await fetch(`/api/eternumcreated?subgraphUrl=${graphqlAPI}`);
        result = await response.json();

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
                result.signatureSeriesAssetCreateds.find((asset) => asset.transactionHash === hash)
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

  return (
    <Layout>
      {/* <div>{id}</div> */}
      <div className="min-h-screen body-back">
        <div
          className="w-full h-72 object-cover bg-gray-200" style={{
            backgroundImage: `url("")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}>
        </div>

        <div className="flex lg:flex-row md:flex-row flex-col items-center justify-start lg:-mt-24 md:-mt-24 -mt-16 lg:ml-16 md:ml-16">
          <div className="rounded-xl h-48 w-48 ring-offset-2 ring-1 ring-black bg-gray-200" >
            {/* <img
                                className="text-3xl text-gray-500 w-48 h-48 rounded-xl"
                                alt=""
                                src={resdata?.Storefront.Profileimage}
                            /> */}
          </div>
        </div>
        <div className='ml-16 mt-10 text-2xl font-bold'>
          {signatureseries
          }
        </div>
        <div>
          <div className=" p-4 h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {assetsData?.length > 0 ? (
              assetsData?.map((item) => {
                return (
                  <div
                    key={item.tokenID}
                    className=" border-2 p-2.5 rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-500"
                  >
                    <Link key={item?.tokenID} href={`/collections/${signatureseries}/${id}/${item?.id}`}>
                      <div>
                        <HomeComp uri={item ? item?.metaDataURI : ""} />

                        <div className=" flex items-center justify-between mb-2">
                          <div className="font-1 text-sm font-bold mt-3">
                            Price:{" "}
                          </div>
                          <div className="flex items-center ml-4">
                            <FaEthereum className="h-4 w-4 text-blue-400" />
                            <div className="font-extralight dark:text-gray-400 ml-4">
                              token id: {item?.tokenID} {/* {getEthPrice(item?.price)} MATIC */}

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
