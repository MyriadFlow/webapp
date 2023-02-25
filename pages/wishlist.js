import React from 'react'
import Layout from '../Components/Layout'
import { useEffect, useState } from "react";
import { request, gql } from "graphql-request";
import { getMetaData, removePrefix } from "../utils/ipfsUtil";
import Link from "next/link";
import { MarketPlaceCardWish } from "../Components/Cards/MarketPlaceCardWish";
import { FaEthereum } from "react-icons/fa";
import { ethers } from "ethers";
import { buyNFT } from "./api/buyNFT";
import { useDispatch, useSelector } from "react-redux";
import { selectModel } from "../slices/modelSlice";
import BuyAsset from "../Components/buyAssetModal";
import { saleStartedQuery } from '../utils/gqlUtil';

const graphqlAPI = process.env.NEXT_PUBLIC_MARKETPLACE_API;

export default function Wishlist() {
    const [data, setData] = useState([]);
    const [modelmsg, setmodelmsg] = useState("buying in progress!");
    const [model, setmodel] = useState(false);
    const logoutmodel = useSelector(selectModel);


    const [shallowData, setShallowData] = useState([]);


    const market = async () => {
        const result = await request(graphqlAPI, saleStartedQuery);
        const fResult = await Promise.all(
          result.saleStarteds.map(async function (obj, index) {
            const nftData = await getMetaData(obj.metaDataURI);
            const { name, description, categories, image } = nftData;
            return {
              ...obj,
              name,
              description,
              categories: categories,
              image: nftData?.image? `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${removePrefix(
                image
              )}`:"",
            };
          })
        );
        const sortedNFts = fResult.sort((a, b) => {
          if (a.itemId < b.itemId) return -1;
        });
        setData(sortedNFts);
        setShallowData(sortedNFts);
      };
      useEffect(() => {
        market();
      }, );
      function getEthPrice(price) {
        return ethers.utils.formatEther(price);
      }
      async function buyNft(nft) {
        setmodelmsg("Buying in Progress");
        await buyNFT(nft, setmodel, setmodelmsg);
      }
    
  return (
    <Layout title="WishList" description="This is used to show Wishlist/Add to cart info">
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
    <div className='body-back'>
        <div className='text-center mt-5'>
    <div>
        <img alt="alt" className='wish ' src="wish.png" style={{margin:'0 auto'}}></img>
    </div>
    <div className='font-bold mt-5 text-2xl text-gray-500 dark:text-white'>My Wishlist</div>
    </div>
    <div className="flex justify-center mt-5 ml-5 "style={{borderBottom:"2px solid",padding:"18px"}}></div>

     <div className='flex justify-around mt-5 text-gray-500 dark:text-white'>
        <div>NFT Collection</div>
        <div>Name</div>
        <div>Description</div>
        <div>Price</div>
          <div></div>
    </div>
    
    
   
    {data?.length ? data?.map((item) => {
        return( 
             <div key={item.itemId} className='flex justify-around mt-5 items-center text-gray-500 dark:text-white ' >
       <Link key={item.itemId} href={`/explore/${item.itemId}`}>
        <div className='mycard p-3' style={{ border: "2px solid white" }}>
            <MarketPlaceCardWish  {...item} />

        </div>
        </Link>
        <div>{item.name}</div>

        <div>{item.description}</div>
        <div> {getEthPrice(item.price)} MATIC</div>
        <div>
        <button
                    onClick={() => buyNft(item)}
                    className="text-gray-500 px-2 dark:text-black bg-white w-full rounded-md py-2 font-bold"
                  >
                    Buy Now
                  </button>
       </div>
        {/* <div>
        <img alt="alt"  className='wish' src="delete.png"></img>
        </div> */}
    </div>
          );
        }):
        null
        }
          {data?.length == 0 && <div className="font-bold text-2xl">No NFT Found For Selected Category</div>}
    </div>
    </Layout>
  )
}
