import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import AssetComp from "../../Components/assetComp";
import HomeComp2 from "../../Components/homecomp2";
import AssetImage from "../../Components/assetImage";
import AssetDesc from "../../Components/assetDesc";
import AssetHead from "../../Components/assetHead";
import AssetProps from "../../Components/assetProperties";
import AssetCategories from "../../Components/AssetCategories";
import { BsArrowUpRight } from "react-icons/bs";
import { BiWallet } from 'react-icons/bi';
import { FaCopy } from "react-icons/fa";
import { gql } from "@apollo/client";
import client from "../../apollo-client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { buyNFT } from "../api/buyNFT";
import BuyAsset from "../../Components/buyAssetModal";
import Layout from "../../Components/Layout";
import { ethers } from "ethers";
import Link from "next/link";

function Asset({ asset }) {
  function getEthPrice(price) {
    return ethers.utils.formatEther(price);
  }
  const [model, setmodel] = useState(false);
  const [modelmsg, setmodelmsg] = useState("buying in progress!");
  // console.log(asset);
  const nfturl = `https://ipfs.io/ipfs/${asset.marketItems[0].metaDataUri.substr(
    7,
    50
  )}`;

  const [response, setResponse] = useState([]);
  const [image, setImage] = useState("");
  const [isFull,setIsFull] = useState(false);

  const metadata = async () => {
    const { data } = await axios.get(
      `https://ipfs.io/ipfs/${asset.marketItems[0].metaDataUri.substr(7, 50)}`
    );
    setResponse(data);
    if(data.image.length > 1)
    setImage(data.image);
    else
    setImage(data.thumbnailimage)
    let preuri = image.substr(7, 50);
  };

  useEffect(() => {
    metadata();
  }, [asset.marketItems[0].metaDataUri.substr(7, 50)]);

  let preuri = image.substr(7, 50);

  const imgurl = `https://ipfs.io/ipfs/${preuri}`;
  const transaction = `https://mumbai.polygonscan.com/token/${asset.marketItems[0].nftContract}?a=${asset.marketItems[0].id}`;
  // const transaction = `https://etherscan.io/token/${asset.marketItems[0].nftContract}?a=${asset.marketItems[0].id}`;

  const copy = asset.marketItems[0].nftContract;
  return (
    // <div className="w-full">
    <Layout>
      <div className="max-w-[1400px] mx-auto bg-[#f8f7fc] p-8 dark:bg-[#131417] my-8 rounded-3xl">
        <div className="flex flex-col lg:flex-row gap-x-8">
          <div className="w-full lg:w-[50%]" onClick={() => isSetFull(true)}>
            <AssetComp
              uri={
                asset.marketItems[0]
                  ? asset.marketItems[0].metaDataUri.substr(7, 50)
                  : ""
              }
            />
          </div>
          <div className="lg:w-[50%]">
            <div className="flex flex-col gap-y-4">
              <h3 className="text-gray-700 text-2xl font-medium">
                <AssetHead
                  uri={
                    asset.marketItems[0]
                      ? asset.marketItems[0].metaDataUri.substr(7, 50)
                      : ""
                  }
                />
              </h3>
              <div className="">
                <div className="">
                  <div className="rounded-3xl w-full px-4 py-3 bg-white dark:bg-[#1e1f26] myshadow text-[#253262]">
                    <h3 className="font-bold dark:text-white uppercase">
                      NFT Details
                    </h3>
                    <div className="flex items-center justify-between my-4 overflow-scroll m41:overflow-hidden">
                      <h3 className="text-[#9298b0] font-medium dark:text-gray-300">
                        Contract Address
                      </h3>
                      {/* <span className="text-gray-600 text-sm dark:text-gray-400">{asset.marketItems[0].nftContract}</span> */}
                      <a
                        href={`https://mumbai.polygonscan.com/address/${copy}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span
                          className="text-gray-600 dark:text-gray-400 font-bold cursor-pointer"
                          // onClick={() => { navigator.clipboard.writeText(copy) }}
                        >
                          {copy}
                        </span>
                      </a>
                    </div>
                    <div className="flex items-center justify-between my-4">
                      <h3 className="font-medium text-[#9298b0] dark:text-gray-300">
                        Token ID
                      </h3>
                      <span className="text-[#253262] font-bold text-sm dark:text-gray-400">
                        {asset.marketItems[0].id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between my-4">
                      <h3 className="text-[#9298b0] font-medium dark:text-gray-300">
                        Blockchain
                      </h3>
                      <span className="text-[#253262] font-bold text-sm dark:text-gray-400">
                        Polygon Testnet
                      </span>
                    </div>
                    <div className="flex items-center justify-between my-4">
                      <h3 className="text-[#9298b0] font-medium dark:text-gray-300">
                        IPFS Asset
                      </h3>
                      <span className="text-gray-600 text-sm">
                        <a
                          href={imgurl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#253262] text-lg dark:text-gray-400"
                        >
                          <BsArrowUpRight />
                        </a>
                      </span>
                    </div>
                    <div className="flex items-center justify-between my-4">
                      <h3 className="text-[#9298b0] font-medium dark:text-gray-300">
                        IPFS Metadata
                      </h3>
                      <span className="text-gray-600 text-sm">
                        <a
                          href={nfturl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#253262] text-lg dark:text-gray-400"
                        >
                          <BsArrowUpRight />
                        </a>
                      </span>
                    </div>
                    <div className="flex items-center justify-between my-4">
                      <h3 className="text-[#9298b0] font-medium dark:text-gray-300">
                        Token Lifecycle
                      </h3>
                      <span className="text-gray-600 text-sm">
                        <a
                          href={transaction}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#253262] text-lg dark:text-gray-400"
                        >
                          <BsArrowUpRight />
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="">
                  <div className="rounded-3xl w-full px-4 py-3 bg-white dark:bg-[#1e1f26] myshadow text-[#253262]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[#9298b0] text-base font-medium dark:text-white mb-2">
                        Current price
                      </h4>
                    </div>
                    <div className="text-[#253262] text-4xl font-bold dark:text-gray-400 mb-2 overflow-x-auto">
                      {getEthPrice(asset.marketItems[0].price)}{" "}
                      <span className="text-lg font-medium">MATIC</span>
                    </div>
                    <button
                      onClick={() =>
                        buyNFT(asset.marketItems[0], setmodel, setmodelmsg)
                      }
                      className="flex gap-x-2 items-center justify-center px-10 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
                    >
                      <span className="text-lg font-bold">Buy NFT</span>
                      <BiWallet className="text-3xl"/>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row my-8">
                <div className="lg:w-1/2 bg-white rounded-lg">
                  <AssetProps
                    uri={
                      asset.marketItems[0]
                        ? asset.marketItems[0].metaDataUri.substr(7, 50)
                        : ""
                    }
                  />
                </div>
                <div className="mb-8 flex-shrink-0 lg:w-1/2 lg:mb-0 bg-white rounded-xl">
                  <div className="flex justify-center lg:justify-end">
                    <AssetCategories
                      uri={
                        asset.marketItems[0]
                          ? asset.marketItems[0].metaDataUri.substr(7, 50)
                          : ""
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            {model && (
              <BuyAsset open={model} setOpen={setmodel} message={modelmsg} />
            )}
          </div>
        </div>
      </div>
    </Layout>
    // </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;

  const { data } = await client.query({
    query: gql`
        query Query($where: MarketItem_filter) {
            marketItems(where: {id:${id}}) {
              price
              itemId
              seller
              forSale
              id
              metaDataUri
              owner
              nftContract
            }
          }
    `,
  });

  return {
    props: {
      asset: data,
    },
  };
}

export default Asset;