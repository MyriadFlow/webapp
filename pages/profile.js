import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import Layout from "../Components/Layout";
import React, { useState, useEffect } from "react";
const Web3 = require("web3");
import { NFTStorage } from "nft.storage";
import { FaUserCircle, FaMapMarkerAlt, FaWallet, FaEnvelope } from "react-icons/fa";
import { IoLogoInstagram, IoLogoTwitter, IoLogoDiscord } from "react-icons/io5";
import { convertUtf8ToHex } from "@walletconnect/utils";
import AccessMaster from '../artifacts/contracts/accessmaster/AccessMaster.sol/AccessMaster.json';
const YOUR_API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDFFODE2RTA3RjBFYTg4MkI3Q0I0MDQ2QTg4NENDQ0Q0MjA4NEU3QTgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MzI0NTEzNDc3MywibmFtZSI6Im5mdCJ9.vP9_nN3dQHIkN9cVQH5KvCLNHRk3M2ZO4x2G99smofw";
import axios from "axios";
import { removePrefix } from "../utils/ipfsUtil";
import Loader from "../Components/Loader";
import etherContract from "../utils/web3Modal";
const client = new NFTStorage({ token: YOUR_API_KEY });
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_GATEWAY;
const accessmasterAddress = process.env.NEXT_PUBLIC_ACCESS_MASTER_ADDRESS;

