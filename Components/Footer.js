import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NavLink } from "reactstrap";
import Image from "next/image";
import { useData } from "../context/data";

const Footer = () => {
    let date = new Date();
    let year = date.getFullYear();
    const router = useRouter();

    const { resdata } = useData();

    return (
        <footer className="bg-white dark:bg-gray-900 dark:body-back body-back-light border-t dark:border-gray-700 border-gray-200">
            <div className="mx-auto w-full max-w-screen-xl lg:p-0 py-6 lg:py-8 p-12">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0 lg:w-1/3 md:w-1/2 w-full md:mx-10">
                        <Link href="https://myriadflow.com/" className="flex items-center">
                            <img src={resdata?.Storefront.Profileimage} width="60" height="60" className="mr-3" />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white text-gray-900">
                                {/* Myriadflow */}
                                {resdata?.Storefront.string}
                                </span>
                        </Link>
                        <div className="mt-10 dark:text-white text-gray-900">
                        {resdata?.Storefront.description}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 lg:grid-cols-5 md:grid-cols-3">
                        {/* <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Explore</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <Link href="#" className="hover:underline">All</Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="#" className="hover:underline">Image</Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="#" className="hover:underline">Music</Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="#" className="hover:underline">Video</Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="#" className="hover:underline">Document</Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:underline">Others</Link>
                                </li>
                            </ul>
                        </div> */}

                        <div>
                            <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Dashboard</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                {/* <li className="mb-4">
                                    <Link href="#" className="hover:underline">Created</Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="#" className="hover:underline">Sold</Link>
                                </li> */}
                                <li className="mb-4">
                                    <Link href="/dashboard" className="hover:underline">Owned</Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="/dashboard" className="hover:underline">Market</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">My Profile</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <Link href="/profile" className="hover:underline ">About</Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="/wishlist" className="hover:underline">Wishlist</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Company</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <Link href="/about" className="hover:underline">About</Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="#" className="hover:underline">Terms</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Contact Us</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                            { resdata && (<div className="flex mt-4 space-x-5 sm:mt-0">
                                    <Link href={resdata?.Storefront.discord} target="_blank" className="border rounded-md p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                        <img src="/Vector.png"/>
                                    </Link>
                                    <Link href={resdata?.Storefront.twitter} target="_blank" className="border rounded-md p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                    <img src="/Vector1.png"/>
                                    </Link>
                                    <Link href={resdata?.Storefront.instagram} target="_blank" className="border rounded-md p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                    <img src="/Vector2.png"/>
                                    </Link>
                                    <Link href={`mailto:${resdata?.Storefront.mailId}`} className="border rounded-md p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                    <img src="/Vector3.png"/>
                                    </Link> 
                                </div>
                                )}
                                { resdata && (<div className="flex mt-4 space-x-5">
                                    
                                </div>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className=" border-gray-200 sm:mx-auto dark:border-gray-700 my-4" />
                <div className="sm:flex items-center justify-center">
                    <span className="lg:text-base md:text-base text-xs font-bold sm:text-center dark:text-white text-gray-500">MyriadFlow | Copyright © {year} Lazarus Network Inc. All Rights Reserved
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
