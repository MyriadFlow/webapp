import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import HomeComp from "../../Components/homeComp";
import HomeComp2 from "../../Components/homecomp2";
import AssetImage from "../../Components/assetImage";
import AssetDesc from "../../Components/assetDesc";
import AssetHead from "../../Components/assetHead";
import { BsArrowUpRight } from "react-icons/bs"
import { gql } from "@apollo/client";
import client from "../../apollo-client";
import React, {useEffect, useState} from 'react';
import axios from 'axios';

function asset({ asset }) {
    console.log(asset);
    const nfturl= `https://ipfs.io/ipfs/${asset.marketItems[0].metaDataUri.substr(7, 50)}`;

    const [response,setResponse] = useState([]);
    const [image, setImage] = useState("");

    const metadata = async()=>{
        const { data } = await axios.get(
            `https://ipfs.io/ipfs/${asset.marketItems[0].metaDataUri.substr(7, 50)}`
        );
        setResponse(data);
        setImage(data.image);
        let preuri = image.substr(7,50);    
    }

    useEffect(() => {
        metadata();   
      },[asset.marketItems[0].metaDataUri.substr(7, 50)]);
    let preuri = image.substr(7,50);

    const imgurl= `https://ipfs.io/ipfs/${preuri}`;
    const transaction = `https://etherscan.io/token/${asset.marketItems[0].nftContract}?a=${asset.marketItems[0].tokenId}`;

    return (
        <div className=" w-full">
            <Header />
            <div class="grid place-items-center h-screen bg-gray-100 dark:bg-gray-300">
                <div className="scale-125 hover:scale-150 cursor-pointer">
                    <div className="scale-150">
                        <HomeComp uri={asset.marketItems[0] ? asset.marketItems[0].metaDataUri.substr(7, 50) : ""} />
                    </div>
                </div>
            </div>

            <div class="bg-white md:mx-40 dark:bg-gray-900">
                <main class="my-10">
                    <div class="container mx-auto px-6">
                        <h3 class="text-gray-700 text-2xl font-medium"><AssetHead uri={asset.marketItems[0] ? asset.marketItems[0].metaDataUri.substr(7, 50) : ""} /></h3>
                        <div class="flex flex-col lg:flex-row mt-8">
                            <div class="w-full lg:w-1/2 order-2">
                                <div class="border rounded-md w-full px-4 py-3">
                                    <div class="flex items-center justify-between my-3">
                                        <h3 class="text-gray-500 font-medium dark:text-white">NFT Details</h3>
                                    </div>
                                    <div class="flex items-center justify-between my-4">
                                        <h3 class="text-gray-700 font-medium dark:text-gray-300">Contract Address</h3>
                                        <span class="text-gray-600 text-sm dark:text-gray-400">{asset.marketItems[0].nftContract}</span>
                                    </div>
                                    <div class="flex items-center justify-between my-4">
                                        <h3 class="text-gray-700 font-medium dark:text-gray-300">Token ID</h3>
                                        <span class="text-gray-600 text-sm dark:text-gray-400">{asset.marketItems[0].tokenId}</span>
                                    </div>
                                    <div class="flex items-center justify-between my-4">
                                        <h3 class="text-gray-700 font-medium dark:text-gray-300">Blockchain</h3>
                                        <span class="text-gray-600 text-sm dark:text-gray-400">ETHEREUM</span>
                                    </div>
                                    <div class="flex items-center justify-between -my-4">
                                        <h3 class="text-gray-700 font-medium dark:text-gray-300">IPFS</h3>
                                        <span class="text-gray-600 text-sm"><a href={imgurl} className="text-gray-600 dark:text-gray-400"><BsArrowUpRight/></a></span>
                                    </div>
                                    <div class="flex items-center justify-between -my-4">
                                        <h3 class="text-gray-700 font-medium dark:text-gray-300">IPFS Metadata</h3>
                                        <span class="text-gray-600 text-sm"><a href={nfturl} className="text-gray-600 dark:text-gray-400"><BsArrowUpRight/></a></span>
                                    </div>
                                    <div class="flex items-center justify-between -my-4 pb-4">
                                        <h3 class="text-gray-700 font-medium dark:text-gray-300">Etherscan Transaction</h3>
                                        <span class="text-gray-600 text-sm"><a href={transaction} className="text-gray-600 dark:text-gray-400"><BsArrowUpRight/></a></span>
                                    </div>
                                </div>
                            </div>
                            <div class="w-full mb-8 flex-shrink-0 order-1 lg:w-1/2 lg:mb-0 lg:order-2">
                                <div class="flex justify-center lg:justify-end">
                                    <div class="border rounded-md max-w-md w-full px-4 py-3">
                                        <div class="flex items-center justify-between">
                                            <h3 class="text-gray-700 font-medium dark:text-white">Asset Worth</h3>
                                            <span class="text-gray-600 text-sm dark:text-white">Price</span>
                                        </div>
                                        <div class="flex justify-between mt-6">
                                            <div class="flex">
                                                <div className="h-20 w-20">
                                                    <AssetImage uri={asset.marketItems[0] ? asset.marketItems[0].metaDataUri.substr(7, 50) : ""} />
                                                </div>
                                                <div class="mx-3 mt-6">
                                                    <h3 class="text-sm text-gray-600"><AssetDesc uri={asset.marketItems[0] ? asset.marketItems[0].metaDataUri.substr(7, 50) : ""} /></h3>
                                                </div>
                                            </div>
                                            <span class="text-gray-600 mt-6 dark:text-gray-400">{asset.marketItems[0].price}</span>
                                        </div>
                                        <div className="flex items-center justify-end">
                                            <button class="px-3 py-2 w-1/3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                                                <span>Buy NFT</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    )
}

export async function getServerSideProps(context) {
    const { id } = context.query

    const { data } = await client.query({
        query: gql`
        query Query($where: MarketItem_filter) {
            marketItems(where: {id:${id}}) {
              price
              itemId
              seller
              forSale
              tokenId
              metaDataUri
              owner
              nftContract
            }
          }
    `,
    });

    return {
        props: {
            asset: data,
        }
    }
}


export default asset