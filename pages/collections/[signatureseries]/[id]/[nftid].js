import AssetComp from "../../../../Components/assetComp";
import AssetHead from "../../../../Components/assetHead";
import AssetProps from "../../../../Components/assetProperties";
import AssetCategories from "../../../../Components/AssetCategories";
import { BsArrowUpRight } from "react-icons/bs";
import { BiWallet } from "react-icons/bi";
import { ethers } from "ethers";
import { gql } from "@apollo/client";
import client from "../../../../apollo-client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { buyItem } from "../../../api/buyItem";
import { getMetaData, removePrefix } from "../../../../utils/ipfsUtil";
import BuyAsset from "../../../../Components/buyAssetModal";
import Layout from "../../../../Components/Layout";
import Link from "next/link";
import { saleStartedQuery } from "../../../../utils/gqlUtil";
import request from "graphql-request";
import { useRouter } from 'next/router';
import FusionSeries from '../../../../artifacts/contracts/fusionseries/FusionSeries.sol/FusionSeries.json';
import etherContract from "../../../../utils/web3Modal";
import { useData } from "../../../../context/data";

function Token() {

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
  const { signatureseries, id, nftid } = router.query;
  console.log("nftid", nftid);

  const [data, setData] = useState([]);
  const [nftDatas, setNftDatas] = useState([]);

  const fetchAsset = async () => {

    if (signatureseries == "SignatureSeries") {
      const response = await fetch(`/api/onesigseries?nftid=${nftid}?subgraphUrl=${graphqlAPI}`);
      const result = await response.json();

      setData(result.signatureSeriesAssetCreated)
      console.log("data", data, "result", result);

      const nftData = await getMetaData(data.metaDataURI);
      console.log("nftData", nftData);
      setNftDatas(nftData);
    }
    else if (signatureseries == "FusionSeries") {
      const response = await fetch(`/api/onefusion?nftid=${nftid}`);
      const result = await response.json();

      setData(result.fusionSeriesAssetCreated)
      console.log("data", data, "result", result);

      const fusionAddress = id;
      const fusioncontract = await etherContract(fusionAddress, FusionSeries.abi);

      const tokenId = data.tokenID; // Replace with the actual property name in your asset object
      const meta = await fusioncontract.uri(tokenId);
      console.log("meta data fusion", meta);

      // Add the metaDataURI field to the asset
      data.metaDataURI = meta;
      const nftData = await getMetaData(data.metaDataURI);
      // Set the state with the updated assets
      setNftDatas(nftData);
    }
    else if (signatureseries == "InstaGen") {
      const response = await fetch(`/api/oneinstagen?nftid=${nftid}`);
      const result = await response.json();

      setData(result.instaGenAssetCreated)
      console.log("data", data, "result", result);

      const nftData = await getMetaData(data.metaDataURI);
      console.log("nftData", nftData);
      setNftDatas(nftData);
    }
  }



  useEffect(() => {
    fetchAsset();
  });

  function getEthPrice(price) {
    return ethers.utils.formatEther(price);
  }

  return (
    <Layout>
      <div className="min-h-screen p-8 mx-auto bg-[#f8f7fc] dark:bg-[#131417] dark:body-back body-back-light">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/3 border border-gray-600 p-4 mr-4">
            <AssetComp
              uri={data ? data?.metaDataURI : ""}
            />
            <div className="mt-10 mb-4 font-bold">Description</div>
            <div>{nftDatas?.description}</div>
          </div>

          <div className="lg:w-2/3 w-full">

            <div className="pl-10 border border-gray-600 p-4 mb-4">
              {
                signatureseries == "SignatureSeries" && (
              <div>Signature Series</div>
                )
              }
              {
                signatureseries == "FusionSeries" && (
              <div>Fusion Series</div>
                )
              }
              {
                signatureseries == "EternumPass" && (
              <div>Eternum Pass</div>
                )
              }
              {
                signatureseries == "EternalSoul" && (
              <div>Eternal Soul</div>
                )
              }
              {
                signatureseries == "InstaGen" && (
              <div>InstaGen</div>
                )
              }
              <div className="pt-10 pb-4 font-bold text-xl">{nftDatas?.name}</div>
              <div className="pb-10">Owned by</div>
              <div>Current price</div>
              {/* { data && data.price && (
                            <h2 className="font-bold text-xl">{getEthPrice(data?.price)} MATIC</h2>
                            ) } */}
              <div className="lg:flex md:flex">
                <button
                  onClick={() =>
                    buyItem(data, 1)
                  }
                  className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 my-4 text-sm font-medium rounded-lg bg-white text-black"
                >
                  <span className="text-lg font-bold">Buy Now</span>
                  <BiWallet className="text-3xl" />
                </button>
                <button
                  className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 lg:m-4 md:m-4 text-sm font-medium rounded-lg text-white border"
                >
                  <BiWallet className="text-3xl" />
                  <span className="text-lg font-bold">Make an Offer</span>

                </button>
              </div>
            </div>

            <div className="pl-10 border border-gray-600 p-4">
              <div className="pt-10 pb-4 font-bold text-xl">Rental Duration</div>
              <div className="pb-10">Price</div>

              <div className="lg:flex md:flex">
                <button
                  className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 my-4 text-sm font-medium rounded-lg text-white border"
                >
                  <span className="text-lg font-bold">Months Days Hours</span>
                </button>
                <button
                  className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 lg:m-4 md:m-4 text-sm font-medium rounded-lg text-white bg-blue-700"
                >
                  <BiWallet className="text-3xl" />
                  <span className="text-lg font-bold">Rent Now</span>

                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {model && (
              <BuyAsset open={model} setOpen={setmodel} message={modelmsg} />
            )} */}
    </Layout>
  );
}

export default Token;
