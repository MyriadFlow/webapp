import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import Layout from "../Components/Layout";
import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
const Web3 = require("web3");
import { NFTStorage } from "nft.storage";
import { FaUserCircle } from "react-icons/fa";
import { convertUtf8ToHex } from "@walletconnect/utils";
import StoreFront from "../artifacts/contracts/StoreFront.sol/StoreFront.json";
const YOUR_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDFFODE2RTA3RjBFYTg4MkI3Q0I0MDQ2QTg4NENDQ0Q0MjA4NEU3QTgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MzI0NTEzNDc3MywibmFtZSI6Im5mdCJ9.vP9_nN3dQHIkN9cVQH5KvCLNHRk3M2ZO4x2G99smofw";
import axios from "axios";
import Link from "next/link";
import { Instagram } from "@mui/icons-material";
import { removePrefix } from "../utils/ipfsUtil";
import Loader from "../Components/Loader";
const client = new NFTStorage({ token: YOUR_API_KEY });
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const storeFrontAddress = process.env.NEXT_PUBLIC_STOREFRONT_ADDRESS;
function Profile() {
  const profile={name:'',country:'',profilePictureUrl:''}
  const walletAddr = useSelector(selectUser);
  var wallet = walletAddr ? walletAddr[0] : "";
  const [hasRole, setHasRole] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [profileData, setProfileData] = useState({...profile})
  const [updateProfile, setupdateProfile] = useState({...profile})
  const [loading, setLoading] = useState(false)

  async function uploadImage(e) {
    e.preventDefault();
      try {
        setLoading(true)
        const blobDataImage = new Blob([ e.target.files[0]]);
        const metaHash = await client.storeBlob(blobDataImage);
        setupdateProfile({...updateProfile,profilePictureUrl:`ipfs://${metaHash}`})
      } catch (error) {
        console.log("Error uploading file: ", error);
      } finally{
        setLoading(false)
      }
  }

  const updateData = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("platform_token");
    try {
      if (!updateProfile.name.trim() || !updateProfile.country.trim())
        alert("Do not leave any field empty!");
      else {
        var signroledata = JSON.stringify({
          name: "Alka Rashinkar",
          country: "India",
          profilePictureUrl: "https://unsplash.it/500",
        });

        const config = {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: signroledata,
        };
        setLoading(true)
        await axios.patch(
          "https://testnet.gateway.myriadflow.com/api/v1.0/profile",
          {...updateProfile},
          config
        );
        alert("Updation successful!");
        setShowModal(false);
        getProfile();
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }finally{
      setupdateProfile({profile})
      setLoading(false)
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
      console.log(msg);
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
    console.log(data);

    let web3 = new Web3(Web3.givenProvider);
    let completemsg = data.payload.eula + data.payload.flowId;
    console.log(completemsg);
    const hexMsg = convertUtf8ToHex(completemsg);
    console.log(hexMsg);
    const result = await web3.eth.personal.sign(hexMsg, wallet);
    console.log(result);

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
    setLoading(true)
    axios.get(
        `${BASE_URL}/api/v1.0/profile`,
        config
      ).then((res) => {
        const {data:{payload:{name,country,profilePictureUrl}}}=res
        console.log("Profile res>>>>>>>>>>>>>>>>",{name,country,profilePictureUrl});
        setProfileData({...profileData,name,country,profilePictureUrl})
        setupdateProfile({...profileData,name,country,profilePictureUrl})
        setLoading(true)
      })
      .catch((error) => {
        console.log(error);
      }).finally(()=>{
        setLoading(false)
      })
  };

  const connectweb = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(
      storeFrontAddress,
      StoreFront.abi,
      signer
    );
    setHasRole(
      await contract.hasRole(await contract.STOREFRONT_CREATOR_ROLE(), wallet)
    );
    const roleid = await contract.STOREFRONT_CREATOR_ROLE();
    localStorage.setItem("platform_roleid", roleid);
  };

  const onUpdateProfile=(e)=>{
    const {name,value}= e.target
    setupdateProfile({...updateProfile,[name]:value})
  }

  useEffect(() => {
    const asyncFn = async () => {
      const token = localStorage.getItem("platform_token");
      connectweb();
      if (!token) {
        authorize();
      } else {
        getProfile();
      }

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      /* next, create the item */
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
const {name,country,profilePictureUrl}=profileData
// console.log("before ruturn",{name,country,profilePic});
  return (
    <Layout title="Profile"description="Use to show metamask Profile details of the users">
      {loading &&  <Loader />}
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none gradient-blue">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none" style={{padding:"15px"}}>
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <div className="text-3xl font-bold" style={{margin:"0 auto"}}>
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
                                    className="form-control form-control-lg px-2 py-2 pl-2 bg-black w-full text-white"
                                    value={updateProfile.name}
                                    name="name"
                                    onChange={(e) =>
                                      // changesetUsername(e.target.value)
                                      onUpdateProfile(e)
                                    }
                                    placeholder="Name"
                                  />
                                </div>

                                <div className="md-form mb-3">
                                  <input
                                    type="text"
                                    id="form1Example13"
                                    className="form-control form-control-lg px-2 py-2 pl-2 bg-black w-full text-white"
                                    value={updateProfile.country}
                                    name="country"
                                    onChange={(e) =>
                                      onUpdateProfile(e)
                                      // changesetBio(e.target.value)
                                    }
                                    placeholder="Country"
                                  />
                                </div>
                                <div className="col-md-8 col-lg-7 col-xl-6 text-center justify-center align-center flex-col">
                               { updateProfile?.profilePictureUrl&&<img
                                src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/${removePrefix(updateProfile?.profilePictureUrl)}`}
                                className="img-fluid w-6/12"
                                alt=""
                                width="200"
                                height="200"
                              />}
                              <input
                                type="file"
                                accept="image/*"
                                className="btn btn-primary btn-md  mb-5 mt-5"
                                name="profilePic"
                                onChange={(e) => uploadImage(e)}
                              />
                            </div>
                            <div className="flex gap-6">
                              <div> <button style={{background:"#0162FF"}}
                                  type="submit"
                                  className=" text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                >
                                  Update Profile
                                </button></div>
                               
                            <div className="flex items-center justify-end  border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-white rounded bg-red-500 font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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
      <div className="flex px-5 py-5 gap-5 justify-center gradient-blue">
        <div className=" flex shadow-2xl ... p-10 gap-6">
         
          {profilePictureUrl ? (
                <div >
            <img width="200" height="200" className="w-full h-80 p-7" alt=""   src={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/${removePrefix(profilePictureUrl)}`}/>
              </div>
              
              ) : (
                <FaUserCircle className="text-3xl text-gray-500 " style={{height:"200px",width:"200px"}} />

              )}
          <div>
            <div className="font-bold text-2xl">User Details</div>
            <div>
             
             <div className="flex mt-3"> <div className="pb-4">Wallet Details:</div>
             <div className="ml-5">{user}</div></div>
            </div>
            <div className="flex">
              <div className="pb-4">Instagram Link:</div>
              <div className="ml-5 ">
                <Link
                  href="https://www.instagram.com/p/CnjIQSEss-5/"
                  target="_blank"
                  className="hover:text-sky-700 text-blue-500 dark:text-white"
                >
                  <div className="hover:text-sky-500">
                    <Instagram size={22} />
                  </div>
                </Link>
              </div>
            </div>
            <div>
              <div className=" pb-4 ">
                Roles :{" "}
                <span className="text-black">
                  User {hasRole && ", Creator"}{" "}
                </span>{" "}
              </div>
            </div>
            <div className="  pb-4 ">
              {" "}
              Name : <span className="text-black">{name}</span>
            </div>
            <div className="  pb-4">
              {" "}
              Country : <span className="text-black">{country}</span>
            </div>
            <div className="flex justify-center">
              <button style={{background:"#0162FF"}}
                className="  text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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
