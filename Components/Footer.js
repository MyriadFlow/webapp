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
        <footer className="bg-white dark:bg-gray-900 dark:body-back body-back-light border-t">
            <div className="mx-auto w-full max-w-screen-xl lg:p-0 py-6 lg:py-8 p-12">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0 lg:w-1/3 md:w-1/2 w-full md:mx-10">
                        <Link href="https://myriadflow.com/" className="flex items-center">
                            <Image alt="dark" src="/dark.svg" width="60" height="60" className="mr-3" />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white text-gray-900">
                                Myriadflow
                                {/* {resdata?.string} */}
                                </span>
                        </Link>
                        <div className="mt-10 dark:text-white text-gray-900">
                        {resdata?.description}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 lg:grid-cols-5 md:grid-cols-3">
                        <div>
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
                        </div>

                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Dashboard</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <Link href="#" className="hover:underline">Created</Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="#" className="hover:underline">Sold</Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="#" className="hover:underline">Bought</Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="#" className="hover:underline">Market</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">My Profile</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <Link href="#" className="hover:underline ">Created</Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="#" className="hover:underline">Wishlist</Link>
                                </li>
                                <li>
                                    <Link href="#" className="hover:underline">Cart</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Company</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <Link href="/about" className="hover:underline">About</Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="#" className="hover:underline">Terms &amp; Conditions</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Contact Us</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                            { resdata && (<div className="flex mt-4 space-x-5 sm:mt-0">
                                    <Link href={resdata?.discord} target="_blank" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 16">
                                            <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
                                        </svg>
                                        <span className="sr-only">Discord community</span>
                                    </Link>
                                    <Link href={resdata?.twitter} target="_blank" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                                            <path fillRule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clipRule="evenodd" />
                                        </svg>
                                        <span className="sr-only">Twitter page</span>
                                    </Link>
                                    <Link href={resdata?.instagram} target="_blank" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
                                        <path d="M349.33,69.33a93.62,93.62,0,0,1,93.34,93.34V349.33a93.62,93.62,0,0,1-93.34,93.34H162.67a93.62,93.62,0,0,1-93.34-93.34V162.67a93.62,93.62,0,0,1,93.34-93.34H349.33m0-37.33H162.67C90.8,32,32,90.8,32,162.67V349.33C32,421.2,90.8,480,162.67,480H349.33C421.2,480,480,421.2,480,349.33V162.67C480,90.8,421.2,32,349.33,32Z"/><path d="M377.33,162.67a28,28,0,1,1,28-28A27.94,27.94,0,0,1,377.33,162.67Z"/><path d="M256,181.33A74.67,74.67,0,1,1,181.33,256,74.75,74.75,0,0,1,256,181.33M256,144A112,112,0,1,0,368,256,112,112,0,0,0,256,144Z"/></svg>
                                        <span className="sr-only">Instagram page</span>
                                    </Link>
                                </div>
                                )}
                                { resdata && (<div className="flex mt-4 space-x-5">
                                    <Link href={`mailto:${resdata?.mailId}`} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                    <svg className="w-4 h-4" aria-hidden="true" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M44 24V9H24H4V24V39H24" stroke="#333" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M31 36L36 40L44 30" stroke="#333" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 9L24 24L44 9" stroke="#333" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>
                                        <span className="sr-only">Mail ID</span>
                                    </Link> 
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
