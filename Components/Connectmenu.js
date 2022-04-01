import { FaUserCircle } from "react-icons/fa"
import { AiOutlineCloseCircle } from "react-icons/ai"
import Link from "next/link";
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
// import { creatorRole } from "../pages/api/creatorRole";
import Creatify from '../artifacts/contracts/Creatify.sol/Creatify.json'
import axios from "axios";
import { convertUtf8ToHex } from "@walletconnect/utils";

const Web3 = require("web3");
const BASE_URL=process.env.NEXT_PUBLIC_BASE_URL;
const creatifyAddress = process.env.NEXT_PUBLIC_CREATIFY_ADDRESS;

function Connectmenu({ toogle }) {

    const walletAddr = useSelector(selectUser);
    // console.log(walletAddr);
    // console.log(walletAddr?walletAddr[0]:"");
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
    const userbalance = useSelector(selectBalance);

    const [errorMessage, SeterrorMessage] = useState(null);
    const [defaultAccount, SetdefaultAccount] = useState();

    const [UserBalance, SetUserBalance] = useState();

    const [hasRole, setHasRole] = useState(false);

  useEffect(async() => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(creatifyAddress, Creatify.abi, signer);
     setHasRole(  await contract.hasRole( await contract.CREATIFY_CREATOR_ROLE() , wallet))

    
  }, []);







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
        // const CREATIFY_CREATOR_ROLE = await creatify.CREATIFY_CREATOR_ROLE();
        // console.log(CREATIFY_CREATOR_ROLE);
        // const { roledata } = await axios.get(
        //     `https://marketplace-engine.lazarus.network/api/v1.0/roleId/0x01b9906c77d0f3e5e952265ffbd74a08f1013f607e72528c5c1fbaf8f36e3634`
        // );
        // console.log(data);

        const config1 = {
            url:`${BASE_URL}/api/v1.0/roleId/0x01b9906c77d0f3e5e952265ffbd74a08f1013f607e72528c5c1fbaf8f36e3634`,
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
            // console.log(response);
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
        <div className={!user ? "fixed w-full p-2 md:w-72 lg:w-80 z-30 shadow-lg top-0 h-screen bg-white right-0 dark:bg-gray-900" : "fixed w-full p-2 md:w-auto lg:w-auto z-30  top-0 h-screen bg-white right-0 dark:bg-gray-900"}>
            <div>
                <AiOutlineCloseCircle onClick={toogle} className="h-10 w-10 cursor-pointer  text-gray-500 p-1" />
            </div>




            <div className="flex justify-center lg:mt-10 mt-4">
                {
                    !user ? <FaUserCircle className="h-12 w-12 text-gray-500" /> :
                        <div className="h-12 w-12 rounded-full connect-profile ring-offset-2 ring-2 ring-blue-400 animate-bounce cursor-pointer"></div>
                }


            </div>

            <div className="flex justify-center mt-2 ">
                <Link href="/profile">
                    <p className="font-bold text-lg hover:underline">
                        <a className="text-gray-800  dark:text-gray-400 dark:hover:text-gray-300 " href="/profile">My Account </a ></p>
                </Link>

            </div>

            <div className="flex justify-center mt-2" >
                <p className={user ? "text-sm text-gray-700 border-2 border-dashed p-2 rounded-lg border-black font-semibold dark:text-gray-300 dark:border-gray-400" : ""}>{user}</p>


            </div>
            <div className="flex justify-center pt-1 ">
                <p className="text-md font-semibold text-gray-600  dark:text-gray-400 flex items-center"> Balance:
                    <FaEthereum className="h-4 w-4 text-gray-400 flex " /> <span className="text-gray-600 dark:text-gray-400">{userbalance}</span></p></div>

            {user ?
                <div className="flex justify-center">
                    <FiLogOut
                        // onClick={logoutmetamask}
                        onClick={openmodel}

                        className="h-10 w-10 rounded-full hover:text-white  cursor-pointer p-2 hover:bg-gray-700 " />

                </div> : ""}

            <div className="flex items-center justify-center mt-5">
                <img className="w-60 align-middle" src="/account.svg"></img>
            </div>
            <div className="mt-6  flex justify-center  flex-col">

                <div className="flex justify-center">
                    <button
                        onClick={connectwallethandler}
                        className="bg-blue-500 dark:bg-purple-700 uppercase shadow-md outline-2 outline-offset-4 outline-blue-500 dark:outline-white outline transition duration-300  
                        ease-in text-white font-bold hover:bg-white hover:text-blue-500  dark:hover:bg-white dark:hover:text-purple-700 px-8 py-3 mb-2">{!user ? "Connect" : "Connected"}</button>
                </div>

                {
                    !hasRole && user && 
                    <div className="flex justify-center">
                        <button
                            onClick={authorize}
                            className="bg-blue-800 uppercase shadow-md transition duration-300  
                            ease-in text-white font-bold hover:bg-white hover:text-blue-800 px-6 rounded py-2 mt-2">Get creator role</button>
                    </div>
                }

                <div className="flex justify-center items-center lg:mt-10 mt-4 space-x-2">
                    <p className="text-gray-800 font-bold dark:text-blue-500">{theme === 'dark' ? 'LightMode' : 'DarkMode'}</p>
                    <div className="border p-1 rounded-full shadow-sm cursor-pointer">
                        {renderThemeChanger()}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Connectmenu
