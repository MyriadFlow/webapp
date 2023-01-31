import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import StoreFront from "../artifacts/contracts/StoreFront.sol/StoreFront.json";
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { selectUser } from "../slices/userSlice";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { ConnectWallet } from "@thirdweb-dev/react";
import DarkTheme from "./DarkTheme";

import { NavLink } from "reactstrap";
import styles from "../styles/Home.module.css";
const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
const storeFrontAddress = process.env.NEXT_PUBLIC_STOREFRONT_ADDRESS;

function Header() {
  const [dropmenu, setDropMenu] = useState(false);

  const router = useRouter();

  // function to open the drop menu
  const opendropmenu = () => {
    setDropMenu(true);
  };

  // function to close the dropmenu
  const closedropmenu = () => {
    setDropMenu(false);
  };

  const user = useSelector(selectUser);
  const [navOpen, setNavOpen] = useState(false);
  const [connectMenu, setConnectMenu] = useState(false);
  const toogle = () => {
    setConnectMenu((prev) => !prev);
  };
  const handleNav = () => {
    setNavOpen((prev) => !prev);
  };
  async function connect() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      marketplaceAddress,
      Marketplace.abi,
      signer
    );
    const tokenContract = new ethers.Contract(
      storeFrontAddress,
      StoreFront.abi,
      provider
    );
    const data = await marketContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
        };
        return item;
      })
    );
  }

  const walletAddr = useSelector(selectUser);
  var wallet = walletAddr ? walletAddr[0] : "";

  const [hasRole, setHasRole] = useState(true);

  useEffect(() => {
    const asyncFn = async () => {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(
        storeFrontAddress,
        StoreFront.abi,
        signer
      );
      setHasRole(
        await contract.hasRole(await contract.STOREFRONT_CREATOR_ROLE(), wallet)
      );
    };
    asyncFn();
  }, [hasRole]);
  return (
    <header className="border-b-[1px] bg-white dark:bg-[#13131a] dark:border-[#282a32] border-[#eff1f6] gradient-blue">
      <div className="w-[90%] h-[81px] mx-auto flex items-center justify-between font-poppins">
        <div className="flex items-center">
          <FaBars
            onClick={handleNav}
            className="lg:hidden cursor-pointer text-2xl"
          />
           <Link href="/">
            <div className="pt-2 transition-all cursor-pointer">
              <span className="dark:block hidden">
                <img src="/dark.svg" width="60" height="60" />
              </span>
              <span className="dark:hidden ">
                <img src="/light.svg" width="60" height="60" />
              </span>
            </div>
          </Link>
          <Link href="/">
            <p className="text-3xl lg:block md:block font-semibold cursor-pointer pl-4 transition-all tracking-wide ">
              MarketPlace
            </p>
          </Link>
        </div>
      
       
        <div>
          <div className="lg:flex  hidden gap-x-6 text-lg tracking-wide font-medium text-black dark:text-[#0162ff] items-center">
            <Link href="">
             <NavLink>
            <div className=" flex justify-center mt-3">
          <div className=" mb-3">
            <div className="input-group relative flex flex-wrap items-stretch w-full">
              <input
                type="search"
                className=" form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon2"
              ></input>
              <button
                className="btn inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center"
                type="button"
                id="button-addon2"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="search"
                  className="w-4"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        </NavLink> 
            </Link>
            <Link  href="/explore">
              <NavLink
                className={router.pathname == "/explore" ? "active " : ""}
                style={{ cursor: "pointer" }}
              >
                Explore
              </NavLink>
            </Link>
            <Link className="rewards-style" href="/rewards">
              <NavLink
                className={router.pathname == "/rewards" ? "active " : ""}
                style={{ cursor: "pointer" }}
              >
                Rewards
              </NavLink>
            </Link>
            {user && hasRole ? (
              <Link  href="/assets">
                <NavLink
                  className={router.pathname == "/assets" ? "active" : ""}
                  style={{ cursor: "pointer" }}
                >
                  Create
                </NavLink>
              </Link>
            ) : (
              ""
            )}
            {!user ? (
              ""
            ) : (
              <Link href="/dashboard">
                <NavLink
                  className={router.pathname == "/dashboard" ? "active" : ""}
                  style={{ cursor: "pointer" }}
                >
                  Dashboard
                </NavLink>
              </Link>
              

            )}
            <Link href="">
              <NavLink>
            <div className="relative">
            <div className="flex items-center gap-x-3">
            <DarkTheme />

            <div onMouseEnter={opendropmenu}>
              {!user ? (
                <FaUserCircle className="text-3xl text-gray-500" />
              ) : (
                <Link href="/profile">
                  <div className="h-8 w-8 rounded-full connect-profile ring-offset-2 ring-2 ring-blue-400 cursor-pointer"></div>
                </Link>
              )}
            </div>
            <div className={styles.connect}>
              <ConnectWallet className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ..." />
            </div>
          </div>
        </div>
        </NavLink>
            </Link>
          </div>
          {navOpen && (
            <div className="fixed top-0 right-0 w-72 h-screen lg:hidden font-bold shadow-lg pt-12 text-center bg-[#13131a] z-[1000] text-white">
              <Link href="/explore">
                <div className="block py-4 rounded-sm hover:bg-gray-300 transition duration-200 ease-in-out">
                  Explore
                </div>
              </Link>
              <Link href="/assets">
                <div className="block py-4 rounded-sm hover:bg-gray-300 transition duration-200 ease-in-out">
                  Create
                </div>
              </Link>
              <Link href="/dashboard">
                <div className="block py-4 rounded-sm hover:bg-gray-300 transition duration-200 ease-in-out">
                  Dashboard
                </div>
              </Link>
              <Link href="">
              <div className="flex justify-center mt-3">
             <div className="mb-3">
            <div className="input-group relative flex flex-wrap items-stretch w-full">
              <input
                type="search"
                className="form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="button-addon2"
              ></input>
              <button
                className="btn inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center"
                type="button"
                id="button-addon2"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="search"
                  className="w-4"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
              </Link>
              <Link href="">
              <div className="relative">
          <div className="flex items-center gap-x-3">
            <DarkTheme />

            <div onMouseEnter={opendropmenu}>
              {!user ? (
                <FaUserCircle className="text-3xl text-gray-500" />
              ) : (
                <Link href="/profile">
                  <div className="h-8 w-8 rounded-full connect-profile ring-offset-2 ring-2 ring-blue-400 cursor-pointer"></div>
                </Link>
              )}
            </div>
            <div className={styles.connect}>
              <ConnectWallet className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ..." />
            </div>
          </div>
        </div>
              </Link>
            </div>
          )}
        </div>

       
      </div>
    </header>
  );
}

export default Header;
