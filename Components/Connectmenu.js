// import { FaUserCircle } from "react-icons/fa";
// import { AiOutlineCloseCircle } from "react-icons/ai";
// import Link from "next/link";
// import Image from "next/image";
// import { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import { useDispatch, useSelector } from "react-redux";
// import { login } from "../slices/userSlice";
// import Web3Modal from "web3modal";
// import { open } from "../slices/modelSlice";
// import { setbalance } from "../slices/balanceSlice";
// import { selectUser } from "../slices/userSlice";
// import { selectBalance } from "../slices/balanceSlice";
// import { FaEthereum } from "react-icons/fa";
// import { FiLogOut } from "react-icons/fi";
// import { useTheme } from "next-themes";
// import StoreFront from "../artifacts/contracts/StoreFront.sol/StoreFront.json";
// import axios from "axios";
// import { convertUtf8ToHex } from "@walletconnect/utils";

// // const Web3 = require("web3");
// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
// const storeFrontAddress = process.env.NEXT_PUBLIC_STOREFRONT_ADDRESS;
// //use to show metamask account connect onclick card
// function Connectmenu({ toogle, dark, setDark }) {
//   const walletAddr = useSelector(selectUser);
//   var wallet = walletAddr ? walletAddr[0] : "";

//   const { systemTheme, theme, setTheme } = useTheme();
//   const dispatch = useDispatch();

//   const user = useSelector(selectUser);
//   let userbalance = useSelector(selectBalance);

//   const [errorMessage, SeterrorMessage] = useState(null);
//   const [defaultAccount, SetdefaultAccount] = useState();

//   const [UserBalance, SetUserBalance] = useState();

//   const [hasRole, setHasRole] = useState(false);

//   const connectweb = async () => {
//     const web3Modal = new Web3Modal();
//     const connection = await web3Modal.connect();
//     const provider = new ethers.providers.Web3Provider(connection);
//     const signer = provider.getSigner();

//     /* next, create the item */
//     let contract = new ethers.Contract(storeFrontAddress, StoreFront.abi, signer);
//     setHasRole(
//       await contract.hasRole(await contract.STOREFRONT_CREATOR_ROLE(), wallet)
//     );
//     const roleid = await contract.STOREFRONT_CREATOR_ROLE();
//     localStorage.setItem("platform_roleid", roleid);
//   };

//   const connectwallethandler = () => {
//     if (window.ethereum) {
//       window.ethereum
//         .request({ method: "eth_requestAccounts" })
//         .then((result) => {
//           accountChangedHandler(result[0]);
//         });
//     } else {
//       SeterrorMessage("Install Metamask");
//     }
//   };

//   const getRole = async () => {
//     const token = localStorage.getItem("platform_token");
//     const role_id = localStorage.getItem("platform_roleid");

//     const config1 = {
//       url: `${BASE_URL}/api/v1.0/roleId/${role_id}`,
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };
//     let roledata;
//     try {
//       roledata = await axios(config1);
//     } catch (e) {
//       console.log(e);
//     }

//     let web3 = new Web3(Web3.givenProvider);
//     let completemsg = roledata.data.payload.eula + roledata.data.payload.flowId;
//     const hexMsg = convertUtf8ToHex(completemsg);
//     const result = await web3.eth.personal.sign(hexMsg, wallet);

//     var signroledata = JSON.stringify({
//       flowId: roledata.data.payload.flowId,
//       signature: result,
//     });

//     const config = {
//       url: `${BASE_URL}/api/v1.0/claimrole`,
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       data: signroledata,
//     };

//     try {
//       const response = await axios(config);
//       const msg = await response?.data?.message;

//       return true;
//     } catch (e) {
//       console.log(e);
//       return false;
//     }
//   };

//   const accountChangedHandler = (newAccount) => {
//     SetdefaultAccount(newAccount);
//     dispatch(login([ethereum.selectedAddress]));
//     getUserBalance(newAccount.toString());
//   };
//   const getUserBalance = (address) => {
//     window.ethereum
//       .request({ method: "eth_getBalance", params: [address, "latest"] })
//       .then((balance) => {
//         SetUserBalance(ethers.utils.formatEther(balance));
//         dispatch(setbalance([ethers.utils.formatEther(balance)]));
//       });
//   };

//   window.ethereum.on("accountChanged", accountChangedHandler);

