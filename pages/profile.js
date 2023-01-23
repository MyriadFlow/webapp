import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import Layout from "../Components/Layout";
import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
const Web3 = require("web3");
import { NFTStorage } from "nft.storage";
import { convertUtf8ToHex } from "@walletconnect/utils";
import StoreFront from "../artifacts/contracts/StoreFront.sol/StoreFront.json";
const YOUR_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDFFODE2RTA3RjBFYTg4MkI3Q0I0MDQ2QTg4NENDQ0Q0MjA4NEU3QTgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MzI0NTEzNDc3MywibmFtZSI6Im5mdCJ9.vP9_nN3dQHIkN9cVQH5KvCLNHRk3M2ZO4x2G99smofw";
import axios from "axios";
const client = new NFTStorage({ token: YOUR_API_KEY });
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const storeFrontAddress = process.env.NEXT_PUBLIC_STOREFRONT_ADDRESS;
function Profile() {
  const walletAddr = useSelector(selectUser);
  var wallet = walletAddr ? walletAddr[0] : "";
  console.log(wallet);

  const [hasRole, setHasRole] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [changeusername, changesetUsername] = useState("");
  const [changebio, changesetBio] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [changefileUrl, changesetFileUrl] = useState(null);
  async function uploadImage(e) {
    e.preventDefault();
    const changefileUrl = changesetFileUrl(
      URL.createObjectURL(e.target.files[0])
    );
    try {
      const metadata = await client.store({
        name: "My sweet NFT",
        description: "Just try to funge it. You can't do it.",
        image: changefileUrl,
      });
      console.log(e.target.files);
      console.log("Meta data after uploading", metadata);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (err) => {
        reject(err);
      };
    });
  };

  const updateData = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("platform_token");
    try {
      if (!changeusername.trim() || !changebio.trim())
        alert("Do not leave any field empty!");
      else {
        var signroledata = JSON.stringify({
          name: "Devsi singh",
          country: "India",
          profilePictureUrl: "https://unsplash.it/500",
        });

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: signroledata,
        };
        await axios.patch(
          "https://marketplace-engine.lazarus.network/api/v1.0/profile",
          {
            name: changeusername,
            country: changebio,
            profilePictureUrl: changefileUrl,
          },
          config
        );
        alert("Updation successful!");
        console.log(file);
        setShowModal(false);
        getProfile();
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  };

  const user = useSelector(selectUser);
  const [page, setPage] = useState("collected");

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
      console.log(roledata);
    } catch (e) {
      console.log(e);
    }

    let web3 = new Web3(Web3.givenProvider);
    let completemsg = roledata.data.payload.eula + roledata.data.payload.flowId;
    const hexMsg = convertUtf8ToHex(completemsg);
    // console.log(hexMsg);
    const result = await web3.eth.personal.sign(hexMsg, wallet);
    // console.log(result);

    var signroledata = JSON.stringify({
      flowId: roledata.data.payload.flowId,
      signature: result,
    });

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
      // console.log(response);
      const msg = await response?.data?.message;
      console.log(msg);
      setHasRole(true);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

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

    const config = {
      url: `${BASE_URL}/api/v1.0/authenticate`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //  "Token":`Bearer ${token}`
      },
      data: signdata,
    };
    try {
      const response = await axios(config);
      // console.log(response);
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
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(
        "https://marketplace-engine.lazarus.network/api/v1.0/profile",
        config
      )
      .then((res) => {
        console.log(res.data);
        setUsername(res.data.payload.name);
        setBio(res.data.payload.country ? res.data.payload.country : "");
        setFileUrl(res.data.payload.profilePictureUrl);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const connectweb = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(storeFrontAddress, StoreFront.abi, signer);
    setHasRole(
      await contract.hasRole(await contract.STOREFRONT_CREATOR_ROLE(), wallet)
    );
    const roleid = await contract.STOREFRONT_CREATOR_ROLE();
    localStorage.setItem("platform_roleid", roleid);
    console.log(localStorage.getItem("platform_roleid"));
  };

  useEffect(() => {
    const asyncFn = async () => { 

      const token = localStorage.getItem("platform_token");
      console.log(token);
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
      let contract = new ethers.Contract(storeFrontAddress, StoreFront.abi, signer);
      setHasRole(
        await contract.hasRole(await contract.STOREFRONT_CREATOR_ROLE(), wallet)
      );
     };
    asyncFn();
  }, [hasRole]);



  return (
    <Layout>
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
            
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
        
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold text-gray-400">
                      Edit Profile Details
                    </h3>
                  </div>
                  <div className="relative p-6 flex-auto">
                    <div className="update-page">
                      <div>
                        <section>
                          <div className="container py-5 h-100">
                            <div className="row d-flex align-items-center justify-content-center h-100">
                              <div
                                className="col-md-8 col-lg-7 col-xl-6 text-center flex justify-center align-center flex-col"
                               
                              >
                                <img
                                  src={changefileUrl}
                                  className="img-fluid w-6/12"
                                  alt=""
                                />
                                <input
                                  type="file"
                                  className="btn btn-primary btn-md ml-20 w-6/12 mb-5 mt-5"
                                 
                                  onChange={uploadImage}
                                />
                              </div>
                              <div
                                className="col-md-7 col-lg-5 col-xl-5 offset-xl-1 text-center"
                                style={{ zIndex: "1000" }}
                              >
                                <form onSubmit={updateData}>
                                  <div className="md-form mb-3">
                                    <input
                                      type="text"
                                      id="form1Example13"
                                      className="form-control form-control-lg pl-2"
                                      value={changeusername}
                                      onChange={(e) =>
                                        changesetUsername(e.target.value)
                                      }
                                      placeholder="Name"
                                    />
                                  </div>

                                  <div className="md-form mb-3">
                                    <input
                                      type="text"
                                      id="form1Example13"
                                      className="form-control form-control-lg pl-2"
                                      value={changebio}
                                      onChange={(e) =>
                                        changesetBio(e.target.value)
                                      }
                                      placeholder="Country"
                                    />
                                  </div>

                                  <button
                                    type="submit"
                                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                  >
                                    Update Profile
                                  </button>
                                </form>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-white rounded bg-red-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      <div className="flex px-5 py-5 gap-5 justify-center">
        <div className="shadow-2xl ... p-10 w-1/4" style={{height:"600px"}}>
          <div className="flex justify-center">
            <img  className="w-full h-80 p-7" alt=""src="/sample.jpg"></img>
          </div>
          <div>
            <p className="text-2xl font-bold pb-4 text-gray-400">
              Roles :{" "}
              <span className="text-white">User {hasRole && ", Creator"} </span>{" "}
            </p>
          </div>
          <p className="text-2xl font-bold pb-4 text-gray-400">
            {" "}
            Name : <span className="text-white">{username}</span>
          </p>
          <p className="text-2xl font-bold pb-4 text-gray-400">
            {" "}
            Country : <span className="text-white">{bio}</span>
          </p>
          <div className="flex justify-center">
          <button
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ... text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          onClick={() => setShowModal(true)}
        >
          Edit Profile Details
        </button> 
        </div>

        </div>
        <div className="shadow-2xl ... w-3/12 p-7" style={{height:"600px"}}>
          <div>Wallet Details</div>:{ user}
        </div>


      </div>
    </Layout>
  );
}

export default Profile;
