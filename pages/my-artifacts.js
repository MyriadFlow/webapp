/* pages/my-artifacts.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import Header from "../Components/Header"
import Footer from "../Components/Footer"
import { FaEthereum } from "react-icons/fa"

import {
  marketplaceAddress, creatifyAddress
} from '../config'

import Creatify from '../artifacts/contracts/Creatify.sol/Creatify.json'
import Marketplace from '../artifacts/contracts/Marketplace.sol/Marketplace.json'
import Layout from "../Components/Layout";
import { selectUser } from "../slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import HomeComp from "../Components/homeComp";
import HomeComp2 from "../Components/homecomp2";

// import { gql } from "@apollo/client";
import client from "../apollo-client";
import { request, gql } from 'graphql-request'

const graphqlAPI = "https://query.graph.lazarus.network/subgraphs/name/MyriadFlow"

// export async function getStaticProps() {
//   const { data } = await client.query({
//     query: gql`
//     query Query($where: MarketItem_filter) {
//       marketItems(first: 20, where: {seller: "0x313bfad1c87946bf893e2ecad141620eaa54943a"}) {
//         price
//         itemId
//         seller
//         forSale
//         tokenId
//         metaDataUri
//       }
//     }
//     `,
//   });

//   return {
//     props: {
//       marketItems: data.marketItems,
//     },
//   };
// }

// export default function MyAssets({ marketItems}) {

export const MyAssets = async () => {
  const query = gql`
    query Query($where: MarketItem_filter) {
            marketItems(first: 20, where: {seller: "0x313bfad1c87946bf893e2ecad141620eaa54943a"}) {
              price
              itemId
              seller
              forSale
              tokenId
              metaDataUri
            }
          }
          `
  const result = await request(graphqlAPI, query);
  console.log(result);

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  console.log(user);
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(marketplaceAddress, Marketplace.abi, signer)
    const tokenContract = new ethers.Contract(creatifyAddress, Creatify.abi, provider)
    setLoadingState('loaded')
  }
  return (
    <Layout>
      <div className="flex justify-center min-h-screen">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 lg:gap-24 p-4 mt-20  h-auto">
            {/* {marketItems.map((item) => {

              console.log(item);
              console.log(item.metaDataUri.substr(7, 50));

              return (<div
                key={item.itemId}
                className="bg-white dark:bg-gray-900  rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-800">
                <HomeComp uri={item ? item.metaDataUri.substr(7, 50) : ""} />


                <div className="flex px-4 py-6">
                  <HomeComp2 uri={item ? item.metaDataUri.substr(7, 50) : ""} />

                </div>
                <div className=" flex items-center justify-between px-4 mb-2">
                  <p className="font-1 text-sm font-bold">Price </p>
                  <div className="flex items-center">
                    <FaEthereum className="h-4 w-4 text-blue-400" />
                    <p className="font-extralight dark:text-gray-400">{item.price}</p>
                  </div>
                </div>

                <div className="px-4 py-4 bg-gray-100 dark:bg-gray-700 flex justify-between">
                  <button onClick={() => buyNft(nft)} className="text-blue-500 hover:text-blue-400 font-bold">Buy now</button>
                </div>

              </div>)
            })} */}
          </div>
        </div>
      </div>
    </Layout>
  )
}