//   // fuction to open the model
//   const openmodel = () => {
//     dispatch(open());
//   };

//   return (
//     <div
//       className={
//         !user
//           ? "absolute z-30 top-14 bg-white right-[50%] translate-x-[50%] dark:bg-[#131c31] p-4 rounded-[10px] mydrop"
//           : "absolute z-30 top-14 bg-white right-[50%] translate-x-[50%] dark:bg-[#131c31] p-4 rounded-[10px] mydrop"
//       }
//     >
//       <div className="border-b-[1px] border-[#e5e7eb] dark:border-[#282a32] py-2">
//         <div className="flex gap-x-2 justify-between items-center hover:bg-[#f5f4fd] dark:hover:bg-[#1c2339] px-2 py-1 hover:rounded-xl">
//           {!user ? (
//             <FaUserCircle className="h-10 w-10 text-gray-500" />
//           ) : (
//             <div className="h-10 w-10 rounded-full connect-profile cursor-pointer"></div>
//           )}
//           <Link href="/profile">
//           MyAccount
//           </Link>
//         </div>
//       </div>
//       <div className="border-b-[1px] border-[#e5e7eb] dark:border-[#282a32] py-2">
//         {userbalance ? (
//           <div className="flex hover:bg-[#f5f4fd] dark:hover:bg-[#1c2339] px-4 py-3 hover:rounded-xl cursor-pointer">
//             <div className="text-md font-semibold text-gray-600  dark:text-gray-400 flex items-center">
//               Balance:
//               <FaEthereum className="h-4 w-4 text-gray-400 flex " />
//               <span className="text-gray-600 dark:text-gray-400">
//                 {userbalance.toString().substr(0, 12)}
//               </span>
//             </div>
//           </div>
//         ) : (
//           ""
//         )}
//       </div>

//       <div>
//         <div className="border-b-[1px] border-[#e5e7eb] dark:border-[#282a32] py-2 cursor-pointer">
//           <div className="hover:bg-[#f5f4fd] dark:hover:bg-[#1c2339] px-4 py-3 hover:rounded-xl">
//             <Link onClick={connectwallethandler}>
//               {!user ? "Connect" : "Connected"}
//             </Link>
//           </div>
//         </div>

       
//         <div className="border-b-[1px] border-[#e5e7eb] dark:border-[#282a32] py-2">
//           <div
//             className="flex gap-x-2 justify-center items-center p-1 bg-[#f5f4fd] dark:bg-[#00071d] rounded relative"
//             onClick={() => {
//               setDark(!dark);
//               dark ? setTheme("light") : setTheme("dark");
//             }}
//           >
          
//             <div
//               id="button box"
//               className={`absolute w-[calc(50%-4px)] h-[calc(100%-8px)] rounded left-[4px] top-[50%] translate-y-[-50%] bg-[#fff] dark:bg-[#131c31] transition ease-in-out delay-150 duration-300 ${
//                 dark ? "translate-x-[100%]" : ""
//               }`}
//             >
            
//             </div>
//             <div className="w-1/2 flex items-center justify-center py-[10px] px-[8px] text-center z-10 light cursor-pointer">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 stroke-width="2"
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//                 className="sidebar-listIcon"
//               >
//                 <circle cx="12" cy="12" r="5" />
//                 <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
//               </svg>
//               <span>Light</span>
//             </div>
//             <div className="w-1/2 flex items-center justify-center py-[10px] px-[8px] text-center z-10 dark cursor-pointer">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 stroke-width="2"
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//                 className="sidebar-listIcon"
//               >
//                 <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
//               </svg>
//               <span>Dark</span>
//             </div>
//           </div>
//         </div>        
//         {user ? (
//           <div
//             className="flex gap-x-2 items-center hover:bg-[#f5f4fd] dark:hover:bg-[#1c2339] px-2 py-1 hover:rounded-xl cursor-pointer"
//             onClick={openmodel}
//           >
//             <FiLogOut

//               className="h-10 w-10 rounded-full hover:text-white  cursor-pointer p-2 cursor-pointer"
//             />
//             <div>Log out</div>
//           </div>
//         ) : (
//           ""
//         )}
//       </div>
//     </div>
//   );
// }

// export default Connectmenu;

import { ConnectButton } from '@rainbow-me/rainbowkit';
export default function Connectmenu({ toogle, dark, setDark }){
  return <ConnectButton />;
};
