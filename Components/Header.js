import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Accessmater from '../artifacts/contracts/accessmaster/AccessMaster.sol/AccessMaster.json'
import { selectUser } from "../slices/userSlice";
import { useSelector } from "react-redux";
import { FaUserCircle, FaCog } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { BsHeart } from "react-icons/bs";
import { ConnectWallet, useAddress, useContract } from "@thirdweb-dev/react";
import DarkTheme from "./DarkTheme";
import { NavLink } from "reactstrap";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import etherContract from "../utils/web3Modal";
import SimpleDropdown from "./SimpleDropdown";
// import useAddress from '@thirdweb-dev/react';
import { useData } from "../context/data";
import { useAccount } from "wagmi";
import { ConnectButton } from '@rainbow-me/rainbowkit';

function Header() {

  const { resdata } = useData();

  const address = useAccount().address;
  const [dropmenu, setDropMenu] = useState(false);
  const [hidefilter, setHideFilter] = useState(false);
  const router = useRouter();
  // function to open the drop menu
  const opendropmenu = () => {
    setDropMenu(true);
  };

  // function to close the dropmenu
  const closedropmenu = () => {
    setDropMenu(false);
  };
  const [navOpen, setNavOpen] = useState(false);
  const [connectMenu, setConnectMenu] = useState(false);
  const toogle = () => {

    setConnectMenu((prev) => !prev);
  };
  const handleNav = () => {
    setNavOpen((prev) => !prev);
  };
  const user = useAccount().address;
  const walletAddress = useAccount().address;

  const [hasRole, setHasRole] = useState(false);
  const [hasRoleOperator, setHasRoleOperator] = useState(false);

  // useEffect(() => {
  //   const asyncFn = async () => {
  //     const accessmaterContarct = await etherContract(accessmasterAddress, Accessmater.abi)
  //     setHasRole(
  //       await accessmaterContarct.hasRole(await accessmaterContarct.FLOW_CREATOR_ROLE(), walletAddress)
  //     );
  //     setHasRoleOperator(
  //       await accessmaterContarct.hasRole(await accessmaterContarct.FLOW_CREATOR_ROLE(), walletAddress))
  //   }
  //   asyncFn();
  // }, [])

  return (
    <header className="border-b-[1px] dark:body-back body-back-light dark:border-[#bf2180] border-[#eff1f6] body-back">
      <div className="w-[90%] h-[81px] mx-auto flex items-center justify-between font-poppins">
        <div className="flex items-center">
          <FaBars
            onClick={handleNav}
            className="lg:hidden cursor-pointer md:text-2xl text-sm text-gray-500 dark:text-white md:mr-10 mr-2"
          />
          <Link href="/">
            <div className="pt-2 transition-all cursor-pointer">
              <span className="dark:block hidden">
                <Image alt="dark" src="/dark.svg" width="60" height="60" />
              </span>
              <span className="dark:hidden ">
                <Image alt="light" src="/light.svg" width="60" height="60" />
              </span>
            </div>
          </Link>
          <Link href="/">
            <div className="lg:text-3xl text-2xl lg:block md:block font-semibold cursor-pointer lg:pl-4 md:pl-4 pl-2 transition-all tracking-wide text-gray-800 dark:text-white">
              MYRIADFLOW
              {/* {resdata?.string} */}
            </div>
          </Link>

          <div className="lg:hidden right-4 absolute">
            <DarkTheme />

          </div>

        </div>

        <div>
          <div className="lg:flex hidden gap-x-4 text-lg font-medium text-black dark:text-[#0162ff] items-center">

            {/* <div className="relative w-full -ml-10">
              <input type="search" id="search-dropdown" className="rounded-l-lg block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Search..." required />
              <button type="submit" className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
              </button>
            </div> */}

            <Link className="text-gray-800 dark:text-white" href="/explore">
              <div
                className={router.pathname == "/explore" ? "active " : ""}
              >
                Explore
              </div>
            </Link>

            <Link className="text-gray-800 dark:text-white" href="/collections">
              <div
                className={router.pathname == "/collections" ? "active " : ""}
              >
                Collections
              </div>
            </Link>

            {walletAddress && address && hasRole ? (
              <Link className="text-gray-800 dark:text-white" href={hasRole ? "/assets" : "/authWallet"}>
                <div
                  className={router.pathname == "/assets" ? "active" : ""}
                >
                  Create
                </div>
              </Link>
            ) : (
              ""
            )}
            {walletAddress && address ? (
              <Link className="text-gray-800 dark:text-white" href="/dashboard">
                <div
                  className={router.pathname == "/dashboard" ? "active" : ""}
                >
                  Dashboard
                </div>
              </Link>
            ) : null}
            {walletAddress && address ? (
              <Link className="rewards-style" href="/drops">
                <div
                  className={router.pathname == "/drops" ? "active " : ""}
                >
                  Drops
                </div>
              </Link>
            ) : null}
            <Link href="">
              <div>
                <div className="relative">
                  <div className="flex items-center gap-x-3">

                    <DarkTheme />

                    {/* <div>
                      {walletAddress && address ? (
                        <SimpleDropdown menu={[{ route: 'profile', validRole: true, label: 'Profile' }, { route: 'wishlist', validRole: true, label: 'Wishlist' }, { route: 'manage', validRole: hasRoleOperator, label: 'Manage' }]} />
                      ) : (
                        <FaUserCircle className="text-3xl text-gray-500" />
                      )}
                    </div> */}
                    <div className={styles.connect}>
                    <ConnectButton chainStatus="icon"/>
                      {/* <ConnectWallet className="bg-gradient-to-r from-indigo-500 via-purple-500 to-gray-500 ..." /> */}
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <button
              onClick={() => {
                setHideFilter(!hidefilter);
              }}
              className="text-black dark:text-white">
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(-1, 0, 0, 1, 20, 0)">
                  <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </g>
              </svg>
            </button>
            {
              hidefilter && (
                <>
                  {/* Dropdown menu */}
                  <div id="dropdown" className="z-10 bg-white w-36 divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-800 top-24 right-16 absolute">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                      <li className="flex flex-row dark:hover:bg-gray-600 hover:bg-gray-100">
                        <FaUserCircle className="text-lg mt-2 ml-2" />
                        <Link href="/profile" className="block px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">My Profile</Link>
                      </li>
                    </ul>

                    <div className="py-2 ">
                      <div className="dark:hover:bg-gray-600 hover:bg-gray-100 flex flex-row">
                        <BsHeart className="text-lg mt-2 ml-2 dark:text-white dark:text-black" />
                        <Link href="/wishlist" className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Wishlist</Link>
                      </div>

                    </div>
                    <div className="py-2 ">
                      <div className="dark:hover:bg-gray-600 hover:bg-gray-100 flex flex-row">
                        <BsHeart className="text-lg mt-2 ml-2 dark:text-white dark:text-black" />
                        <Link href="/marketplace" className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Marketplaces</Link>
                      </div>

                    </div>
                    <div className="py-2">
                      <div className="dark:hover:bg-gray-600 hover:bg-gray-100 flex flex-row">
                        <FaCog className="text-lg mt-2 ml-2 dark:text-white dark:text-black" />
                        <Link href="/logout" className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Logout</Link>
                      </div>
                    </div>
                  </div>

                </>
              )
            }

          </div>
          {navOpen && (
            <div className="fixed top-0 right-0 w-72 h-screen lg:hidden font-bold shadow-lg pt-12 text-center bg-[#13131a] z-[1000] text-gray-500 dark:text-white">
              <Link href="/explore">
                <div className="block py-4 rounded-sm hover:bg-gray-300 transition duration-200 ease-in-out">
                  Explore
                </div>
              </Link>
              <Link href={hasRole ? "/assets" : "/authWallet"}>
                <div className="block py-4 rounded-sm hover:bg-gray-300 transition duration-200 ease-in-out">
                  Create
                </div>
              </Link>
              <Link href="/dashboard">
                <div className="block py-4 rounded-sm hover:bg-gray-300 transition duration-200 ease-in-out">
                  Dashboard
                </div>
              </Link>

              {walletAddress && address ? (
                <Link className="" href="/profile">
                  <div className="block py-4 rounded-sm hover:bg-gray-300 transition duration-200 ease-in-out">
                    My Profile
                  </div>
                </Link>
              ) : null}

              {walletAddress && address ? (
                <Link className="" href="/wishlist">
                  <div
                    className="block py-4 rounded-sm hover:bg-gray-300 transition duration-200 ease-in-out"
                  >
                    Wishlists
                  </div>
                </Link>
              ) : null}

              {walletAddress && address ? (
                <Link className="" href="/manage">
                  <div
                    className="block py-4 rounded-sm hover:bg-gray-300 transition duration-200 ease-in-out"
                  >
                    Manage
                  </div>
                </Link>
              ) : null}

              {walletAddress && address ? (
                <div className="mb-8 mt-2">
                  <Link className="rewards-style" href="/drops">
                    <div className="">
                      Drops
                    </div>


                  </Link>
                </div>

              ) : null}

              <div className="flex flex-col items-center">

                <div className={styles.connect}>
                <ConnectButton chainStatus="icon"/>
                  {/* <ConnectWallet className="bg-gradient-to-r from-indigo-500 via-purple-500 to-gray-500 ..." /> */}
                </div>








              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
