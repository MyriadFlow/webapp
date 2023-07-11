import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import Layout from "../Components/Layout";
import React, { useState, useEffect } from "react";
const Web3 = require("web3");
import { NFTStorage } from "nft.storage";
import { FaUserCircle } from "react-icons/fa";
import { convertUtf8ToHex } from "@walletconnect/utils";
import AccessMaster from '../artifacts/contracts/accessmaster/AccessMaster.sol/AccessMaster.json';
const YOUR_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDFFODE2RTA3RjBFYTg4MkI3Q0I0MDQ2QTg4NENDQ0Q0MjA4NEU3QTgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MzI0NTEzNDc3MywibmFtZSI6Im5mdCJ9.vP9_nN3dQHIkN9cVQH5KvCLNHRk3M2ZO4x2G99smofw";
import axios from "axios";
import { removePrefix } from "../utils/ipfsUtil";
import Loader from "../Components/Loader";
import etherContract from "../utils/web3Modal";
const client = new NFTStorage({ token: YOUR_API_KEY });
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const accessmasterAddress = process.env.NEXT_PUBLIC_ACCESS_MASTER_ADDRESS;

function Profile() {
  const profile = {
    name: "",
    country: "",
    profilePictureUrl: "",
    instagram_id: "",
    facebook_id: "",
    twitter_id: "",
    discord_id: "",
    telegram_id: "",
  };
  const walletAddr = useSelector(selectUser);
  var wallet = walletAddr ? walletAddr[0] : "";
  const [hasRole, setHasRole] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [profileData, setProfileData] = useState({ ...profile });
  const [updateProfile, setupdateProfile] = useState({ ...profile });
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
        !updateProfile.country.trim()
      )
        alert("Do not leave any field empty!");
      else {
        var signroledata = JSON.stringify({
          name: "Alka Rashinkar",
          country: "India",
          profilePictureUrl: "https://unsplash.it/500",
          instagram_id: "CnjIQSEss-5/",
          facebook_id: "sasdsfhkkS",
          telegram_id: "sasdcbfvdj",
          twitter_id: "asxadcsfc",
          discord_id: "xnsacdbcv",
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
        await axios.patch(
          "https://testnet.gateway.myriadflow.com/api/v1.0/profile",
          { ...updateProfile },
          config
        );
        alert("Updation successful!");
        setShowModal(false);
        getProfile();
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
    const { data } = await axios.get(
      `${BASE_URL}/api/v1.0/flowid?walletAddress=${wallet}`
    );

    let web3 = new Web3(Web3.givenProvider);
    let completemsg = data.payload.eula + data.payload.flowId;
    const hexMsg = convertUtf8ToHex(completemsg);
    const result = await web3.eth.personal.sign(hexMsg, wallet);
    var signdata = JSON.stringify({
      flowId: data.payload.flowId,
      signature: result,
    });
    //this is use to genarate the token /perceto
    const config = {
      url: `${BASE_URL}/api/v1.0/authenticate`,
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
      getProfile();
      getRole();
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
      .get(`${BASE_URL}/api/v1.0/profile`, config)
      .then((res) => {
        const {
          data: {
            payload: {
              name,
              country,
              profilePictureUrl,
              telegram_id,
              facebook_id,
              twitter_id,
              discord_id,
              instagram_id,
            },
          },
        } = res;
       
        setProfileData({
          ...profileData,
          name,
          country,
          profilePictureUrl,
          instagram_id,
          telegram_id,
          facebook_id,
          twitter_id,
          discord_id,
        });
        setupdateProfile({
          ...profileData,
          name,
          country,
          profilePictureUrl,
          instagram_id,
          telegram_id,
          facebook_id,
          twitter_id,
          discord_id,
        });
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
      connectweb();
      if (!token) {
        authorize();
      } else {
        getProfile();
      }

      const accessmaterContarct = await etherContract(accessmasterAddress, AccessMaster.abi)
      setHasRole(
        await accessmaterContarct.hasRole(await accessmaterContarct.FLOW_CREATOR_ROLE(), wallet)
      );
    };
    asyncFn();
  }, [hasRole]);



  const {
    name,
    country,
    profilePictureUrl,
    instagram_id,
    facebook_id,
    telegram_id,
    twitter_id,
    discord_id,
  } = profileData;
  return (
    <Layout
      title="Profile"
      description="Use to show metamask Profile details of the users"
    >
      {loading && <Loader />}
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none body-back">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div
                className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-3.5"
              >
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <div
                    className="text-3xl font-bold text-gray-500 dark:text-black m-auto"
                  >
                    Edit Profile Details
                  </div>
                </div>
                <div className="relative p-6 flex-auto">
                  <div className="update-page">
                    <div>
                      <section>
                        <div className="container py-5 h-100">
                          <div className="row d-flex align-items-center justify-content-center h-100">
                            <div
                              className="col-md-7 col-lg-5 col-xl-5 offset-xl-1 text-center"
                              style={{ zIndex: "1000" }}
                            >
                              <form onSubmit={updateData}>
                                <div className="md-form mb-3">
                                  <input
                                    type="text"
                                    id="form1Example13"
                                    className="form-control form-control-lg px-2 py-2 pl-2 bg-black w-full text-gray-500 dark:text-white"
                                    value={updateProfile.name}
                                    name="name"
                                    onChange={(e) => onUpdateProfile(e)}
                                    placeholder="Name"
                                  />
                                </div>

                                <div className="md-form mb-3">
                                  <input
                                    type="text"
                                    id="form1Example13"
                                    className="form-control form-control-lg px-2 py-2 pl-2 bg-black w-full text-gray-500 dark:text-white"
                                    value={updateProfile.country}
                                    name="country"
                                    onChange={(e) => onUpdateProfile(e)}
                                    placeholder="Country"
                                  />
                                </div>
                                <div className="md-form mb-3">
                                  <input
                                    type="text"
                                    id="form1Example13"
                                    className="form-control form-control-lg px-2 py-2 pl-2 bg-black w-full text-gray-500 dark:text-white"
                                    value={updateProfile.instagram_id}
                                    name="instagram_id"
                                    onChange={(e) => onUpdateProfile(e)}
                                    placeholder="Instagram Id"
                                  />
                                </div>
                                <div className="md-form mb-3">
                                  <input
                                    type="text"
                                    id="form1Example13"
                                    className="form-control form-control-lg px-2 py-2 pl-2 bg-black w-full text-gray-500 dark:text-white"
                                    value={updateProfile.discord_id}
                                    name="discord_id"
                                    onChange={(e) => onUpdateProfile(e)}
                                    placeholder="Discord Id"
                                  />
                                </div>
                                <div className="md-form mb-3">
                                  <input
                                    type="text"
                                    id="form1Example13"
                                    className="form-control form-control-lg px-2 py-2 pl-2 bg-black w-full text-gray-500 dark:text-white"
                                    value={updateProfile.twitter_id}
                                    name="twitter_id"
                                    onChange={(e) => onUpdateProfile(e)}
                                    placeholder="Tweeter Id"
                                  />
                                </div>
                                <div className="md-form mb-3">
                                  <input
                                    type="text"
                                    id="form1Example13"
                                    className="form-control form-control-lg px-2 py-2 pl-2 bg-black w-full text-gray-500 dark:text-white"
                                    value={updateProfile.telegram_id}
                                    name="telegram_id"
                                    onChange={(e) => onUpdateProfile(e)}
                                    placeholder="Teligram Id"
                                  />
                                </div>
                                <div className="md-form mb-3">
                                  <input
                                    type="text"
                                    id="form1Example13"
                                    className="form-control form-control-lg px-2 py-2 pl-2 bg-black w-full text-gray-500 dark:text-white"
                                    value={updateProfile.facebook_id}
                                    name="facebook_id"
                                    onChange={(e) => onUpdateProfile(e)}
                                    placeholder="Facebook Id"
                                  />
                                </div>

                                <div className="col-md-8 col-lg-7 col-xl-6 text-center justify-center align-center flex-col">
                                  {updateProfile?.profilePictureUrl && (
                                    <img
                                      alt="alt"
                                      src={`${
                                        process.env.NEXT_PUBLIC_IPFS_GATEWAY
                                      }/${removePrefix(
                                        updateProfile?.profilePictureUrl
                                      )}`}
                                      className="img-fluid w-6/12 grow"
                                      width="200"
                                      height="200"
                                    />
                                  )}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="btn btn-primary btn-md  mb-5 mt-5"
                                    name="profilePic"
                                    onChange={(e) => uploadImage(e)}
                                  />
                                </div>
                                <div className="flex gap-6">
                                  <div>
                                    {" "}
                                    <button
                                      type="submit"
                                      className=" bg-blue-800 text-black-500 dark:text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                    >
                                      Update Profile
                                    </button>
                                  </div>

                                  <div className="flex items-center justify-end  border-t border-solid border-slate-200 rounded-b">
                                    <button
                                      className="text-black-500 dark:text-white rounded bg-red-500 font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                      type="button"
                                      onClick={() => setShowModal(false)}
                                    >
                                      Close
                                    </button>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      <div className="flex px-5 py-5 gap-5 justify-center body-back">
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
      </div>
    </Layout>
  );
}
export default Profile;