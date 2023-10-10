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
import DateTimePicker from '../../../../Components/Datetimepicker';
import Tradhub from '../../../../artifacts/contracts/tradehub/TradeHub.sol/TradeHub.json'
import FusionSeries from '../../../../artifacts/contracts/fusionseries/FusionSeries.sol/FusionSeries.json';
import SignatureSeries from '../../../../artifacts/contracts/signatureseries/SignatureSeries.sol/SignatureSeries.json';
import etherContract from "../../../../utils/web3Modal";
import { useData } from "../../../../context/data";
import { useAccount } from "wagmi";

function Token() {

  const myaddr = useAccount().address;

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
  const [buybuttonshow, setbuybuttonshow] = useState(false);
  const [owner, setowner] = useState(null);
  const [rental, setrental] = useState(false);
  const [pricePerHour, setPricePerHour] = useState('');

  const [duration, setDuration] = useState({
    months: 0,
    days: 0,
    hours: 0,
  });

  // Function to handle changes in the DateTimePicker
  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
  };

  const rentToggle = () => {
    setrental(!rental);
  };

  const handlePriceChange = (e) => {
    setPricePerHour(e.target.value);
  };

  const handleSubmit = async () => {
    // Call the setRentInfo function with the obtained values
    const signatureaddress = id;
      const signaturecontract = await etherContract(signatureaddress, SignatureSeries.abi);
      const rentinfo = await signaturecontract.setRentInfo(3, true, pricePerHour);
      console.log("rentinfo", rentinfo);
  };

  const handleRenttime = async () => {
    const { months, days, hours } = duration;
    const totalHours = (months * 30 * 24) + (days * 24) + hours;
    console.log("total hours for rent", totalHours);
    // Call the setRentInfo function with the obtained values
    const signatureaddress = id;
      const signaturecontract = await etherContract(signatureaddress, SignatureSeries.abi);
      const rentinfo = await signaturecontract.setRentInfo(3, true, pricePerHour);
      console.log("rentinfo", rentinfo);
  };

  const tradhubAddress = "0x2B6c5bd1da04BCcf7186879288a0E6dF266BcA17";

  const findowner = async () =>{
    const tradhubContarct = await etherContract(
      tradhubAddress,
      Tradhub.abi
    );

    const signatureaddress = id;
      const signaturecontract = await etherContract(signatureaddress, SignatureSeries.abi);
      const ownercheckifstatusis3 = await signaturecontract.ownerOf(3);

    const ownercheck = await tradhubContarct.idToMarketItem(10);
    
    console.log("ownercheck", ownercheck, "myadd", myaddr, "ownerof", ownercheckifstatusis3);
    
    if(ownercheck.status==3)
    {
      setowner(ownercheckifstatusis3);
      if(ownercheckifstatusis3 != myaddr)
      {
      setbuybuttonshow(true);
      }
    }
    else
    {
      setowner(ownercheck.seller);
      if(ownercheck.seller != myaddr)
    {
      setbuybuttonshow(true);    
    }
    }
  }
      
  useEffect(() => {
    findowner();
  });


  const fetchAsset = async () => {

    if (signatureseries == "SignatureSeries") {

      const endPoint = `${graphqlAPI}`;
      const headers = {
        "Content-Type": "application/json",
      };

      const AllBuildingQuery = `{
        signatureSeriesAssetCreateds(where: {tokenID: "${nftid}"}) {
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

      const response = await axios.post(endPoint, graphqlQuery, { headers: headers });
      const result = await response.data.data;

      setData(result.signatureSeriesAssetCreateds[0])
      console.log("data", data, "result", result);

      const nftData = await getMetaData(data.metaDataURI);
      console.log("nftData", nftData);
      setNftDatas(nftData);

      // const signatureaddress = id;
      // const signaturecontract = await etherContract(signatureaddress, SignatureSeries.abi);
      // const ownercheck = await signaturecontract.ownerOf(nftid);
    }
    else if (signatureseries == "FusionSeries") {
      
      const endPoint = `${graphqlAPI}`;
      const headers = {
        "Content-Type": "application/json",
      };

      const AllBuildingQuery = `{
        fusionSeriesAssetCreateds(where: {tokenID: "${nftid}"}) {
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

      const response = await axios.post(endPoint, graphqlQuery, { headers: headers });
      const result = await response.data.data;

      setData(result.fusionSeriesAssetCreateds[0]);
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
      
      const endPoint = `${graphqlAPI}`;
      const headers = {
        "Content-Type": "application/json",
      };

      const AllBuildingQuery = `{
        instaGenAssetCreateds(where: {tokenID: "${nftid}"}){
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

      const response = await axios.post(endPoint, graphqlQuery, { headers: headers });
      const result = await response.data.data;

      setData(result.instaGenAssetCreateds[0])
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
      <div className="min-h-screen p-8 mx-auto bg-[#f8f7fc] dark:bg-[#131417] dark:body-back body-back-light text-black dark:text-white">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/3 border border-gray-600 p-4 lg:mr-4">
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
              <div className="pb-10">
              <span className="mr-4">Owned by</span>
              {
                owner && (<span>{owner.slice(-5)}</span>)
              }
              </div>
              <div className="lg:flex md:flex">
                <div>
              <div>Current price</div>
              {/* { nftDatas && nftDatas.price && (
                            <h2 className="font-bold text-xl">{getEthPrice(nftDatas?.price)} MATIC</h2>
                            ) } */}
                            </div>
              <div className="ml-10">
              { buybuttonshow && (
                <button
                  onClick={() =>
                    buyItem(data, 1)
                  }
                  className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 my-4 text-sm font-medium rounded-lg bg-white text-black"
                >
                  <span className="text-lg font-bold">Buy Now</span>
                  <BiWallet className="text-3xl" />
                </button>
               )}
               </div>
                {/* <button
                  className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 lg:m-4 md:m-4 text-sm font-medium rounded-lg text-white border"
                >
                  <BiWallet className="text-3xl" />
                  <span className="text-lg font-bold">Make an Offer</span>

                </button> */}

              </div>
            </div>

            {/* { !buybuttonshow && ( */}
            <div className="pl-10 border border-gray-600 p-4">
              <div className="pt-10 pb-4 font-bold text-xl">Rental Availability</div>
              <label class="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" value="" class="sr-only peer" onChange={rentToggle}/>
  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Toggle me</span>
</label>
{ rental && (
  <div>
    <div className="pb-10">Price</div>
  <div className="lg:flex md:flex">
  <input
  type="number"
  placeholder="Matic"
  value={pricePerHour}
  onChange={handlePriceChange}
  className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 my-4 text-sm font-medium rounded-lg text-white border"
/>
                <button
                  className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 lg:m-4 md:m-4 text-sm font-medium rounded-lg bg-white text-black"
                  onClick={handleSubmit}
                  >
                  <BiWallet className="text-3xl" />
                  <span className="text-lg font-bold">Set Price</span>

                </button>
              </div>
              </div>
)}
              

              
            </div>
            {/* )} */}

            {/* { buybuttonshow && ( */}
            <div className="pl-10 border border-gray-600 p-4">
              <div className="pt-10 pb-4 font-bold text-xl">Rental Duration</div>
              <div className="pb-10">Price</div>

              <div className="lg:flex md:flex">
                <button
                  className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 my-4 text-sm font-medium rounded-lg text-white border"
                >
                  {/* <span className="text-lg font-bold">Months Days Hours</span> */}
                  <DateTimePicker onChange={handleDurationChange}/>
                </button>
                <button
                  className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 lg:m-4 md:m-4 text-sm font-medium rounded-lg text-white bg-blue-700"
                  onClick={handleRenttime}
                >
                  <BiWallet className="text-3xl" />
                  <span className="text-lg font-bold">Rent Now</span>

                </button>
              </div>
            </div>
            {/* )} */}
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
