import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import StoreFront from "../artifacts/contracts/StoreFront.sol/StoreFront.json";
import { selectUser } from "../slices/userSlice";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { ConnectWallet } from "@thirdweb-dev/react";
import DarkTheme from "./DarkTheme";
import { NavLink } from "reactstrap";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import etherContract from "../utils/web3Modal";
import SimpleDropdown from "./SimpleDropdown";
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
  const [navOpen, setNavOpen] = useState(false);
  const [connectMenu, setConnectMenu] = useState(false);
  const toogle = () => {
    setConnectMenu((prev) => !prev);
  };
  const handleNav = () => {
    setNavOpen((prev) => !prev);
  };
  const user = useSelector(selectUser);
  const walletAddress = user ? user[0] : "";

  const [hasRole, setHasRole] = useState(false);
  const [hasRoleOperator, setHasRoleOperator] = useState(false);

  useEffect(() => {
    const asyncFn = async () => {
    const storeFrontContract = await etherContract(storeFrontAddress, StoreFront.abi)
    setHasRole(
      await storeFrontContract.hasRole(await storeFrontContract.STOREFRONT_CREATOR_ROLE(), walletAddress)
    );
    setHasRoleOperator(
      await storeFrontContract.hasRole( await storeFrontContract.STOREFRONT_OPERATOR_ROLE(), walletAddress))
    }
    asyncFn();
  }, [])
  
  return (
    <header className="border-b-[1px] bg-white dark:bg-[#13131a] dark:border-[#bf2180] border-[#eff1f6] body-back">
      <div className="w-[90%] h-[81px] mx-auto flex items-center justify-between font-poppins">
        <div className="flex items-center">
          <FaBars
            onClick={handleNav}
            className="lg:hidden cursor-pointer text-2xl text-gray-500 text-gray-500 dark:text-white"
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
            <div className="text-3xl lg:block md:block font-semibold cursor-pointer pl-4 transition-all tracking-wide text-gray-500 dark:text-white">
              MarketPlace
            </div>
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
                        className="btn inline-block px-6 py-2.5 bg-blue-600 text-gray-500 dark:text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center"
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
            <Link className="text-gray-500 dark:text-white" href="/explore">
              <NavLink
                className={router.pathname == "/explore" ? "active " : ""}
                style={{ cursor: "pointer" }}
              >
                Explore
              </NavLink>
            </Link>

            { walletAddress && hasRole ? (
              <Link className="text-gray-500 dark:text-white" href={hasRole? "/assets":"/authWallet"}>
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
            { walletAddress ? (
              <Link className="text-gray-500 dark:text-white" href="/dashboard">
                <NavLink
                  className={router.pathname == "/dashboard" ? "active" : ""}
                  style={{ cursor: "pointer" }}
                >
                  Dashboard
                </NavLink>
              </Link>
            ) : null}
            { walletAddress ? (
              <Link className="rewards-style" href="/drops">
                <NavLink
                  className={router.pathname == "/drops" ? "active " : ""}
                  style={{ cursor: "pointer" }}
                >
                  Drops
                </NavLink>
              </Link>
            ) : null}
            <Link href="">
              <NavLink>
                <div className="relative">
                  <div className="flex items-center gap-x-3">
                    <DarkTheme />

                    <div>
                      { walletAddress ? (
                         <SimpleDropdown menu={[{route:'profile', validRole: true, label:'Profile'}, {route:'wishlist', validRole: true, label:'Wishlist'},{route:'manage', validRole: hasRoleOperator, label:'Manage'}]}/>
                      ) : (
                        <FaUserCircle className="text-3xl text-gray-500" />
                      )}
                    </div>
                    <div className={styles.connect}>
                      <ConnectWallet className="bg-gradient-to-r from-indigo-500 via-purple-500 to-gray-500 ..." />
                    </div>
                  </div>
                </div>
              </NavLink>
            </Link>
          </div>
          {navOpen && (
            <div className="fixed top-0 right-0 w-72 h-screen lg:hidden font-bold shadow-lg pt-12 text-center bg-[#13131a] z-[1000] text-gray-500 dark:text-white">
              <Link href="/explore">
                <div className="block py-4 rounded-sm hover:bg-gray-300 transition duration-200 ease-in-out">
                  Explore
                </div>
              </Link>
              <Link href={hasRole? "/assets":"/authWallet"}>
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
                        className="btn inline-block px-6 py-2.5 bg-blue-600 text-gray-500 dark:text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center"
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
                      <ConnectWallet className="bg-gradient-to-r from-indigo-500 via-purple-500 to-gray-500 ..." />
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
