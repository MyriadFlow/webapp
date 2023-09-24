import axios from 'axios';
import Loader from "../Components/Loader";

const BASE_URL = "https://testnet.gateway.myriadflow.com/";
import { convertUtf8ToHex } from "@walletconnect/utils";
const Web3 = require("web3");
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const getProfile = async () => {
    const token = useAccount().address;
    const config = {
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };
    // setLoading(true);
    axios
        .get(`${BASE_URL}api/v1.0/profile`, config)
        .then((res) => {
            const {
                data: {
                    payload: {
                        name,
                        location,
                        bio,
                        email,
                        profilePictureUrl,
                        walletAddress
                    },
                },
            } = res;

            console.log(res.data);

            localStorage.setItem("profileuser", JSON.stringify(res.data.payload));
    // setprofileDetails(res.data.payload);
            // setLoading(true);
        })
        .catch((error) => {
            console.log(error);
        })
}

export const authorize = async () => {

        const mywallet = localStorage.getItem("platform_wallet")
        const { data } = await axios.get(
            `${BASE_URL}api/v1.0/auth/web3?walletAddress=${mywallet}`
        );
    
        let web3 = new Web3(Web3.givenProvider);
        let completemsg = data.payload.eula + data.payload.flowId;
        const hexMsg = convertUtf8ToHex(completemsg);
        const result = await web3.eth.personal.sign(hexMsg, mywallet);
        var signdata = JSON.stringify({
            flowId: data.payload.flowId,
            signature: result,
        });
        //this is use to genarate the token /perceto
        const config = {
            url: `${BASE_URL}api/v1.0/auth/web3`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: signdata,
        };
        try {
            const response = await axios(config);
            const token = await response?.data?.payload?.token;
            localStorage.setItem("platform_token", token);
            // console.log(token);
            getProfile();
            // getRole();
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
};