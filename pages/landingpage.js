import Link from "next/link";
import Layout from "../Components/Layout";
import BigCard from "../Components/Cards/BigCard";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import StoreFront from "../artifacts/contracts/StoreFront.sol/StoreFront.json";
import axios from "axios";
import React, { useState, useEffect } from "react";
import etherContract from "../utils/web3Modal";
import { saleStartedQuery } from "../utils/gqlUtil";
import { request, gql } from "graphql-request";
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { getMetaData, removePrefix } from "../utils/ipfsUtil";
import Loader from "../Components/Loader";

const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
const storeFrontAddress = process.env.NEXT_PUBLIC_STOREFRONT_ADDRESS;
const graphqlAPI = process.env.NEXT_PUBLIC_MARKETPLACE_API;
function LandingPage() {
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  const itemStatus = new Map(["NONEXISTANT", "SALE", "AUCTION", "SOLD","REMOVED"].map((v,index)=>[index,v]))
  const walletAddr = useSelector(selectUser);
  var wallet = walletAddr ? walletAddr[0] : "";
  const [hasRole, setHasRole] = useState(true);
  
  const getLandingData = async () => {
    const token = localStorage.getItem("platform_token");
    const config = {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    setLoading(true);
    axios.get(`https://testnet.gateway.myriadflow.com/api/v1.0/products/itemIds`,config)
      .then(async(res) => {
        const marketPlaceContarct = await etherContract(marketplaceAddress, Marketplace.abi)
        const saleInput = res.data.payload.map(i=>parseInt(i))
        const {saleStarteds} = await request(graphqlAPI, saleStartedQuery, {where:{itemId_in: saleInput}}) //saleInput =>[1,2]
        const finalResult=[] 
        Promise.all(saleStarteds.map(async(item)=>{
          const itemResult = await marketPlaceContarct.idToMarketItem(item.itemId)
          const nftData = await getMetaData(item.metaDataURI);
          finalResult.push({...item,...nftData,  
            image: nftData?.image? `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${removePrefix(nftData?.image)}`:"",
          status: itemStatus.get(parseInt(itemResult.status))})
        })).then(()=>{
          setInfo(finalResult)
        })
        setLoading(true);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(()=>{
    const token = localStorage.getItem("platform_token");
    if (token) {
      getLandingData();
    }
  },[])

  useEffect(() => {
    const asyncFn = async () => {
      const token = localStorage.getItem("platform_token");
      if (token) {
      }

      const storeFrontContract = await etherContract(
        storeFrontAddress,
        StoreFront.abi
      );
      setHasRole(
        await storeFrontContract.hasRole(
          await storeFrontContract.STOREFRONT_CREATOR_ROLE(),
          wallet
        )
      );
      
    };
    asyncFn();
  }, [hasRole]);
  return (
    <>
      <Layout
        title="Marketplace"
        description="Used to show the Marketplace information "
      >
      {loading && <Loader />}

        <div className="body-back">
          <div className="min-h-screen lg:flex justify-center items-center ">
            <div className="lg:flex xl:gap-8 lg:w-[1025px] x2:w-[1200px] xxl:w-[1400px] mx-auto lg:mt-12">
              <div className="text-center lg:text-left lg:w-1/2 mt-16 lg:mt-0  p-2 sm:p-4 lg:px-8 lg:pt-0">
                <h3 className=" font-poppins font-bold m48:w-[470px] l32:w-[450px] xxl:w-auto  text-3xl sm:text-4xl lg:text-6xl x2:text-7xl xxl:text-8xl capitalize mb-8 x2:mb-10 mx-auto lg:mx-0 text-gray-500 dark:text-white">
                  Collect and Trade the New Fresh Thing
                </h3>
                <h6 className="text-lg x2:text-2xl  m48:max-w-[487px] mx-auto lg:mx-0 lg:w-[80%] font-opensans mb-8 text-gray-500 dark:text-white">
                  A NFT Marketplace to Explore the Digital Gold Mine, that
                  Supports the Creators. A Place where you can Create, Collect
                  and Sell Digital Assets.
                </h6>
                <div className="lg:flex items-center lg:gap-x-4 x2:gap-x-6 xl:gap-x-10 mb-8 lg:mb-0">
                  <div>
                    <button className="py-3 px-6  text-gray-500 dark:text-white font-semibold mb-8 lg:mb-0 explore-btn-border">
                      <Link href="/explore">
                        <span className="font-raleway font-bold text-gray-500 dark:text-whit">
                          Explore Now
                        </span>
                      </Link>
                    </button>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 lg:pr-8">
                <div className="flex gap-2 m48:gap-3 lg:gap-5">
                  <div className="flex flex-col gap-5 w-1/3 justify-between">
                    <Image
                      src="/design/1.jpg"
                      className="rounded-xl m37:rounded-3xl"
                      alt="alt"
                      width="200"
                      height="200"
                    />
                    <Image
                      src="/design/2.jpg"
                      className="rounded-xl m37:rounded-3xl"
                      alt="alt"
                      width="200"
                      height="200"
                    />
                    <Image
                      src="/design/4.jpg"
                      className="rounded-xl m37:rounded-3xl"
                      alt="alt"
                      width="200"
                      height="200"
                    />
                  </div>
                  <div className="flex flex-col gap-5 w-1/3">
                    <Image
                      src="/design/8.jpg"
                      className="rounded-xl m37:rounded-3xl"
                      alt="alt"
                      width="200"
                      height="200"
                    />
                    <Image
                      src="/design/9.jpg"
                      className="rounded-xl m37:rounded-3xl"
                      alt="alt"
                      width="200"
                      height="200"
                    />
                    <Image
                      src="/design/7.jpg"
                      className="rounded-xl m37:rounded-3xl"
                      alt="alt"
                      width="200"
                      height="200"
                    />
                  </div>
                  <div className="flex w-1/3">
                    <Image
                      src="/design/3.jpg"
                      className="object-cover rounded-xl m37:rounded-3xl"
                      alt="alt"
                      width="200"
                      height="200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {info.length > 0 && (
          <div className="mb-20 ">
            <h1 className="text-center text-3xl font-semibold mb-20 text-gray-500 dark:text-white">
              Highlights
            </h1>
            <div className="max-w-[1280px] mx-auto rounded-3xl flex " style={{gap:"30px"}}>
                {info?.map(function (data, i) {
                   
                  return (
                   
                    <BigCard
                      title={data.product_name}
                      img={data.image}
                      price={data.price}
                      name={data.seller.slice(-6)}
                      description={data.description}
                    />
                  );
                })}
            </div>
          </div>
            )}
        </div>
      </Layout>
    </>
  );
}

export default LandingPage;
