import AssetComp from "../../Components/assetComp";
import AssetHead from "../../Components/assetHead";
import AssetProps from "../../Components/assetProperties";
import AssetCategories from "../../Components/AssetCategories";
import { BsArrowUpRight } from "react-icons/bs";
import { BiWallet } from "react-icons/bi";
import { gql } from "@apollo/client";
import client from "../../apollo-client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { buyItem } from "../api/buyItem";
import BuyAsset from "../../Components/buyAssetModal";
import Layout from "../../Components/Layout";
import Link from "next/link";
import { saleStartedQuery } from "../../utils/gqlUtil";
import request from "graphql-request";
const graphqlAPI = process.env.NEXT_PUBLIC_MARKETPLACE_API;
function Token({ asset }) {
  const removePrefix = (uri) => {
    return uri.substring(7, uri.length);
  };

  const [model, setmodel] = useState(false);
  const [modelmsg, setmodelmsg] = useState("buying in progress!");
  const nfturl = `https://cloudflare-ipfs.com/ipfs/${removePrefix(asset?.metaDataURI)}`;

  const [response, setResponse] = useState([]);
  const [image, setImage] = useState("");
  const metadata = async () => {
    const { data } = await axios.get(
      `https://cloudflare-ipfs.com/ipfs/${removePrefix(
        asset?.metaDataURI
      )}`
    );
    setResponse(data);
    if (data.image.length > 1) setImage(data.image);
    else setImage(data.thumbnailimage);
  };

  useEffect(() => {
    metadata();
  }, [asset?.metaDataURI]);
  let preuri = removePrefix(image);

  const imgurl = `https://cloudflare-ipfs.com/ipfs/${preuri}`;
  const transaction = `https://mumbai.polygonscan.com/token/${asset?.nftContract}?a=${asset?.id}`;
  const copy = asset?.nftContract;

  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto bg-[#f8f7fc] p-8 dark:bg-[#131417] my-8 rounded-3xl body-back">
        <div className="flex flex-col lg:flex-row gap-x-8">
          <div className="w-full lg:w-[50%]" onClick={() => isSetFull(true)}>
            <AssetComp
              uri={asset ? asset?.metaDataURI : ""}
            />
          </div>
          <div className="lg:w-[50%]">
            <div className="flex flex-col gap-y-4">
              <div className="text-gray-700 text-2xl font-medium">
                <AssetHead
                  uri={asset ? asset?.metaDataURI : ""}
                />
              </div>
              <div className="body-back">
                <div className="">
                  <div className="rounded-3xl w-full px-4 py-3 bg-white dark:bg-[#1e1f26] myshadow text-[#253262]">
                    <h3 className="font-bold text-gray-500 dark:text-white uppercase">
                      NFT Details
                    </h3>
                    <div className="flex items-center justify-between my-4 overflow-scroll m41:overflow-hidden">
                      <h3 className="text-[#9298b0] font-medium dark:text-gray-300">
                        Contract Address
                      </h3>
                      <Link
                        href={`https://mumbai.polygonscan.com/address/${copy}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="text-gray-600 dark:text-gray-400 font-bold cursor-pointer">
                          {copy}
                        </span>
                      </Link>
                    </div>
                    <div className="flex items-center justify-between my-4">
                      <h3 className="font-medium text-[#9298b0] dark:text-gray-300">
                        Token ID
                      </h3>
                      <span className="text-[#253262] font-bold text-sm dark:text-gray-400">
                        {asset?.tokenId}
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
                        <Link
                          href={imgurl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#253262] text-lg dark:text-gray-400"
                        >
                          <BsArrowUpRight />
                        </Link>
                      </span>
                    </div>
                    <div className="flex items-center justify-between my-4">
                      <h3 className="text-[#9298b0] font-medium dark:text-gray-300">
                        IPFS Metadata
                      </h3>
                      <span className="text-gray-600 text-sm">
                        <Link
                          href={nfturl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#253262] text-lg dark:text-gray-400"
                        >
                          <BsArrowUpRight />
                        </Link>
                      </span>
                    </div>
                    <div className="flex items-center justify-between my-4">
                      <h3 className="text-[#9298b0] font-medium dark:text-gray-300">
                        Token Lifecycle
                      </h3>
                      <span className="text-gray-600 text-sm">
                        <Link
                          href={transaction}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#253262] text-lg dark:text-gray-400"
                        >
                          <BsArrowUpRight />
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="">
                <div className="">
                  <div className="rounded-3xl w-full px-4 py-3 bg-white dark:bg-[#1e1f26] myshadow text-[#253262]">
                    <button
                      onClick={() =>
                        buyItem(asset, setmodel, setmodelmsg)
                      }
                      className="flex gap-x-2 items-center justify-center px-10 py-3 text-gray-500 dark:text-white text-sm font-medium rounded-xl hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
                    >
                      <span className="text-lg font-bold">Buy NFT</span>
                      <BiWallet className="text-3xl" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row my-8">
                <div className="lg:w-1/2 bg-white rounded-lg">
                  <AssetProps
                    uri={asset ? asset?.metaDataURI : ""}
                  />
                </div>
                <div className="mb-8 flex-shrink-0 lg:w-1/2 lg:mb-0 bg-white rounded-xl">
                  <div className="flex justify-center lg:justify-end">
                    <AssetCategories
                      uri={asset ? asset?.metaDataURI : ""}
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
  );
}


export const getInitialProps = async (context) => {
  const { tokenid } = context.query;
  const { saleStarteds } = await request(graphqlAPI, saleStartedQuery, {
    where: { itemId: tokenid },
  });
  return {
    props: {
      asset: saleStarteds[0] ?? 0,
    },
  };
};
export default Token;
