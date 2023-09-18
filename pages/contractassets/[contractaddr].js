import { useEffect, useState } from "react";
import { selectUser } from "../../slices/userSlice";
import { useSelector } from "react-redux";
import Link from "next/link";
import HomeComp from "../../Components/homeComp";
import { FaEthereum } from "react-icons/fa";
import { ethers } from "ethers";
import Loader from "../../Components/Loader";
import Web3Modal from "web3modal";
import Layout from "../../Components/Layout";

const Asset = ({ address }) => {

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

    const response = await fetch(`/api/salegraph`);
    const result = await response.json();
    console.log("graphql data", result);

    const web3Modal = new Web3Modal({
      network: "mumbai",
      cacheProvider: true,
    });

    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const txHash =
      "0x441332877d1412c89e6b9d3517d5ac8209c32c61c9e4b909ea4141c2997d098d"
    const tx = await provider.getTransaction(txHash)
    console.log("tx.to", tx.to)

    // Filter the data based on the transactionHash property
    const filteredData = result.saleStarteds.filter((item) => item.transactionHash === "3628712395");

    setLoading(true);
    setData(result.saleStarteds);
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
    fetchUserAssests(`${localStorage.getItem("platform_wallet")}`);
  }, []);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  });

  return (
    <Layout>
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
                No instagen collection.
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Asset;


export async function getServerSideProps(context) {
  const { contractaddr } = context.query;

  return {
    props: {
      address: contractaddr,
    },
  };
}