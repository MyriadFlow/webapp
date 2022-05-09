import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Web3Modal from "web3modal"
import { ethers } from 'ethers'
// import {
//   marketplaceAddress, creatifyAddress
// } from '../config'
import Creatify from '../artifacts/contracts/Creatify.sol/Creatify.json'
import Marketplace from '../artifacts/contracts/Marketplace.sol/Marketplace.json'
import Image from 'next/image';
import { MdOutlineAccountBalanceWallet } from "react-icons/md"
import Connectmenu from "../Components/Connectmenu"
import Dropdownmenu from "../Components/Dropdownmenu"
import { selectUser } from "../slices/userSlice"
import { useSelector } from "react-redux"
import { FaUserCircle } from "react-icons/fa"
import { IoPersonSharp } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import {NavLink} from "reactstrap";

const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
const creatifyAddress = process.env.NEXT_PUBLIC_CREATIFY_ADDRESS;

function Header() {
  
  const router = useRouter();

  // function to open the drop menu 
  const opendropmenu = () => {
    setdropmenu(true)
  }

  // function to close the dropmenu 
  const closedropmenu = () => {
    setdropmenu(false)
  }

  const user = useSelector(selectUser);
  const [navopen, Setnavopen] = useState(false)
  const [darkmode, Setdarkmode] = useState(false);
  const [connectmenu, Setconnectmenu] = useState(false);
  const [dropmenu, setdropmenu] = useState(false);
  const [dark, setDark] = useState(false);
  const toogle = () => {
    Setconnectmenu(!connectmenu)
  }
  const nav = () => {
    Setnavopen(!navopen)
  }
  async function connect() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(marketplaceAddress, Marketplace.abi, signer)
    const tokenContract = new ethers.Contract(creatifyAddress, Creatify.abi, provider)
    const data = await marketContract.fetchMyNFTs()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
      }
      return item
    }))
  }

  const walletAddr = useSelector(selectUser);
  var wallet = walletAddr ? walletAddr[0] : "";
  
  const [hasRole, setHasRole] = useState(false);

  useEffect(async() => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(creatifyAddress, Creatify.abi, signer);
     setHasRole(  await contract.hasRole( await contract.CREATIFY_CREATOR_ROLE() , wallet))
     console.log(hasRole);
  }, [hasRole]);



  return (

    <header className="border-b-[1px] bg-white dark:bg-[#13131a] dark:border-[#282a32] border-[#eff1f6]">
      <div className="w-[90%] max-w-[1320px] h-[81px] mx-auto flex items-center justify-between font-poppins">
      {/* left */}
      <div className="flex items-center">
        <FaBars
          onClick={nav}
          className="lg:hidden cursor-pointer text-2xl"
        />
        <Link href="/">
        <div className="pt-2 transition-all cursor-pointer">
          <span className="dark:block hidden">
          <Image src="/dark.svg"
      width="60"
      height="60"/>
      </span>
      <span className="dark:hidden ">
      <Image src="/light.svg"
      width="60"
      height="60"/>
      </span>
      </div>
          
        </Link>
        <Link href="/">
        <p className="text-3xl lg:block md:block hidden font-semibold cursor-pointer pl-4 transition-all tracking-wide">
            MarketPlace
          </p>
          </Link>
      </div>


      {/* center */}

      {/* <div className=" hidden  flex-shrink items-center p-2 bg-gray-100 ml-2 rounded-md ">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6  text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input  className="flex-grow bg-gray-100 ml-2  outline-none " type="text" placeholder="Search the marketplace" />

      </div> */}


      {/* right */}
      <div>
        <div className="lg:flex items-stretch hidden gap-x-6 text-lg tracking-wide font-medium text-black dark:text-[#0162ff]">
          <Link href="/home">
            <NavLink
              className={router.pathname == "/home" ? "active " : ""}
              style={{ cursor: "pointer" }}
            >
              Explore
            </NavLink>
          </Link>

          {user && hasRole ? (
              <Link href="/create-artifacts">
              <NavLink
                className={
                  router.pathname == "/create-artifacts" ? "active" : ""
                }
                style={{ cursor: "pointer" }}
              >
                Create
              </NavLink>
            </Link>
            ) : (
              ''
            )}
          
          {/* {!user ? (
              ''
            ) : (
          <Link href="/my-artifacts">
            <NavLink
              className={router.pathname == "/my-artifacts" ? "active " : ""}
              style={{ cursor: "pointer" }}
            >
              My Assets
            </NavLink>
          </Link>
            )} */}

{!user ? (
              ''
            ) : (
          <Link href="/creator-dashboard">
            <NavLink
              className={
                router.pathname == "/creater-dashboard" ? "active" : ""
              }
              style={{ cursor: "pointer" }}
            >
              Dashboard
            </NavLink>
          </Link>
            )}
        </div>

         {/* SIDENAV  */}
         {navopen && (
            <div className="absolute top-0 right-0 w-48 h-screen lg:hidden font-bold shadow-lg pt-12 text-center">
              <Link href="/home">
                <a className="block py-4 rounded-sm hover:bg-gray-300 transition duration-200 ease-in-out">
                  Home
                </a>
              </Link>
              <Link href="/create-artifacts">
                <a className="block py-4 rounded-sm hover:bg-gray-300 transition duration-200 ease-in-out">
                  Sell Asset
                </a>
              </Link>
              {/* <Link href="/my-artifacts">
                <a className="block py-4 rounded-sm hover:bg-gray-300 transition duration-200 ease-in-out">
                  My Assets
                </a>
              </Link> */}
              <Link href="/creator-dashboard">
                <a className="block py-4 rounded-sm hover:bg-gray-300 transition duration-200 ease-in-out">
                  Dashboard
                </a>
              </Link>
            </div>
          )}
        </div>
        <div className="relative">
          <div className="flex items-center gap-x-3">
            <div onMouseEnter={opendropmenu}>
              {!user ? (
                <FaUserCircle className="text-3xl text-gray-500" />
              ) : (
                <Link href="/profile">
                  <div className="h-8 w-8 rounded-full connect-profile ring-offset-2 ring-2 ring-blue-400 cursor-pointer"></div>
                </Link>
              )}
            </div>
            <MdOutlineAccountBalanceWallet
              className="text-3xl cursor-pointer"
              onClick={() => Setconnectmenu(!connectmenu)}
            />
          </div>

        {connectmenu && <Connectmenu toogle={toogle} dark={dark} setDark={setDark} />}
      </div>
      </div>
    </header>
  );


}

export default Header;