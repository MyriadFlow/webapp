import React from "react";
import Layout from "../Components/Layout";
import { useEffect, useState } from "react";
import { request } from "graphql-request";
import { getMetaData, removePrefix } from "../utils/ipfsUtil";
import Link from "next/link";
import { MarketPlaceCardWish } from "../Components/Cards/MarketPlaceCardWish";
import { ethers } from "ethers";
import { useSelector } from "react-redux";
import { selectModel } from "../slices/modelSlice";
import BuyAsset from "../Components/buyAssetModal";
import { saleStartedQuery } from "../utils/gqlUtil";
import axios from "axios";
import { buyItem } from "./api/buyItem";

const graphqlAPI = process.env.NEXT_PUBLIC_MARKETPLACE_API;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modelmsg, setmodelmsg] = useState("buying in progress!");
  const [model, setmodel] = useState(false);
  const logoutmodel = useSelector(selectModel);

  const [shallowData, setShallowData] = useState([]);

  const getWishlist = () => {
    const token = localStorage.getItem("platform_token");
    const config = {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/v1.0/wishlist/userWishlist`, config)
      .then(async (res) => {
        await buildWishlist(res.data.payload);
        console.log("getall wishlist", res);

        setLoading(true);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const buildWishlist = async (itemIds) => {
    const { saleStarteds } = await request(graphqlAPI, saleStartedQuery, {
      where: { itemId_in: itemIds },
    });
    const fResult = await Promise.all(
      saleStarteds.map(async function (obj, index) {
        const nftData = await getMetaData(obj.metaDataURI);
        const { name, description, categories, image } = nftData;
        return {
          ...obj,
          name,
          description,
          categories: categories,
          image: nftData?.image
            ? `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${removePrefix(image)}`
            : "",
        };
      })
    );
    const sortedNFts = fResult.sort((a, b) => {
      if (a.itemId < b.itemId) return -1;
    });
    setWishlist(sortedNFts);
    setShallowData(sortedNFts);
  };
  useEffect(() => {
    getWishlist();
  }, []);
  function getEthPrice(price) {
    return ethers.utils.formatEther(price);
  }
  async function buyNft(nft) {
    setmodelmsg("Buying in Progress");
    await buyItem(nft, setmodel, setmodelmsg);
  }

  return (
    <Layout
      title="WishList"
      description="This is used to show Wishlist/Add to cart info"
    >
      {model && <BuyAsset open={model} setOpen={setmodel} message={modelmsg} />}
      {logoutmodel && (
        <div className="flex items-center  shadow-md justify-center w-full h-screen model-overlay fixed  top-0 z-50">
          <div className="h-56 w-80 bg-white  dark:bg-gray-800 shadow-lg rounded-md fixed z-50 flex items-center justify-center  ring-offset-2 ring-2 ring-blue-400">
            <div className="flex flex-col justify-center items-center">
              <div className="text-lg font-semibold dark:text-gray-200">
                {" "}
                Are You Sure Wanna Logout ?
              </div>
              <div className="flex items-center space-x-8 mt-10 ">
                <div>
                  <button
                    onClick={logoutmetamask}
                    className="font-semibold bg-blue-500 hover:bg-blue-700 shadow-md p-1 px-4 rounded-md"
                  >
                    Ok
                  </button>
                </div>
                <div>
                  {" "}
                  <button
                    onClick={closelogoutmodel}
                    className="font-semibold bg-gray-200 hover:bg-gray-300  dark:text-gray-400 flex items-center p-1 px-4 rounded-md shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="body-back">
        <div className="text-center pt-5">
          <div>
            <img alt="alt" className="wish m-auto" src="wish.png"></img>
          </div>
          <div className="font-bold mt-5 text-2xl text-gray-500 dark:text-white border-b pb-6">
            My Wishlist
          </div>
        </div>

        <div className="flex justify-around mt-5 text-gray-500 dark:text-white pt-10 lg:flex-row flex-col lg:ml-0 ml-10 hidden lg:flex">
          <div className="pb-32 lg:pb-0">NFT Collection</div>
          <div className="pb-10 lg:pb-0">Name</div>
          <div className="pb-10 lg:pb-0">Description</div>
          <div className="pb-10 lg:pb-0">Price</div>
          <div className="pb-10 lg:pb-0"></div>
          <div className="pb-10 lg:pb-0">Remove</div>
        </div>

        {wishlist?.length
          ? wishlist?.map((item) => {
            return (
              <div
                key={item?.itemId}
                className="flex justify-around mt-5 items-center text-gray-500 dark:text-white "
              >
                <Link key={item.itemId} href={`/explore/${item?.itemId}`}>
                  <div className="mycard p-3 border-white">
                    <MarketPlaceCardWish {...item} />
                  </div>
                </Link>
                <div>{item?.name}</div>

                <div>{item?.description}</div>
                <div> {getEthPrice(item?.price)} MATIC</div>
                <div>
                  <button
                    onClick={() => buyNft(item)}
                    className="text-gray-500 px-2 dark:text-black bg-white w-full rounded-md py-2 font-bold"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })
          : null}

        {/* <div className="flex flex-row justify-around pt-10 lg:-ml-40 items-center text-gray-500 dark:text-white">
          <Link href={`/explore/123`}>
            <div className="mycard border-white">
              <MarketPlaceCardWish />
            </div>
          </Link>
          <div className="lg:flex-row flex-col lg:flex">
          <div className="m-10">name</div>
          <div className="m-10">description  uweiofhjkf jsdkfhjkls irojgv jfdkjv</div>
          <div className="m-10"> 10 MATIC</div>
          <div className="">
            <button
              onClick={() => buyNft(item)}
              className="text-gray-500 px-2 dark:text-black bg-white w-full rounded-md py-2 font-bold"
            >
              Buy Now
            </button>
          </div>
          </div>
        </div> */}



      <div class="w-full lg:px-8 md:px-6 overflow-y-hidden overflow-x-hidden h-auto" id="scroll">
        <div class="md:flex items-strech py-8 md:py-10 lg:py-8 px-4 border-gray-50">
          <div class="md:w-4/12 2xl:w-1/4 w-full">
            <img src="/vr.png" alt="Black Leather Bag" class="h-full object-center object-cover md:block hidden" />
            <img src="/vr.png" alt="Black Leather Bag" class="md:hidden w-full h-full object-center object-cover" />
          </div>
          <div class="md:pl-4 md:w-8/12 2xl:w-3/4 flex flex-col justify-center">
            <p class="text-xs leading-3 text-gray-800 dark:text-white md:pt-0 pb-4">NFT Collection</p>
            <p class="text-xs leading-3 text-gray-800 dark:text-white md:pt-0 py-4">Name</p>
            <div class="flex items-center justify-between w-full pt-1">
              <p class="text-base font-black leading-none text-gray-800 dark:text-white">Description</p>
               <p class="text-xs leading-3 underline text-red-500 pl-5 cursor-pointer">Remove</p>
            </div>
            {/* <p class="text-xs leading-3 text-gray-600 dark:text-white pt-2">Height: 10 inches</p>
            <p class="text-xs leading-3 text-gray-600 dark:text-white py-4">Color: Black</p>
            <p class="w-96 text-xs leading-3 text-gray-600 dark:text-white">Composition: 100% calf leather </p> */}
            <div class="flex items-center justify-between pt-5">
              <div class="flex itemms-center">
                <p class="text-xs leading-3 underline text-gray-800 dark:text-white cursor-pointer">favorites</p>
                <p class="text-xs leading-3 underline text-green-500 pl-5 cursor-pointer">Buy Now</p>
              </div>
              <p class="text-base font-black leading-none text-gray-800 dark:text-white">Price</p>
            </div>
          </div>
        </div>
        </div>

       

        {wishlist?.length == 0 && (
          <div className="font-bold text-2xl text-center p-12">
            No NFT Found For Selected Category
          </div>
        )}
      </div>
    </Layout>
  );
}
