import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { NavLink } from "reactstrap";
import Image from "next/image";
import AssetComp from "./assetComp";
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
                            {/* <img src={resdata?.Storefront.Image} width="60" height="60" className="mr-3" /> */}
                            <AssetComp
              uri={resdata?.Storefront.storefrontImage}
            />
                            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white text-gray-900">
                                {/* Myriadflow */}
                                {resdata?.Storefront.storefrontName}
                            </span>
                        </Link>
                        <div className="mt-10 dark:text-white text-gray-900">
                            {resdata?.Storefront.storefrontHeadline}
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
                            <div className="flex lg:flex-row md:flex-row flex-col">
                                <div>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                {resdata && (<div className="flex mt-4 space-x-5 sm:mt-0">
                                    <Link href={resdata?.Storefront.discord} target="_blank" className="border rounded-md p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                        <svg width="20" height="20" viewBox="0 0 40 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="dark:text-white text-gray-500">
                                            <path d="M21.713 3.33408C22.9292 3.32941 24.1454 3.34164 25.3613 3.37075L25.6847 3.38242C26.058 3.39575 26.4263 3.41242 26.8713 3.43242C28.6447 3.51575 29.8547 3.79575 30.9163 4.20742C32.0163 4.63075 32.943 5.20408 33.8697 6.13075C34.717 6.96343 35.3727 7.97066 35.7913 9.08241C36.203 10.1441 36.483 11.3557 36.5663 13.1291C36.5863 13.5724 36.603 13.9424 36.6163 14.3157L36.6263 14.6391C36.6559 15.8544 36.6687 17.0701 36.6647 18.2857L36.6663 19.5291V21.7124C36.6704 22.9286 36.6577 24.1449 36.628 25.3607L36.618 25.6841C36.6047 26.0574 36.588 26.4257 36.568 26.8707C36.4847 28.6441 36.2013 29.8541 35.7913 30.9157C35.3741 32.0287 34.7182 33.0367 33.8697 33.8691C33.0363 34.7163 32.0285 35.372 30.9163 35.7907C29.8547 36.2024 28.6447 36.4824 26.8713 36.5657C26.4263 36.5857 26.058 36.6024 25.6847 36.6157L25.3613 36.6257C24.1455 36.6554 22.9292 36.6682 21.713 36.6641L20.4697 36.6657H18.288C17.0718 36.6699 15.8555 36.6571 14.6397 36.6274L14.3163 36.6174C13.9207 36.6031 13.5251 36.5864 13.1297 36.5674C11.3563 36.4841 10.1463 36.2007 9.08299 35.7907C7.9708 35.373 6.96339 34.7171 6.13133 33.8691C5.28307 33.0362 4.6267 32.0283 4.20799 30.9157C3.79633 29.8541 3.51633 28.6441 3.43299 26.8707C3.41443 26.4753 3.39776 26.0797 3.38299 25.6841L3.37466 25.3607C3.34393 24.1449 3.33004 22.9287 3.33299 21.7124V18.2857C3.32834 17.0701 3.34056 15.8544 3.36966 14.6391L3.38133 14.3157C3.39466 13.9424 3.41133 13.5724 3.43133 13.1291C3.51466 11.3541 3.79466 10.1457 4.20633 9.08241C4.62528 7.97012 5.28293 6.96316 6.13299 6.13242C6.96448 5.28367 7.97126 4.6267 9.08299 4.20742C10.1463 3.79575 11.3547 3.51575 13.1297 3.43242L14.3163 3.38242L14.6397 3.37408C15.855 3.34337 17.0706 3.32948 18.2863 3.33242L21.713 3.33408ZM19.9997 11.6674C18.8955 11.6518 17.7993 11.8558 16.7746 12.2675C15.75 12.6793 14.8174 13.2905 14.0311 14.0658C13.2447 14.8411 12.6203 15.765 12.1941 16.7837C11.768 17.8024 11.5485 18.8956 11.5485 19.9999C11.5485 21.1042 11.768 22.1974 12.1941 23.2161C12.6203 24.2349 13.2447 25.1587 14.0311 25.934C14.8174 26.7093 15.75 27.3206 16.7746 27.7323C17.7993 28.144 18.8955 28.348 19.9997 28.3324C22.2098 28.3324 24.3294 27.4544 25.8922 25.8916C27.455 24.3288 28.333 22.2092 28.333 19.9991C28.333 17.7889 27.455 15.6693 25.8922 14.1065C24.3294 12.5437 22.2098 11.6674 19.9997 11.6674ZM19.9997 15.0007C20.6638 14.9885 21.3238 15.1087 21.941 15.3544C22.5582 15.6001 23.1202 15.9663 23.5943 16.4317C24.0684 16.897 24.445 17.4521 24.7021 18.0646C24.9592 18.6772 25.0917 19.3348 25.0918 19.9991C25.0919 20.6634 24.9596 21.321 24.7027 21.9336C24.4458 22.5462 24.0694 23.1015 23.5955 23.567C23.1216 24.0325 22.5596 24.3989 21.9425 24.6448C21.3254 24.8906 20.6655 25.0111 20.0013 24.9991C18.6752 24.9991 17.4035 24.4723 16.4658 23.5346C15.5281 22.5969 15.0013 21.3252 15.0013 19.9991C15.0013 18.673 15.5281 17.4012 16.4658 16.4635C17.4035 15.5259 18.6752 14.9991 20.0013 14.9991L19.9997 15.0007ZM28.7497 9.16741C28.212 9.18893 27.7035 9.41767 27.3307 9.8057C26.9579 10.1937 26.7496 10.711 26.7496 11.2491C26.7496 11.7872 26.9579 12.3044 27.3307 12.6925C27.7035 13.0805 28.212 13.3092 28.7497 13.3307C29.3022 13.3307 29.8321 13.1113 30.2228 12.7206C30.6135 12.3299 30.833 11.7999 30.833 11.2474C30.833 10.6949 30.6135 10.165 30.2228 9.77428C29.8321 9.38357 29.3022 9.16408 28.7497 9.16408V9.16741Z" fill="current" />
                                        </svg>
                                    </Link>
                                    <Link href={resdata?.Storefront.twitter} target="_blank" className="border rounded-md p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                        {/* <img src="/Vector1.png" /> */}
                                        <svg width="20" height="20" viewBox="0 0 36 34" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="dark:text-white text-gray-500">
                                            <path d="M28.3401 0.75H33.8534L21.8084 14.5167L35.9784 33.25H24.8818L16.1918 21.8883L6.24844 33.25H0.731771L13.6151 18.525L0.0234375 0.75H11.3984L19.2534 11.135L28.3368 0.75H28.3401ZM26.4051 29.95H29.4601L9.7401 3.87667H6.46177L26.4051 29.95Z" fill="current" />
                                        </svg>
                                    </Link>
                                </div>
                                )}
                            </ul>
                            </div>
                            <div>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium mt-4 lg:mt-0 md:mt-0 md:mx-4 lg:mx-4">
                                {resdata && (<div className="flex mt-4 space-x-5 lg:mt-0 md:mt-0">
                                    <Link href={resdata?.Storefront.instagram} target="_blank" className="border rounded-md p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                        {/* <img src="/Vector2.png" /> */}
                                        <svg width="24" height="20" viewBox="0 0 38 28" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="dark:text-white text-gray-500">
                                            <path d="M24.5044 0.666016C24.9792 0.666016 25.5751 0.77935 26.0536 0.886016C27.7219 1.25268 29.7001 1.70768 31.1044 2.66602C32.4116 3.55768 33.4272 5.11268 34.2119 6.69268C35.8436 9.98435 36.9784 14.3727 37.3707 17.7094C37.5577 19.2927 37.6036 20.886 37.2681 21.9577C37.1031 22.4844 36.7456 22.881 36.4944 23.1244C35.7281 23.8627 34.7417 24.4143 33.7664 24.916L33.2824 25.1643C32.9636 25.3256 32.6428 25.4834 32.3199 25.6377L31.3629 26.0877L30.0484 26.6827L28.9906 27.156C28.6034 27.3323 28.1602 27.3783 27.7393 27.286C27.3185 27.1936 26.9471 26.9688 26.6911 26.6514C26.435 26.334 26.3108 25.9445 26.3404 25.5518C26.3701 25.1592 26.5516 24.7887 26.8529 24.506L26.0572 23.0594C23.7693 23.6914 21.3901 24.0083 18.9989 23.9993C16.4872 23.9993 14.0911 23.666 11.9406 23.0594L11.1467 24.5027C11.4491 24.7849 11.6318 25.1553 11.6624 25.5483C11.6929 25.9413 11.5693 26.3314 11.3135 26.6494C11.0577 26.9675 10.6863 27.1929 10.2651 27.2856C9.84393 27.3783 9.40022 27.3324 9.01272 27.156L8.01539 26.706C6.90805 26.2094 5.80072 25.7127 4.72272 25.1643C3.59705 24.5927 2.40355 23.9844 1.51072 23.1227C1.15442 22.7953 0.88919 22.3953 0.737053 21.956C0.39972 20.886 0.447387 19.2943 0.632553 17.7094C1.02489 14.3727 2.15972 9.98435 3.79322 6.69268C4.57605 5.11268 5.59172 3.55768 6.89889 2.66602C8.30322 1.70768 10.2814 1.25268 11.9497 0.886016C12.4282 0.77935 13.0222 0.666016 13.4989 0.666016C13.7626 0.665809 14.0232 0.717309 14.263 0.817001C14.5027 0.916693 14.7161 1.06223 14.8883 1.24369C15.0606 1.42515 15.1878 1.63825 15.2613 1.86846C15.3347 2.09868 15.3526 2.34059 15.3139 2.57768C16.5339 2.41358 17.7656 2.33169 18.9989 2.33268C20.2657 2.33268 21.5032 2.41602 22.6912 2.57935C22.6522 2.34213 22.6699 2.10004 22.7432 1.86962C22.8165 1.6392 22.9437 1.42588 23.116 1.24423C23.2883 1.06258 23.5017 0.916889 23.7416 0.817098C23.9816 0.717308 24.2405 0.665774 24.5044 0.666016ZM26.9867 4.60435C26.7117 4.52435 26.6457 4.55935 26.5467 4.70935L26.4331 4.89602C26.1367 5.35779 25.6868 5.72214 25.1481 5.93659C24.6095 6.15104 24.0098 6.20453 23.4356 6.08935C21.9775 5.80481 20.4902 5.66289 18.9989 5.66602C17.4369 5.66602 15.9427 5.81602 14.5622 6.08935C13.988 6.20453 13.3883 6.15104 12.8496 5.93659C12.311 5.72214 11.8611 5.35779 11.5647 4.89602L11.4511 4.71102C11.3539 4.56102 11.2879 4.52602 11.0147 4.60435C10.3621 4.79268 9.66172 4.99435 9.09889 5.33268C8.57272 5.69102 7.87055 6.58268 7.13539 8.06435C5.73105 10.8927 4.63105 15.071 4.27905 18.0644C4.20572 18.696 4.16722 19.2377 4.15805 19.6844V20.1744C4.16539 20.471 4.18922 20.706 4.22222 20.876C4.68789 21.291 5.26355 21.616 5.84105 21.9144L7.09139 22.5427L7.90905 22.9344L8.57639 21.721C8.25329 21.4473 8.04972 21.0768 8.0031 20.6776C7.95648 20.2784 8.06993 19.8773 8.32261 19.548C8.57529 19.2188 8.95021 18.9835 9.37845 18.8854C9.80669 18.7874 10.2595 18.8332 10.6536 19.0143C12.8829 20.0327 15.7832 20.666 18.9989 20.666C22.2127 20.666 25.1149 20.0294 27.3442 19.016C27.7215 18.8442 28.1524 18.796 28.5642 18.8794C28.976 18.9628 29.3436 19.1729 29.6049 19.474C29.8662 19.7752 30.0052 20.1491 29.9985 20.5327C29.9918 20.9162 29.8397 21.2859 29.5681 21.5794L29.4214 21.721L30.0887 22.9377C30.6351 22.681 31.1832 22.4093 31.7332 22.1327C32.4482 21.7727 33.1999 21.3944 33.7811 20.8777C33.8141 20.706 33.8361 20.471 33.8452 20.1744V19.6844C33.8303 19.1425 33.79 18.6014 33.7242 18.0627C33.3722 15.071 32.2722 10.8927 30.8679 8.06268C30.1346 6.58268 29.4306 5.69102 28.9062 5.33268C28.3416 4.99435 27.6412 4.79268 26.9867 4.60435ZM13.0406 11.4993C13.8915 11.4993 14.7075 11.8066 15.3092 12.3536C15.9109 12.9006 16.2489 13.6425 16.2489 14.416C16.2489 15.1896 15.9109 15.9314 15.3092 16.4784C14.7075 17.0254 13.8915 17.3327 13.0406 17.3327C12.1897 17.3327 11.3736 17.0254 10.7719 16.4784C10.1702 15.9314 9.83222 15.1896 9.83222 14.416C9.83222 13.6425 10.1702 12.9006 10.7719 12.3536C11.3736 11.8066 12.1897 11.4993 13.0406 11.4993ZM24.9572 11.4993C25.8081 11.4993 26.6242 11.8066 27.2259 12.3536C27.8275 12.9006 28.1656 13.6425 28.1656 14.416C28.1656 15.1896 27.8275 15.9314 27.2259 16.4784C26.6242 17.0254 25.8081 17.3327 24.9572 17.3327C24.1063 17.3327 23.2903 17.0254 22.6886 16.4784C22.0869 15.9314 21.7489 15.1896 21.7489 14.416C21.7489 13.6425 22.0869 12.9006 22.6886 12.3536C23.2903 11.8066 24.1063 11.4993 24.9572 11.4993Z" fill="current" />
                                        </svg>

                                    </Link>
                                    <Link href={`mailto:${resdata?.Storefront.mailId}`} className="border rounded-md p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                                        {/* <img src="/Vector3.png" /> */}
                                        <svg width="20" height="20" viewBox="0 0 39 31" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="dark:text-white text-gray-500">
                                            <path d="M4.5 30.5C3.46875 30.5 2.58563 30.1325 1.85063 29.3975C1.11563 28.6625 0.748753 27.78 0.750003 26.75V4.25C0.750003 3.21875 1.1175 2.33563 1.8525 1.60063C2.5875 0.865628 3.47 0.498753 4.5 0.500003H34.5C35.5313 0.500003 36.4144 0.867503 37.1494 1.6025C37.8844 2.3375 38.2513 3.22 38.25 4.25V26.75C38.25 27.7813 37.8825 28.6644 37.1475 29.3994C36.4125 30.1344 35.53 30.5013 34.5 30.5H4.5ZM19.5 17.375L34.5 8V4.25L19.5 13.625L4.5 4.25V8L19.5 17.375Z" fill="current" />
                                        </svg>
                                    </Link>
                                </div>
                                )}
                            </ul>
                                </div>
                            </div>
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
