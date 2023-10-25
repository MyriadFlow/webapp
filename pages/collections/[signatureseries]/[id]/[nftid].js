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
import { useRouter } from "next/router";
import DateTimePicker from "../../../../Components/Datetimepicker";
import Tradhub from "../../../../artifacts/contracts/tradehub/TradeHub.sol/TradeHub.json";
import FusionSeries from "../../../../artifacts/contracts/fusionseries/FusionSeries.sol/FusionSeries.json";
import SignatureSeries from "../../../../artifacts/contracts/signatureseries/SignatureSeries.sol/SignatureSeries.json";
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
  const [personisowner, setpersonisowner] = useState(false);
  const [buybuttonshow, setbuybuttonshow] = useState(false);
  const [auctionbuttons,setauctionbuttons] = useState(false);
  const [owner, setowner] = useState(null);
  const [rental, setrental] = useState(false);
  const [rentinput, setrentinput] = useState(false);
  const [pricePerHour, setPricePerHour] = useState("");
  const [currentprice, setcurrentprice] = useState("");
  const [nftitemid, setnftitemid] = useState("");
  const [youcanrent, setyoucanrent] = useState(false);
  const [address, setaddress] = useState("");

  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);

  const [months2, setMonths2] = useState(0);
  const [days2, setDays2] = useState(0);
  const [hours2, setHours2] = useState(0);

  // Function to update the state when values change
  const handleMonthsChange = (e) => setMonths(parseInt(e.target.value, 10));
  const handleDaysChange = (e) => setDays(parseInt(e.target.value, 10));
  const handleHoursChange = (e) => setHours(parseInt(e.target.value, 10));

  const handleMonthsChange2 = (e) => setMonths2(parseInt(e.target.value, 10));
  const handleDaysChange2 = (e) => setDays2(parseInt(e.target.value, 10));
  const handleHoursChange2 = (e) => setHours2(parseInt(e.target.value, 10));

  const rentToggle = async () => {
    const signatureaddress = id;
    const signaturecontract = await etherContract(
      signatureaddress,
      SignatureSeries.abi
    );
    const isrentabledata = await signaturecontract.rentables(nftid);
    console.log("rentables data", isrentabledata);
    const rate = isrentabledata.hourlyRate.toString();
    console.log("rentables rate", isrentabledata.hourlyRate.toString());
    console.log("ethers", ethers.utils.formatEther(rate).toString());
    if (isrentabledata.isRentable) {
      setrental(true);
      setcurrentprice(ethers.utils.formatEther(rate));
    } else setrental(false);
  };

  const rentToggleoffon = () => {
    setrentinput(!rentinput);
  };

  const rentoff = async () => {
    const signatureaddress = id;
    const signaturecontract = await etherContract(
      signatureaddress,
      SignatureSeries.abi
    );
    const pricerent = await signaturecontract.rentables(nftid);
    const offrent = await signaturecontract.setRentInfo(
      nftid,
      false,
      pricerent.hourlyRate
    );
  };

  const handlePriceChange = (e) => {
    setPricePerHour(e.target.value);
  };

  const handleaddr = (e) => {
    setaddress(e.target.value);
  };

  const handleSubmit = async () => {
    // Call the setRentInfo function with the obtained values
    const signatureaddress = id;
    const signaturecontract = await etherContract(
      signatureaddress,
      SignatureSeries.abi
    );
    const rentinfo = await signaturecontract.setRentInfo(
      nftid,
      true,
      ethers.utils.parseEther(pricePerHour.toString())
    );
    console.log("rentinfo", rentinfo);
  };

  const handleSubmitaddr = async () => {
    const signatureaddress = id;
    const signaturecontract = await etherContract(
      signatureaddress,
      SignatureSeries.abi
    );

    console.log("months", months, "days", days, "hours", hours);
    const totalHours = months * 30 * 24 + days * 24 + hours;
    console.log("total hours for rent", totalHours);
    const totalsec = totalHours * 60 * 60;

    const setuser = await signaturecontract.setUser(
      nftid,
      address,
      totalHours
    );
    console.log("rentinfo", setuser);
  };

  const handleRenttime = async () => {
    // const { months, days, hours } = duration;
    console.log("months", months, "days", days, "hours", hours);
    const totalHours = months * 30 * 24 + days * 24 + hours;
    console.log("total hours for rent", totalHours);
    const totalsec = totalHours * 60 * 60;
    // console.log("total seconds", totalHours*60*60);
    // Call the setRentInfo function with the obtained values
    const options = {
      value: ethers.utils.parseEther(currentprice.toString()).mul(totalHours),
    };
    const signatureaddress = id;
    const signaturecontract = await etherContract(
      signatureaddress,
      SignatureSeries.abi
    );
    const rent = await signaturecontract.rent(nftid, totalHours, options);
    // console.log("rented", rent);
  };

  const itemid = async () => {
    if (data) {
      const endPoint = `${graphqlAPI}`;
      const headers = {
        "Content-Type": "application/json",
      };

      const AllBuildingQuery = `{
        saleStarteds(where: {tokenId: "${nftid}", nftContract: "${id}"}) {
          transactionHash
          tokenId
          seller
          itemId
          metaDataURI
          nftContract
          price
          blockTimestamp
          blockNumber
          id
        }
      }`;

      const graphqlQuery = {
        operationName: "saleStarteds",
        query: `query saleStarteds ${AllBuildingQuery}`,
        variables: {},
      };

      const response = await axios.post(endPoint, graphqlQuery, {
        headers: headers,
      });
      const result = await response.data.data;

      const AllBuildingQuery2 = `{
        auctionStarteds(where: {tokenId: "${nftid}", nftContract: "${id}"}) {
          itemId
          tokenId
          nftContract
        }
      }`;

      const graphqlQuery2 = {
        operationName: "auctionStarteds",
        query: `query auctionStarteds ${AllBuildingQuery2}`,
        variables: {},
      };

      const response2 = await axios.post(endPoint, graphqlQuery2, {
        headers: headers,
      });
      const result2 = await response2.data.data;

      console.log("item id data", result, result2);

      if (result?.saleStarteds.length > 0) {
        setnftitemid(result?.saleStarteds[0].itemId);
      } else {
        setnftitemid(result2?.auctionStarteds[0].itemId);
      }
    }
  };

  const canyourent = async () => {
    if (data) {
      const endPoint = `${graphqlAPI}`;
      const headers = {
        "Content-Type": "application/json",
      };

      const AllBuildingQuery = `{
        updateUsers(where: {tokenId: "${nftid}"}) {
          tokenId
          user
          blockTimestamp
          blockNumber
          expires
          id
          transactionHash
        }
      }`;

      const graphqlQuery = {
        operationName: "updateUsers",
        query: `query updateUsers ${AllBuildingQuery}`,
        variables: {},
      };

      const response = await axios.post(endPoint, graphqlQuery, {
        headers: headers,
      });
      const result = await response.data.data;

      // setnftitemid(result.updateUsers[0].itemId);
      // console.log("item id data", result);

      const expiry = async () => {
        const tokenTimestampMap = {};

        for (const obj of result?.updateUsers) {
          // Check if tokenId exists in tokenTimestampMap
          if (!tokenTimestampMap[obj.tokenId]) {
            // If tokenId doesn't exist, add it with the current obj
            tokenTimestampMap[obj.tokenId] = obj;
          } else {
            // If tokenId exists, compare timestamps and update if current obj has a more recent timestamp
            const currentTimestamp = obj.blockTimestamp;
            const existingTimestamp =
              tokenTimestampMap[obj.tokenId].blockTimestamp;
            if (currentTimestamp > existingTimestamp) {
              tokenTimestampMap[obj.tokenId] = obj;
            }
          }

          console.log("tokenTimestampMap", tokenTimestampMap);

          const currentTimestamp = Math.floor(Date.now() / 1000);
          const givenTimestamp = parseInt(tokenTimestampMap[nftid].expires, 10);

          console.log(currentTimestamp, givenTimestamp);

          if (currentTimestamp > givenTimestamp) {
            setyoucanrent(true);
          }
          else
          setyoucanrent(false);
        }
      };

      await expiry();
    }
  };

  const tradhubAddress = resdata?.TradehubAddress;

  const findowner = async () => {
    const tradhubContarct = await etherContract(tradhubAddress, Tradhub.abi);

    const signatureaddress = id;
    const signaturecontract = await etherContract(
      signatureaddress,
      SignatureSeries.abi
    );
    const ownercheckifstatusis3 = await signaturecontract.ownerOf(nftid);

    const ownercheck = await tradhubContarct.idToMarketItem(nftitemid);

    console.log(
      "ownercheck",
      ownercheck,
      "myadd",
      myaddr,
      "ownerof",
      ownercheckifstatusis3
    );

    if (ownercheck.status == 3) {
      setowner(ownercheckifstatusis3);
      if (ownercheckifstatusis3 == myaddr) {
        setpersonisowner(true);
      }
    } else {
      setowner(ownercheck.seller);
      if (ownercheck.seller == myaddr) {
        setpersonisowner(true);
      }
      if(ownercheck.status == 2)
        {
          setauctionbuttons(true);
        }
        if(ownercheck.status == 1)
        {
          setbuybuttonshow(true);
        }
    }
  };

  useEffect(() => {
    findowner();
  });

  useEffect(() => {
    rentToggle();
  });

  useEffect(() => {
    itemid();
  }, [data]);

  useEffect(() => {
    canyourent();
  }, [data]);

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

      const response = await axios.post(endPoint, graphqlQuery, {
        headers: headers,
      });
      const result = await response.data.data;

      setData(result.signatureSeriesAssetCreateds[0]);
      console.log("data", data, "result", result);

      const nftData = await getMetaData(data.metaDataURI);
      console.log("nftData", nftData);
      setNftDatas(nftData);
    } else if (signatureseries == "FusionSeries") {
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

      const response = await axios.post(endPoint, graphqlQuery, {
        headers: headers,
      });
      const result = await response.data.data;

      setData(result.fusionSeriesAssetCreateds[0]);
      console.log("data", data, "result", result);

      const fusionAddress = id;
      const fusioncontract = await etherContract(
        fusionAddress,
        FusionSeries.abi
      );

      const tokenId = data.tokenID; // Replace with the actual property name in your asset object
      const meta = await fusioncontract.uri(tokenId);
      console.log("meta data fusion", meta);

      // Add the metaDataURI field to the asset
      data.metaDataURI = meta;
      const nftData = await getMetaData(data.metaDataURI);
      // Set the state with the updated assets
      setNftDatas(nftData);
    } else if (signatureseries == "InstaGen") {
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

      const response = await axios.post(endPoint, graphqlQuery, {
        headers: headers,
      });
      const result = await response.data.data;

      setData(result.instaGenAssetCreateds[0]);
      console.log("data", data, "result", result);

      const nftData = await getMetaData(data.metaDataURI);
      console.log("nftData", nftData);
      setNftDatas(nftData);
    }
  };

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
            <AssetComp uri={data ? data?.metaDataURI : ""} />
            <div className="mt-10 mb-4 font-bold">Description</div>
            <div>{nftDatas?.description}</div>
          </div>

          <div className="lg:w-2/3 w-full">
            <div className="pl-10 border border-gray-600 p-4 mb-4">
              {signatureseries == "SignatureSeries" && (
                <div>Signature Series</div>
              )}
              {signatureseries == "FusionSeries" && <div>Fusion Series</div>}
              {signatureseries == "EternumPass" && <div>Eternum Pass</div>}
              {signatureseries == "EternalSoul" && <div>Eternal Soul</div>}
              {signatureseries == "InstaGen" && <div>InstaGen</div>}
              <div className="pt-10 pb-4 font-bold text-xl">
                {nftDatas?.name}
              </div>
              <div className="pb-10">
                <span className="mr-4">Owned by</span>
                {owner && owner != myaddr && <span>{owner}</span>}
                {owner && owner == myaddr && <span>You</span>}
              </div>
              <div className="lg:flex md:flex">
                <div>
                  <div>Current price</div>
                  {/* { nftDatas && nftDatas.price && (
                            <h2 className="font-bold text-xl">{getEthPrice(nftDatas?.price)} MATIC</h2>
                            ) } */}
                </div>
                <div className="ml-10">
                  {buybuttonshow && !personisowner &&(
                    <button
                      onClick={() => buyItem(data, 1)}
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

            {
               personisowner && auctionbuttons && (
                <button
                      // onClick={() => buyItem(data, 1)}
                      className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 my-4 text-sm font-medium rounded-lg bg-white text-black"
                    >
                      <span className="text-lg font-bold">End Auction</span>
                      {/* <BiWallet className="text-3xl" /> */}
                    </button>
              )
            }

            
{
               !personisowner && auctionbuttons && (
                <div>
                <button
                      // onClick={() => buyItem(data, 1)}
                      className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 my-4 text-sm font-medium rounded-lg bg-white text-black"
                    >
                      <span className="text-lg font-bold">Enter Price</span>
                      {/* <BiWallet className="text-3xl" /> */}
                    </button>
                <button
                      // onClick={() => buyItem(data, 1)}
                      className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 my-4 text-sm font-medium rounded-lg bg-white text-black"
                    >
                      <span className="text-lg font-bold">Bid Now</span>
                      {/* <BiWallet className="text-3xl" /> */}
                    </button>
                    </div>
              )
            }

            { personisowner && !buybuttonshow && !auctionbuttons && (
            <div className="pl-10 border border-gray-600 p-4">
              <div className="pt-10 pb-4 font-bold text-xl">
                Rental Availability
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                {!rental && (
                  <input
                    type="checkbox"
                    value=""
                    class="sr-only peer"
                    onChange={rentToggleoffon}
                  />
                )}
                {rental && (
                  <input
                    type="checkbox"
                    value=""
                    checked
                    class="sr-only peer"
                    onChange={rentoff}
                  />
                )}
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                {/* <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Toggle me</span> */}
              </label>
              {rental && (
                <div>
                  <div className="text-green-500">
                    Minimum price for 1 hour now is {currentprice} Matic
                  </div>
                  <div className="pb-10">Price</div>
                  <div className="lg:flex md:flex">
                    <input
                      type="number"
                      placeholder="Matic"
                      value={pricePerHour}
                      onChange={handlePriceChange}
                      className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 my-4 text-sm font-medium rounded-lg text-gray-500 border"
                    />
                    <button
                      className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 lg:m-4 md:m-4 text-sm font-medium rounded-lg bg-white text-gray-500"
                      onClick={handleSubmit}
                    >
                      <BiWallet className="text-3xl" />
                      <span className="text-lg font-bold">Set Price</span>
                    </button>
                  </div>
                </div>
              )}

              {rentinput && !rental && (
                <div>
                  <div className="pb-10">Price</div>
                  <div className="lg:flex md:flex">
                    <input
                      type="number"
                      placeholder="Matic"
                      value={pricePerHour}
                      onChange={handlePriceChange}
                      className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 my-4 text-sm font-medium rounded-lg text-gray-500 border"
                    />
                    <button
                      className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 lg:m-4 md:m-4 text-sm font-medium rounded-lg bg-white text-gray-500"
                      onClick={handleSubmit}
                    >
                      <BiWallet className="text-3xl" />
                      <span className="text-lg font-bold">Set Price</span>
                    </button>
                  </div>
                </div>
              )}
              {signatureseries != "FusionSeries" && (
                <div>
                  <div className="pt-10 pb-4 font-bold text-xl">Set User</div>
                  <div className="lg:flex md:flex">
                    <input
                      type="text"
                      placeholder="Wallet Address"
                      value={address}
                      onChange={handleaddr}
                      className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 my-4 text-sm font-medium rounded-lg text-gray-500 border"
                    />
                    <button className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 my-4 mx-4 text-sm font-medium rounded-lg text-white border">
                  {/* <span className="text-lg font-bold">Months Days Hours</span> */}
                  <DateTimePicker
                    months={months2}
                    days={days2}
                    hours={hours2}
                    onMonthsChange={handleMonthsChange2}
                    onDaysChange={handleDaysChange2}
                    onHoursChange={handleHoursChange2}
                  />
                </button>
                    <button
                      className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 lg:m-4 md:m-4 text-sm font-medium rounded-lg bg-white text-gray-500"
                      onClick={handleSubmitaddr}
                    >
                      <BiWallet className="text-3xl" />
                      <span className="text-lg font-bold">Set</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

             )} 

            { !personisowner && rental && youcanrent && (
            <div className="pl-10 border border-gray-600 p-4">
              <div className="pt-10 pb-4 font-bold text-xl">
                Rental Duration
              </div>
              <div className="pb-10">Price</div>

              <div className="lg:flex md:flex">
                <button className="flex gap-x-2 items-center justify-center lg:px-10 md:px-10 px-3 py-3 my-4 text-sm font-medium rounded-lg text-white border">
                  {/* <span className="text-lg font-bold">Months Days Hours</span> */}
                  <DateTimePicker
                    months={months}
                    days={days}
                    hours={hours}
                    onMonthsChange={handleMonthsChange}
                    onDaysChange={handleDaysChange}
                    onHoursChange={handleHoursChange}
                  />
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
            )}

            {!personisowner && rental && !youcanrent && (
              <div className="bg-white p-24 text-black m-4 w-1/2 font-bold rounded-2xl text-lg">
                <div>
                  {" "}
                  This NFT is already on rent. Explore other NFTs available for
                  renting.
                </div>
              </div>
            )}
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
