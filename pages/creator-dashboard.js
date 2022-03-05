/* pages/creator-dashboard.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import Header from '../Components/Header'
import Footer from "../Components/Footer"
import { FaEthereum } from "react-icons/fa"

import {
	marketplaceAddress, creatifyAddress
} from '../config'

import Creatify from '../artifacts/contracts/Creatify.sol/Creatify.json'
import Marketplace from '../artifacts/contracts/Marketplace.sol/Marketplace.json'
import Layout from "../Components/Layout";

export default function CreatorDashboard() {
	const [nfts, setNfts] = useState([])
	const [sold, setSold] = useState([])
	const [loadingState, setLoadingState] = useState('not-loaded')
	useEffect(() => {
		loadNFTs()
	}, []);

	async function loadNFTs() {
		const web3Modal = new Web3Modal({
			network: "mainnet",
			cacheProvider: true,
		});

		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()

		const marketContract = new ethers.Contract(marketplaceAddress, Marketplace.abi, signer)
		const tokenContract = new ethers.Contract(creatifyAddress, Creatify.abi, provider)
		// const data = await marketContract.fetchItemsCreated()

		// const items = await Promise.all(data.map(async i => {
		//   const tokenUri = await tokenContract.tokenURI(i.tokenId)
		//   const meta = await axios.get(tokenUri)
		//   let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
		//   let item = {
		//     price,
		//     tokenId: i.tokenId.toNumber(),
		//     seller: i.seller,
		//     owner: i.owner,
		//     sold: i.sold,
		//     image: meta.data.image,
		//   }
		//   return item
		// }))
		// /* create a filtered array of items that have been sold */
		// const soldItems = items.filter(i => i.sold)
		// setSold(soldItems)
		// setNfts(items)
		// setLoadingState('loaded') 
	}
	// if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets created</h1>)
	return (
		<Layout>
			<div className="p-4 px-10 min-h-screen">
				<h2 className="text-xl pt-20 pb-4 border-b-2">Items Created</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
					{/* {
            nfts.map((nft, i) => ( */}

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

					{/* ))
             
          } */}
				</div>
			</div>
			<div className="px-4">
				{
					Boolean(sold.length) && (
						<div>
							<h2 className="text-2xl py-2">Items sold</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
								{
									sold.map((nft, i) => (
										<div key={i} className="border shadow rounded-xl overflow-hidden">
											<img src={nft.image} className="rounded" />
											<div className="p-4 bg-black">
												<p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
											</div>
										</div>
									))
								}
							</div>
						</div>
					)
				}
			</div>
			</Layout>
	)
}