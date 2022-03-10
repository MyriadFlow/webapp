import { FaUserCircle } from "react-icons/fa"
import { AiOutlineCloseCircle } from "react-icons/ai"
import Link from "next/link";
import { useState } from "react";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../slices/userSlice"

import { open } from "../slices/modelSlice"

import { setbalance } from "../slices/balanceSlice"
import { selectUser } from "../slices/userSlice"
import { selectBalance } from "../slices/balanceSlice"
import { FaEthereum } from "react-icons/fa"
import { FiLogOut } from "react-icons/fi"
import { useTheme } from "next-themes";
// import { creatorRole } from "../pages/api/creatorRole";
import axios from "axios";



function Connectmenu({ toogle }) {



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

    const creatorRole = async () => {
        const { data } = await axios.get(
            "https://marketplace-engine.lazarus.network/api/v1.0/flowid?walletAddress=0x313bfad1c87946bf893e2ecad141620eaa54943a"
        );
        console.log(data);

        var signdata = JSON.stringify({
            flowId : flow_id,
            signature:signed_msg,
        })

        const config = {
             url:"",
             method:"POST",
             headers:{
                 "Content-Type":"application/json",
             },
             data:data,
        };
        try{
            const response = await axios(config);
            const token = await response.data?.payload?.token;
            localStorage.setItem("platform_token",token);
            console.log(response);
            return true;
        }catch(e){
            console.log(e);
            return false;
        }
        // const result = await web3.eth.personal.sign(hexMsg, address);
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
                        className="bg-blue-500 hover:bg-gray-400 shadow-lg  px-10 py-4 rounded-lg text-white">{!user ? "Connect" : "Connected"}</button>
                </div>

                {
                    user &&
                    <div className="flex justify-center">
                        <button
                            onClick={creatorRole}
                            className="bg-blue-800 hover:bg-gray-400 shadow-lg px-10 py-2 mt-2 rounded-lg text-white">Get creator role</button>
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
