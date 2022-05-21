import { FaUserCircle } from "react-icons/fa"
import { AiOutlineCloseCircle } from "react-icons/ai"
import Link from "next/link";
import Image from "next/image";
import { useState , useEffect} from "react";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../slices/userSlice"
import Web3Modal from 'web3modal'
import { open } from "../slices/modelSlice"
import { setbalance } from "../slices/balanceSlice"
import { selectUser } from "../slices/userSlice"
import { selectBalance } from "../slices/balanceSlice"
import { FaEthereum } from "react-icons/fa"
import { FiLogOut } from "react-icons/fi"
import { useTheme } from "next-themes";
import Creatify from '../artifacts/contracts/Creatify.sol/Creatify.json'
import axios from "axios";
import { convertUtf8ToHex } from "@walletconnect/utils";

const Web3 = require("web3");
const BASE_URL=process.env.NEXT_PUBLIC_BASE_URL;
const creatifyAddress = process.env.NEXT_PUBLIC_CREATIFY_ADDRESS;

function Connectmenu({ toogle,dark,setDark }) {

    const walletAddr = useSelector(selectUser);
    var wallet = walletAddr?walletAddr[0]:'';

    const { systemTheme, theme, setTheme } = useTheme()


    const renderThemeChanger = () => {
        const currentTheme = theme === 'system' ? systemTheme : theme;
        if (currentTheme === 'dark') {

            return (
                <svg
                    onClick={() => setTheme('light')}
                    xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 dark:text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
            )
        }
        else {

            return (
                <svg
                    onClick={() => setTheme('dark')}
                    xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            )
        }
    }


    const dispatch = useDispatch();


    const user = useSelector(selectUser);
    let userbalance = useSelector(selectBalance);

    const [errorMessage, SeterrorMessage] = useState(null);
    const [defaultAccount, SetdefaultAccount] = useState();

    const [UserBalance, SetUserBalance] = useState();

    const [hasRole, setHasRole] = useState(false);

    const connectweb = async()=>{
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
    
        /* next, create the item */
        let contract = new ethers.Contract(creatifyAddress, Creatify.abi, signer);
         setHasRole(  await contract.hasRole( await contract.CREATIFY_CREATOR_ROLE() , wallet))
         const roleid = await contract.CREATIFY_CREATOR_ROLE();
         localStorage.setItem("platform_roleid",roleid);
         console.log(localStorage.getItem('platform_roleid'));
    }

//   useEffect(() => {   
// connectweb();
//   }, []);


    const connectwallethandler = () => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(result => {
                    accountChangedHandler(result[0]);

                })

        } else {
            SeterrorMessage('Install Metamask')
        }
    }

    const getRole = async () => {

        const token = localStorage.getItem('platform_token');
        const role_id = localStorage.getItem('platform_roleid');

        const config1 = {
            url:`${BASE_URL}/api/v1.0/roleId/${role_id}`,
            method:"GET",
            headers:{
                "Authorization":`Bearer ${token}`
            },
       };
       let roledata;
        try{
            roledata = await axios(config1);
            console.log(roledata);
        }catch(e){
            console.log(e);
        }

        let web3 = new Web3(Web3.givenProvider);
        let completemsg = roledata.data.payload.eula+roledata.data.payload.flowId;
        // console.log(completemsg);
        const hexMsg = convertUtf8ToHex(completemsg);
        // console.log(hexMsg);
        const result = await web3.eth.personal.sign(hexMsg,wallet);
        // console.log(result);

        var signroledata = JSON.stringify({
            flowId : roledata.data.payload.flowId,
            signature:result,
        })

        const config = {
             url:`${BASE_URL}/api/v1.0/claimrole`,
             method:"POST",
             headers:{
                 "Content-Type":"application/json",
                 "Authorization":`Bearer ${token}`
             },
             data:signroledata,
        };

        try{
            const response = await axios(config);
            // console.log(response);
            const msg = await response?.data?.message;
            console.log(msg);
            
            return true;
        }catch(e){
            console.log(e);
            return false;
        }
    }

    const authorize = async () => {
        const { data } = await axios.get(
            `${BASE_URL}/api/v1.0/flowid?walletAddress=${wallet}`
        );
        // console.log(data);

        let web3 = new Web3(Web3.givenProvider);
        let completemsg = data.payload.eula+data.payload.flowId;
        // console.log(completemsg);
        const hexMsg = convertUtf8ToHex(completemsg);
        // console.log(hexMsg);
        const result = await web3.eth.personal.sign(hexMsg,wallet);
        // console.log(result);

        var signdata = JSON.stringify({
            flowId : data.payload.flowId,
            signature:result,
        })

        const config = {
             url:`${BASE_URL}/api/v1.0/authenticate`,
             method:"POST",
             headers:{
                 "Content-Type":"application/json",
                //  "Token":`Bearer ${token}`
             },
             data:signdata,
        };
        try{
            const response = await axios(config);
            const token = await response?.data?.payload?.token;
            localStorage.setItem("platform_token",token);
            getRole();
            return true;
        }catch(e){
            console.log(e);
            return false;
        }
    };



    const accountChangedHandler = (newAccount) => {
        SetdefaultAccount(newAccount);

        dispatch(login([
            ethereum.selectedAddress,

        ]))
        getUserBalance(newAccount.toString());

    }
    const getUserBalance = (address) => {
        window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] })
            .then(balance => {
                SetUserBalance(ethers.utils.formatEther(balance));
                dispatch(setbalance([
                    ethers.utils.formatEther(balance),
                ]))
            })
    }


    window.ethereum.on('accountChanged', accountChangedHandler);

    // fuction to open the model
    const openmodel = () => {
        dispatch(open());
    }


    return (
      <div
        className={
          !user
          ? "absolute z-30 top-14 bg-white right-[50%] translate-x-[50%] dark:bg-[#131c31] p-4 rounded-[10px] mydrop"
          : "absolute z-30 top-14 bg-white right-[50%] translate-x-[50%] dark:bg-[#131c31] p-4 rounded-[10px] mydrop"
        }
      >
        {/* <div>
                <AiOutlineCloseCircle onClick={toogle} className="h-10 w-10 cursor-pointer  text-gray-500 p-1" />
            </div> */}
        <div className="border-b-[1px] border-[#e5e7eb] dark:border-[#282a32] py-2">
          <div className="flex gap-x-2 justify-between items-center hover:bg-[#f5f4fd] dark:hover:bg-[#1c2339] px-2 py-1 hover:rounded-xl">
            {!user ? (
              <FaUserCircle className="h-10 w-10 text-gray-500" />
            ) : (
              <div className="h-10 w-10 rounded-full connect-profile cursor-pointer"></div>
            )}
            <Link href="/profile">
              <a className="" href="/profile">
                MyAccount{" "}
              </a>
            </Link>
          </div>
        </div>
        {/* <div className="flex justify-center mt-2" >
                <p className={user ? "text-sm text-gray-700 border-2 border-dashed p-2 rounded-lg border-black font-semibold dark:text-gray-300 dark:border-gray-400" : ""}>{user}</p>
            </div> */}
        <div className="border-b-[1px] border-[#e5e7eb] dark:border-[#282a32] py-2">
          {userbalance ? (
            <div className="flex hover:bg-[#f5f4fd] dark:hover:bg-[#1c2339] px-4 py-3 hover:rounded-xl">
              <p className="text-md font-semibold text-gray-600  dark:text-gray-400 flex items-center">
                Balance:
                <FaEthereum className="h-4 w-4 text-gray-400 flex " />
                <span className="text-gray-600 dark:text-gray-400">
                  {userbalance.toString().substr(0, 12)}
                </span>
              </p>
            </div>
          ) : (
            ""
          )}
        </div>

        <div>
          <div className="border-b-[1px] border-[#e5e7eb] dark:border-[#282a32] py-2">
            <div className="hover:bg-[#f5f4fd] dark:hover:bg-[#1c2339] px-4 py-3 hover:rounded-xl">
              <a onClick={connectwallethandler} className="">
                {!user ? "Connect" : "Connected"}
              </a>
            </div>
          </div>

          {/* {
                    !hasRole && user && 
                    <div className="flex justify-center">
                        <button
                            onClick={authorize}
                            className="bg-blue-800 uppercase shadow-md transition duration-300  
                            ease-in text-white font-bold hover:bg-white hover:text-blue-800 px-6 rounded py-2 mt-2">Get creator role</button>
                    </div>
                } */}
          <div className="border-b-[1px] border-[#e5e7eb] dark:border-[#282a32] py-2">
            <div
              className="flex gap-x-2 justify-center items-center p-1 bg-[#f5f4fd] dark:bg-[#00071d] rounded relative"
              onClick={() => {
                setDark(!dark);
                dark ? setTheme("light") : setTheme("dark");
              }}
            >
              {/* <p className="text-gray-800 font-bold dark:text-blue-500">
              {theme === "dark" ? "LightMode" : "DarkMode"}
            </p> */}
              {/* <div className="border p-1 rounded-full shadow-sm cursor-pointer">
              {renderThemeChanger()}
            </div> */}
              <div
                id="button box"
                className={`absolute w-[calc(50%-4px)] h-[calc(100%-8px)] rounded left-[4px] top-[50%] translate-y-[-50%] bg-[#fff] dark:bg-[#131c31] transition ease-in-out delay-150 duration-300 ${
                  dark ? "translate-x-[100%]" : ""
                }`}
              >
                {/* <div className="">
                {renderThemeChanger()}
              </div> */}
              </div>
              <div className="w-1/2 flex items-center justify-center py-[10px] px-[8px] text-center z-10 light">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="sidebar-listIcon"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                <span>Light</span>
              </div>
              <div className="w-1/2 flex items-center justify-center py-[10px] px-[8px] text-center z-10 dark">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="sidebar-listIcon"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
                <span>Dark</span>
              </div>
            </div>
          </div>
          {user ? (
            <div
              className="flex gap-x-2 items-center hover:bg-[#f5f4fd] dark:hover:bg-[#1c2339] px-2 py-1 hover:rounded-xl"
              onClick={openmodel}
            >
              <FiLogOut
                // onClick={logoutmetamask}

                className="h-10 w-10 rounded-full hover:text-white  cursor-pointer p-2"
              />
              <p>Log out</p>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
}

export default Connectmenu
