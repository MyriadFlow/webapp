/* pages/my-artifacts.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import Header from "../Components/Header"
import Footer from "../Components/Footer"
import {FaEthereum} from "react-icons/fa"

import {
  marketplaceAddress, creatifyAddress
} from '../config'

import Creatify from '../artifacts/contracts/Creatify.sol/Creatify.json'
import Marketplace from '../artifacts/contracts/Marketplace.sol/Marketplace.json'
import Layout from "../Components/Layout";

export default function MyAssets() {
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
      <div className="p-4 pt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            // nfts.map((nft, i) => (
              // <div key={i} className="border shadow-md rounded-xl overflow-hidden hover:scale-105 transition transform ease-out duration-200 cursor-pointer group ">
              //   <img src={nft.image} className="rounded p-2" />
              //   <div className="p-4 bg-black  group-hover:bg-white flex justify-center ">
              //     <p className="text-md font-bold text-white  group-hover:text-black ">Price -</p> 
              //     <div className="flex">
              //     <FaEthereum className="h-6 w-6 text-white group-hover:text-black "/>
              //     <p className="text-white text-md  group-hover:text-black ">{nft.price} Eth</p>
              //     </div>
                 
                  
              //   </div>
              // </div>
              <div
						// key={i} 
						className="border shadow-md rounded-xl overflow-hidden hover:scale-105 transition transform ease-out duration-200 cursor-pointer group ">
						<img src="https://www.forbes.com/advisor/wp-content/uploads/2021/04/NFT.jpeg-900x510.jpg" className="rounded p-2 h-44 w-full" />
						<div className="p-4 bg-blue-500 dark:bg-black group-hover:bg-gray-200 flex justify-center ">
							<p className="text-md font-bold text-white group-hover:text-black ">Price -</p>
							<div className="flex">
								<FaEthereum className="h-6 w-6 text-white group-hover:text-black " />
								<p className="text-white text-md  group-hover:text-black">0.1 ETH</p>
							</div>


						</div>
					</div>
          //   ))
          }
        </div>
      </div>
    </div>
    </Layout> 
  )
}