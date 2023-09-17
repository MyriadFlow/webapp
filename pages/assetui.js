
import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import { BiWallet } from "react-icons/bi";

function Token() {

    return (
        <Layout>
            <div className="min-h-screen p-8 mx-auto bg-[#f8f7fc] dark:bg-[#131417] dark:body-back body-back-light">
                <div className="flex flex-col lg:flex-row">
                    <div className="w-1/3 border border-gray-600 p-4 mr-4">
                        <img src="/vr.png" />
                        <div className="mt-10 mb-4 font-bold">Description</div>
                        <div>Lorem ipsum dolor sit amet. Et nihil laborum est facere
                            galisum vel fuga saepe est quidem accusantium hic
                            expedita sapiente ut molestiae sapiente. Quo quod nostrum
                            qui optio tenetur eum corporis nesciunt qui molestias
                            cumque in voluptate dolorem non sequi voluptates.</div>
                    </div>

                    <div className="w-2/3">

                        <div className="pl-10 border border-gray-600 p-4 mb-4">
                            <div>SignatureSeries</div>
                            <div className="pt-10 pb-4 font-bold text-xl">Asset Name</div>
                            <div className="pb-10">Owned by</div>
                            <div>Current price</div>
                            <h2 className="font-bold text-xl">Price Amount ETH  $....</h2>
                            <div className="flex">
                                <button
                                    className="flex gap-x-2 items-center justify-center px-10 py-3 my-4 text-sm font-medium rounded-lg bg-white text-black"
                                >
                                    <span className="text-lg font-bold">Buy Now</span>
                                    <BiWallet className="text-3xl" />
                                </button>
                                <button
                                    className="flex gap-x-2 items-center justify-center px-10 py-3 m-4 text-sm font-medium rounded-lg text-white border"
                                >
                                    <BiWallet className="text-3xl" />
                                    <span className="text-lg font-bold">Make an Offer</span>

                                </button>
                            </div>
                        </div>

                        <div className="pl-10 border border-gray-600 p-4">
                            <div className="pt-10 pb-4 font-bold text-xl">Rental Duration</div>
                            <div className="pb-10">Price</div>
    
                            <div className="flex">
                                <button
                                    className="flex gap-x-2 items-center justify-center px-10 py-3 my-4 text-sm font-medium rounded-lg text-white border"
                                >
                                    <span className="text-lg font-bold">Months Days Hours</span>
                                </button>
                                <button
                                    className="flex gap-x-2 items-center justify-center px-10 py-3 m-4 text-sm font-medium rounded-lg text-white bg-blue-700"
                                >
                                    <BiWallet className="text-3xl" />
                                    <span className="text-lg font-bold">Rent Now</span>

                                </button>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
        </Layout>
    );
}

export default Token;