function Profile() {
    const profile = {
        name: "",
        location: "",
        bio: "",
        email: "",
        profilePictureUrl: "",
        walletAddress: "",
        coverPictureUrl: "",
        // instagram_id: "",
        // facebook_id: "",
        // twitter_id: "",
        // discord_id: "",
        // telegram_id: "",
    };
    const walletAddr = useSelector(selectUser);
    var wallet = walletAddr ? walletAddr[0] : "";
    const [hasRole, setHasRole] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [profileData, setProfileData] = useState({ ...profile });
    const [updateProfile, setupdateProfile] = useState({ ...profile });
    const [profileDetails, setprofileDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    async function uploadImage(e) {
        e.preventDefault();
        try {
            setLoading(true);
            const blobDataImage = new Blob([e.target.files[0]]);
            const metaHash = await client.storeBlob(blobDataImage);
            setupdateProfile({
                ...updateProfile,
                profilePictureUrl: `ipfs://${metaHash}`,
            });
        } catch (error) {
            console.log("Error uploading file: ", error);
        } finally {
            setLoading(false);
        }
    }

    const updateData = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("platform_token");
        try {
            if (
                !updateProfile.name.trim() ||
                !updateProfile.location.trim()
            )
                alert("Do not leave any field empty!");
            else {
                var signroledata = JSON.stringify({
                    name: "Alka Rashinkar",
                    country: "India",
                    profilePictureUrl: "https://unsplash.it/500",
                    // instagram_id: "CnjIQSEss-5/",
                    // facebook_id: "sasdsfhkkS",
                    // telegram_id: "sasdcbfvdj",
                    // twitter_id: "asxadcsfc",
                    // discord_id: "xnsacdbcv",
                });

                const config = {
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    data: signroledata,
                };
                setLoading(true);
                const data = await axios.patch(
                    "https://testnet.gateway.myriadflow.com/api/v1.0/profile",
                    { ...updateProfile },
                    config
                );
                if (data) {
                    alert("Updation successful!");
                    setShowModal(false);
                    getProfile();
                }
            }
        } catch (error) {
            console.log(error);
            alert("Something went wrong!");
        } finally {
            setupdateProfile({ profile });
            setLoading(false);
        }
    };

    const user = useSelector(selectUser);
    const getRole = async () => {
        const token = localStorage.getItem("platform_token");
        const role_id = localStorage.getItem("platform_roleid");

        const config1 = {
            url: `${BASE_URL}/api/v1.0/roleId/${role_id}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        let roledata;
        try {
            roledata = await axios(config1);
        } catch (e) {
            console.log(e);
        }

        let web3 = new Web3(Web3.givenProvider);
        let completemsg = roledata.data.payload.eula + roledata.data.payload.flowId;
        const hexMsg = convertUtf8ToHex(completemsg);
        const result = await web3.eth.personal.sign(hexMsg, wallet);

        var signroledata = JSON.stringify({
            flowId: roledata.data.payload.flowId,
            signature: result,
        });
        //This is used to create a role/generate the flowid and signature
        const config = {
            url: `${BASE_URL}/api/v1.0/claimrole`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            data: signroledata,
        };

        try {
            const response = await axios(config);
            const msg = await response?.data?.message;
            setHasRole(true);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    };
    //use to generate the hex msg and
    const authorize = async () => {
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

    const getProfile = async () => {
        const token = localStorage.getItem("platform_token");
        const config = {
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };
        setLoading(true);
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
                            walletAddress,
                            coverPictureUrl
                        },
                    },
                } = res;

                console.log(res.data);

                setProfileData({
                    ...profileData,
                    name,
                    location,
                    bio,
                    email,
                    profilePictureUrl,
                    walletAddress,
                    coverPictureUrl
                });



                setupdateProfile({
                    ...profileData,
                    name,
                    location,
                    bio,
                    email,
                    profilePictureUrl,
                    walletAddress,
                    coverPictureUrl
                });
                console.log(updateProfile);
                localStorage.setItem("profiledetails", JSON.stringify(res.data.payload));
                setprofileDetails(res.data.payload);
                setLoading(true);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const connectweb = async () => {
        const accessmaterContarct = await etherContract(accessmasterAddress, AccessMaster.abi)
        setHasRole(
            await accessmaterContarct.hasRole(await accessmaterContarct.FLOW_CREATOR_ROLE(), wallet)
        );
        const roleid = await accessmaterContarct.FLOW_CREATOR_ROLE();
        localStorage.setItem("platform_roleid", roleid);
    };
    const onUpdateProfile = (e) => {
        const { name, value } = e.target;
        setupdateProfile({ ...updateProfile, [name]: value });
    };

    useEffect(() => {
        const asyncFn = async () => {
            const token = localStorage.getItem("platform_token");
            // connectweb();
            if (token) {
                const profiledt = localStorage.getItem("profileuser");
                const parsed = JSON.parse(profiledt);
                setprofileDetails(parsed);
                // console.log(profiledt);

            } else {
                authorize();
            }
            // authorize();
            // const accessmaterContarct = await etherContract(accessmasterAddress, AccessMaster.abi)
            // setHasRole(
            //     await accessmaterContarct.hasRole(await accessmaterContarct.FLOW_CREATOR_ROLE(), wallet)
            // );
        };
        // authorize();
        asyncFn();
    }, []);



    const {
        name,
        location,
        bio,
        email,
        profilePictureUrl,
        walletAddress,
        coverPictureUrl
    } = profileData;
    return (
        <Layout
            title="Profile"
            description="Shows social account and metamask profile details of the users."
        >
            {loading && <Loader />}
            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none dark:body-back body-back-light">


                        <div className="py-12 transition duration-150 ease-in-out z-10 absolute top-0 right-0 bottom-0 left-0" id="modal">
                            <div role="alert" className="container mx-auto w-11/12 md:w-2/3 max-w-lg">
                                <div className="relative py-4 bg-white shadow-md rounded border border-gray-400">
                                    <div className="w-full flex justify-start text-gray-600 mb-3">
                                        <button onClick={() => setShowModal(false)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-x mr-4 ml-4" width="20" height="20" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>

                                        <h3 className="text-2xl font-semibold text-gray-900">
                                            Edit Profile
                                        </h3>
                                    </div>

                                    <div
                                        className="w-full h-48 object-cover bg-gray-400" style={{ backgroundImage: 'url("")' }}>
                                        {/* <input type="file" className="btn btn-primary btn-md ml-36" style={{ marginBottom: 20, marginTop: 20, width: "50%" }} onChange={(e) => { uploadImage(e) }} /> */}
                                        <label for="upload" className="flex flex-col items-center gap-2 cursor-pointer pt-16">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 fill-white stroke-indigo-500" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </label>
                                        <input id="upload" type="file" className="hidden" />

                                    </div>

                                    <div className="flex items-center justify-start -mt-20 ml-10">
                                        {/* {!user ?  */}
                                        <div className="rounded-full h-36 w-36 ring-offset-2 ring-1 ring-black bg-gray-400" >
                                            <label for="upload" className="flex flex-col items-center gap-2 cursor-pointer mt-14">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 fill-white stroke-indigo-500" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                {/* <span className="text-gray-600 font-medium">Upload file</span> */}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="px-10">
                                        <div className="mb-2">
                                            <label for="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                            <input type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                        </div>

                                        <div className="mb-2">
                                            <label for="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bio</label>
                                            <input type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                        </div>

                                        <div className="mb-2">
                                            <label for="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                                            <input type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                        </div>

                                        <div className="mb-2">
                                            <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                            <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                        </div>

                                        <div className="mb-2">
                                            <label for="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Facebook URL (Optional)</label>
                                            <input type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                        </div>

                                        <div className="mb-2">
                                            <label for="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">instagram URL (Optional)</label>
                                            <input type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                        </div>

                                        <div className="mb-2">
                                            <label for="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Telegram URL (Optional)</label>
                                            <input type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                        </div>
                                    </div>



                                    <button
                                        className="top-2 right-3 absolute text-white bg-blue-500 text-sm px-8 py-3 rounded-full border border-white shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}

            <div className="dark:body-back body-back-light pb-32">

                {profileDetails?.coverPictureUrl ? (
                    <div
                        className="w-full h-72 object-cover bg-gray-200" style={{
                            backgroundImage: `url(${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/${removePrefix(profileDetails?.coverPictureUrl)})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                        }}>
                    </div>
                ) : (
                    <div
                        className="w-full h-64 object-cover bg-gray-200" style={{ backgroundImage: 'url("")' }}>
                    </div>
                )}

                {profileDetails?.profilePictureUrl ? (

                    <div className="flex items-center justify-start -mt-24 ml-16">
                        <div className="rounded-full h-48 w-48 ring-offset-2 ring-1 ring-black bg-gray-200" >
                            <img
                                className="text-3xl text-gray-500 w-48 h-48 rounded-full"
                                alt=""
                                src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/${removePrefix(
                                    profileDetails?.profilePictureUrl
                                )}`}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-start -mt-24 ml-16">
                        <div className="rounded-full h-48 w-48 ring-offset-2 ring-1 ring-black bg-gray-200" >
                            <FaUserCircle
                                className="text-3xl text-gray-500 w-48 h-48"
                            />
                        </div>
                    </div>

                )}

                {/* <div className="flex items-center md:justify-end lg:-my-16 lg:mx-8 md:-my-16 md:mx-8 mt-8 justify-center lg:justify-end">
                    <button
                        className=" text-white text-sm px-8 py-3 rounded-full border border-white shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={() => setShowModal(true)}
                    >
                        Edit Profile
                    </button>
                </div> */}

                <div className=" m-2 flex flex-row items-center justify-start">

                    <div className="lg:mt-10 md:mt-10 mt-4 lg:ml-16 md:ml-16 ml-4">
                        <div>
                            <p className="dark:text-white text-gray-800 text-2xl font-bold">{profileDetails?.name}</p>
                        </div>
                        <div>
                            <p className="dark:text-white text-gray-800 mt-12 text-xl">Bio: {profileDetails?.bio}</p>

                            <div className="flex lg:flex-row md:flex-row flex-col mt-4">
                                <div className="flex">
                                    <FaMapMarkerAlt style={{ color: 'grey', marginTop: 6 }} />
                                    <p className="text-xl ml-2" style={{ color: 'grey' }}>{profileDetails?.location}</p>
                                </div>
                                <div className="flex lg:ml-12 md:ml-12 dark:text-white text-gray-800 cursor-pointer" onClick={() => { navigator.clipboard.writeText(profileDetails?.walletAddress) }}>
                                    <FaWallet style={{ marginTop: 6 }} className="" />
                                    <p className="text-xl ml-2 hidden lg:block md:block" >{profileDetails?.walletAddress}</p>
                                    <p className="text-xl ml-2 block lg:hidden md:hidden" >Copy address</p>
                                </div>
                            </div>

                            <div className="flex lg:flex-row md:flex-row flex-col mt-8">
                                <div className="flex dark:text-white text-gray-800">
                                    <FaEnvelope style={{ marginTop: 6 }} />
                                    <p className="text-xl ml-2">{profileDetails?.email}</p>
                                </div>
                                <div className="flex lg:ml-12 md:ml-12 text-xl dark:text-white text-gray-800">
                                    <IoLogoInstagram style={{ marginTop: 6, marginRight: 8 }} />
                                    <IoLogoTwitter style={{ marginTop: 6, marginRight: 8 }} />
                                    <IoLogoDiscord style={{ marginTop: 6 }} />
                                </div>
                            </div>


                        </div>
                        <div>
                        </div>
                    </div>

                </div>
            </div>



            {/* <div className="flex px-5 py-5 gap-5 justify-center body-back">
                <div className=" flex shadow-2xl ... p-10 gap-6">
                    {profilePictureUrl ? (
                        <div>
                            <img
                                width="200"
                                height="200"
                                className="w-full h-80 p-7 grow"
                                alt=""
                                src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/${removePrefix(
                                    profilePictureUrl
                                )}`}
                            />
                        </div>
                    ) : (
                        <FaUserCircle
                            className="text-3xl text-gray-500 w-52 h-52"
                        />
                    )}
                    <div>
                        <div className="font-bold text-2xl text-gray-500 dark:text-white">
                            User Details
                        </div>
                        <div>
                            <div className="flex mt-3">
                                {" "}
                                <div className="pb-4 text-gray-500 dark:text-white">
                                    Wallet Details:
                                </div>
                                <div className="ml-5 text-gray-500 dark:text-white">{user}</div>
                            </div>
                        </div>
                        <div>
                            <div className=" pb-4 text-gray-500 dark:text-white">
                                Roles :{" "}
                                <span className=" text-gray-500 dark:text-white">
                                    {hasRole && " Creator"}{" "}
                                </span>{" "}
                            </div>
                        </div>
                        <div className="  pb-4 ">
                            <div className="flex">
                                <div className="text-gray-500 dark:text-white">Name :</div>
                                <div className="text-gray-500 dark:text-white">{name}</div>
                            </div>
                        </div>
                        <div className="  pb-4 text-gray-500 dark:text-white">
                            <div className="flex">
                                <div className="text-gray-500 dark:text-white">Country :</div>
                                <div className="text-gray-500 dark:text-white">{country}</div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="pb-4 text-gray-500 dark:text-white">
                                Instagram :
                            </div>
                            <div className="ml-5 text-gray-500 dark:text-white">
                                {instagram_id}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="pb-4 text-gray-500 dark:text-white">Discord:</div>
                            <div className="ml-5 text-gray-500 dark:text-white">
                                {discord_id}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="pb-4 text-gray-500 dark:text-white">
                                Facebook:
                            </div>
                            <div className="ml-5 text-gray-500 dark:text-white">
                                {facebook_id}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="pb-4 text-gray-500 dark:text-white">Tweeter:</div>
                            <div className="ml-5 text-gray-500 dark:text-white">
                                {twitter_id}
                            </div>
                        </div>

                        <div className="flex">
                            <div className="pb-4 text-gray-500 dark:text-white">
                                Teligram:
                            </div>
                            <div className="ml-5 text-gray-500 dark:text-white">
                                {telegram_id}
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button
                                className=" bg-blue-800 text-black-500 dark:text-white active:bg-gray-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => setShowModal(true)}
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div> */}
        </Layout>
    );
}
export default Profile;