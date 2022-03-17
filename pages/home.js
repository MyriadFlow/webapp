/* pages/index.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { FaEthereum } from "react-icons/fa"

// import {
// 	creatifyAddress, marketplaceAddress
// } from '../config'

import Creatify from '../artifacts/contracts/Creatify.sol/Creatify.json'
import Marketplace from '../artifacts/contracts/Marketplace.sol/Marketplace.json'
import Header from '../Components/Header'
import Footer from "../Components/Footer"

import Filter from '../Components/Filter'
import Link from "next/link";
import { IoIosArrowDropright } from "react-icons/io"
import { selectModel } from "../slices/modelSlice"
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../slices/userSlice"
import { logoutbalance } from "../slices/balanceSlice"
import { close } from "../slices/modelSlice";

import HomeComp from "../Components/homeComp";
import HomeComp2 from "../Components/homecomp2";

import { gql } from "@apollo/client";
import client from "../apollo-client";
import BuyAsset from "../Components/buyAssetModal";
import { buyNFT } from "./api/buyNFT";
import Layout from "../Components/Layout";

const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
const creatifyAddress = process.env.NEXT_PUBLIC_CREATIFY_ADDRESS;
const rpc_provider = process.env.NEXT_PUBLIC_RPC_PROVIDER;

export async function getStaticProps() {
	const { data } = await client.query({
		query: gql`
    query Query {
      marketItems(first: 25,where:{sold:false}) {
        price
        itemId
        seller
        forSale
        tokenId
        metaDataUri
      }
    }
    `,
	});

	return {
		props: {
			marketItems: data.marketItems,
		},
	};
}


function Home({ marketItems }) {

	const logoutmodel = useSelector(selectModel)
	const dispatch = useDispatch();



	// function for logout 
	const logoutmetamask = () => {
		dispatch(logout());
		dispatch(logoutbalance());
		dispatch(close())


	}

	// function for closing logout model 
	const closelogoutmodel = () => {
		dispatch(close())

	}



	const [nfts, setNfts] = useState([])
	const [filter, Setfilter] = useState(false);
	const [model, setmodel] = useState(false);
	const [modelmsg, setmodelmsg] = useState("buying in progress!");
	// const [dropmenu, setdropmenu] = useState(false);


	const toogle = () => {
		Setfilter(!filter)
	}


	const [loadingState, setLoadingState] = useState('not-loaded')
	useEffect(() => {
		loadNFTs()
	}, []);

	function getEthPrice(price){
		return ethers.utils.formatEther(price)
	}

	async function loadNFTs() {
		/* create a generic provider and query for unsold market items */
		// const provider = new ethers.providers.JsonRpcProvider({ url: rpc_provider })
		// const tokenContract = new ethers.Contract(creatifyAddress, Creatify.abi, provider)
		// const marketContract = new ethers.Contract(marketplaceAddress, Marketplace.abi, provider)
		setLoadingState('loaded')
	}
	async function buyNft(nft) {
		// console.log(nft.price)
		setmodelmsg("Buying in Progress")
		await buyNFT(nft, setmodel, setmodelmsg);
		loadNFTs();
	}
	return (
		<Layout>
			{model && <BuyAsset open={model} setOpen={setmodel} message={modelmsg} />}

			{/* logout model  */}

			{logoutmodel && (
				<div className="flex items-center  shadow-md justify-center w-full h-screen model-overlay fixed  top-0 z-50">
					<div className="h-56 w-80 bg-white  dark:bg-gray-800 shadow-lg rounded-md fixed z-50 flex items-center justify-center  ring-offset-2 ring-2 ring-blue-400">
						<div className="flex flex-col justify-center items-center">
							<p className="text-lg font-semibold dark:text-gray-200"> Are you sure wanna logout ?</p>
							<div className="flex items-center space-x-8 mt-10 ">
								<div><button
									onClick={logoutmetamask}
									className="font-semibold bg-blue-500 hover:bg-blue-700 shadow-md p-1 px-4 rounded-md">Ok</button></div>
								<div> <button
									onClick={closelogoutmodel}
									className="font-semibold bg-gray-200 hover:bg-gray-300  dark:text-gray-400 flex items-center p-1 px-4 rounded-md shadow-md">Cancel</button></div>
							</div>
						</div>

					</div>
				</div>)}

			<main className=" bg:gray-100 dark:bg-gray-800 h-auto">
				<div className="bg-gray-100 dark:bg-gray-700   w-full h-12 z-30  fixed top-16 px-10  ">
					<div > <IoIosArrowDropright onClick={toogle} className="h-8 w-8 text-gray-400 mt-2 cursor-pointer hover:text-gray-800 " /></div>
				</div>
				{filter &&
					<Filter toogle={toogle} filter={!filter} />
				}
				<div className=" mt-20 min-h-screen" >

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 lg:gap-24 p-4 mt-28  h-auto">

						{marketItems.map((item) => {

							console.log(item);
							console.log(item.metaDataUri.substr(7, 50));

							return (

								<div
									key={item.itemId}
									className="bg-white dark:bg-gray-900  rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-800">

									<Link key={item.itemId} href={`/assets/${item.itemId}`}>
										<div>
											<HomeComp uri={item ? item.metaDataUri.substr(7, 50) : ""} />


											<div className="flex px-4 py-6">
												<HomeComp2 uri={item ? item.metaDataUri.substr(7, 50) : ""} />

											</div>
											<div className=" flex items-center justify-between px-4 mb-2">
												<p className="font-1 text-sm font-bold">Price </p>
												<div className="flex items-center">
													<FaEthereum className="h-4 w-4 text-blue-400" />
													<p className="font-extralight dark:text-gray-400">{getEthPrice(item.price)}</p>
												</div>
											</div>
										</div>
									</Link>
									<div className="px-4 py-4 bg-gray-100 dark:bg-gray-700 flex justify-between">
										<button onClick={() => buyNft(item)} className="text-blue-500 hover:text-blue-400 font-bold">Buy now</button>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</main>
		</Layout>
	)
}
export default Home
