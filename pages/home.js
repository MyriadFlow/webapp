/* pages/index.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { FaEthereum } from "react-icons/fa"

import {
	creatifyAddress, marketplaceAddress
} from '../config'

import Creatify from '../artifacts/contracts/Creatify.sol/Creatify.json'
import Marketplace from '../artifacts/contracts/Marketplace.sol/Marketplace.json'
import Header from '../Components/Header'
import Footer from "../Components/Footer"

import Filter from '../Components/Filter'
// import {FaRegHeart} from "react-icons/fa"
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

export async function getStaticProps() {
	const { data } = await client.query({
		query: gql`
    query Query {
      marketItems(first: 10) {
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


function home({ marketItems }) {

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
	// const [dropmenu, setdropmenu] = useState(false);


	const toogle = () => {
		Setfilter(!filter)
	}


	const [loadingState, setLoadingState] = useState('not-loaded')
	useEffect(() => {
		loadNFTs()
	}, [

	])
	async function loadNFTs() {
		/* create a generic provider and query for unsold market items */
		const provider = new ethers.providers.JsonRpcProvider({ url: "https://rpc-mumbai.maticvigil.com/v1/6b26aad1d887708c0004394c103f8b27c1141540" })
		const tokenContract = new ethers.Contract(creatifyAddress, Creatify.abi, provider)
		const marketContract = new ethers.Contract(marketplaceAddress, Marketplace.abi, provider)
		// const data = await marketContract.fetchMarketItems()

		/*
		*  map over items returned from smart contract and format 
		*  them as well as fetch their token metadata
		*/
		// const items = await Promise.all(data.map(async i => {
		//   const tokenUri = await tokenContract.tokenURI(i.tokenId)
		//   const meta = await axios.get(tokenUri)
		//   let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
		//   let item = {
		//     price,
		//     tokenId: i.tokenId.toNumber(),
		//     seller: i.seller,
		//     owner: i.owner,
		//     image: meta.data.image,
		//     name: meta.data.name,
		//     description: meta.data.description,
		//   }
		//   return item
		// }))
		// setNfts(items)
		setLoadingState('loaded')
	}
	async function buyNft(nft) {
		/* needs the user to sign the transaction, so will use Web3Provider and sign it */
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()
		const contract = new ethers.Contract(marketplaceAddress, Marketplace.abi, signer)

		/* user will be prompted to pay the asking proces to complete the transaction */
		setmodel(true)
		const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
		const transaction = await contract.createMarketSale(creatifyAddress, nft.tokenId, {
			value: price
		})
		await transaction.wait()
		setmodel(false);
		loadNFTs()
	}
	// if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
	return (
		<div >
			<Header />



			{model &&

				<div className="flex items-center  shadow-md justify-center w-full h-screen model-overlay fixed z-50">
					<div className="h-56 w-80 bg-white shadow-lg rounded-md fixed z-50 flex items-center justify-center  ring-offset-2 ring-2 ring-blue-400">

						<div className="flex flex-col justify-center items-center">
							<div className="h-10 w-10 bg-blue-400 ring-offset-2 ring-2 ring-blue-500 ml-2 animate-bounce rounded-full"></div>
							<p className="text-lg font-semibold"> Buying in Process </p>
						</div>


					</div>
				</div>}




			{/* logout model  */}

			{logoutmodel &&

				<div className="flex items-center  shadow-md justify-center w-full h-screen model-overlay fixed  top-0 z-50">
					<div className="h-56 w-80 bg-white  dark:bg-gray-800 shadow-lg rounded-md fixed z-50 flex items-center justify-center  ring-offset-2 ring-2 ring-blue-400">

						<div className="flex flex-col justify-center items-center">

							<p className="text-lg font-semibold dark:text-gray-200"> Are you sure wana logout ?</p>
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
				</div>}







			<main className=" bg:gray-100 dark:bg-gray-800 h-auto">
				<div className="bg-gray-100 dark:bg-gray-700   w-full h-12 z-30  fixed top-16 px-10  ">






					<div > <IoIosArrowDropright onClick={toogle} className="h-8 w-8 text-gray-400 mt-2 cursor-pointer hover:text-gray-800 " /></div>

				</div>





				{filter &&
					<Filter toogle={toogle} filter={!filter} />
				}

				<div className=" mt-20 min-h-screen" >

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 mt-28  h-auto">

						{marketItems.map((item) => {

							console.log(item);

							return (<div
								key={item.itemId}
								className="bg-white dark:bg-gray-900  rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-800">
								<HomeComp uri={item ? item.metaDataUri : ""} />


								<div className="flex px-4 py-6">
									<HomeComp2 uri={item ? item.metaDataUri : ""} />

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
						})}

					</div>
				</div>
			</main>
			<Footer />
		</div>
	)
}
export default home