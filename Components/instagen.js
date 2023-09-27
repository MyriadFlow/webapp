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
import { sellItem } from "../pages/api/sellItem";
import Web3Modal from "web3modal";
import { useAccount } from "wagmi";
import { useData } from "../context/data";

// const apiUrl = 'https://testnet.gateway.myriadflow.com/api/v1.0/webapp/contracts/7aa9e5d1-a31f-4962-88f4-3d970c609844';

function Instagen() {

    const { resdata } = useData();
  const apiUrl = `https://testnet.gateway.myriadflow.com/api/v1.0/webapp/contracts/${resdata.Storefront.id}`;

    function getEthPrice(price) {
        return ethers.utils.formatEther(price);
    }

    const walletAddr = useAccount().address;
    var wallet = walletAddr ? walletAddr[0] : "";
    const [data, setData] = useState([]);
    const [auction, setAuction] = useState([]);
    const [loading, setLoading] = useState(true);
    const [model, setmodel] = useState(false);
    const [filter, setFilter] = useState([]);
    const [modelmsg, setmodelmsg] = useState("buying in progress!");

    const fetchcontracts = async () => {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const filteredData = data.filter((item) => item.contractName === 'InstaGen');
            console.log("contracts", data);
            console.log("sig contracts", filteredData);
            setFilter(filteredData);
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    };

    async function loadNFTs() {
        setLoadingState("loaded");
    }
    async function sellNft(nft) {
        setmodelmsg("Buying in Progress");
        await sellItem(nft, 1, setmodel, setmodelmsg);
    }

    useEffect(() => {
        if (!localStorage.getItem("platform_wallet") && wallet !== undefined) {
            localStorage.setItem("platform_wallet", wallet);
        } else {
        }
        // fetchUserAssests(`${localStorage.getItem("platform_wallet")}`);
        fetchcontracts();
    }, []);
    const [loadingState, setLoadingState] = useState("not-loaded");

    useEffect(() => {
        loadNFTs();
    });
    return (
        <div className="min-h-screen dark:body-back body-back-light">
            <div>
                <div className=" p-4 mt-10  h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
                {filter?.length > 0 ? (
                        filter?.map((item) => {
                            return (
                                <div
                                    key={item.contractAddress}
                                    className=" border-2 p-2.5 rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-500"
                                >
                                    <Link key={item?.contractName} href={`/collections/${item?.contractName}/${item?.contractAddress}`}>
                                        <div>
                                            <img src="https://makeanapplike.com/wp-content/uploads/2021/12/white-label-nft-marketplace-development-firms.png"/>
                                            <div className=" flex items-center justify-between mb-2">
                                                <div className="font-1 text-sm font-bold">
                                                    Contract name:{" "}
                                                </div>
                                                <div className="">
                                                    <div className="font-extralight dark:text-gray-400">
                                                        {item?.contractName}
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex">
                                                <div className="font-bold">Contract Address: </div>
                                                <div className="text-md ml-2">{item?.contractAddress.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })): loading ? (
                            <Loader />
                        ) : (
                            <div className="text-2xl pb-10 text-center font-bold text-gray-500 dark:text-white">
                                No InstaGen collection.
                            </div>
                        )}
                </div>

            </div>
        </div>
    );
}

export default Instagen;
