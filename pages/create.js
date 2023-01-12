import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { FiFile } from "react-icons/fi";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletConnect from "@walletconnect/web3-provider";

import Multiselect from "multiselect-react-dropdown";
const YOUR_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDFFODE2RTA3RjBFYTg4MkI3Q0I0MDQ2QTg4NENDQ0Q0MjA4NEU3QTgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MzI0NTEzNDc3MywibmFtZSI6Im5mdCJ9.vP9_nN3dQHIkN9cVQH5KvCLNHRk3M2ZO4x2G99smofw";
import axios from "axios";
const client = new NFTStorage({ token: YOUR_API_KEY });
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
import StoreFront from "../artifacts/contracts/StoreFront.sol/StoreFront.json"
import BuyAsset from "../Components/buyAssetModal";
import { Alert, Snackbar } from "@mui/material";
import Layout from "../Components/Layout";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import { convertUtf8ToHex } from "@walletconnect/utils";
import { NFTStorage } from "nft.storage";
import { IoMdCreate } from "react-icons/io";
const Web3 = require("web3");
const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
const storeFrontAddress = process.env.NEXT_PUBLIC_STOREFRONT_ADDRESS;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const rpc_provider = process.env.NEXT_PUBLIC_RPC_PROVIDER;

export default function CreateItem() {
  const [model, setmodel] = useState(false);
  const [modelmsg, setmodelmsg] = useState("Transaction in progress!");
  const [fileUrl, setFileUrl] = useState();
  const [file, setFile] = useState();
  const [animation, setAnimation] = useState("image");
  const [imaget, setimaget] = useState(false);
  const [videot, setVideot] = useState(false);
  const [audiot, setAudiot] = useState(false);
  const [doct, setDoct] = useState(false);
  const [video, setVideo] = useState();
  const [audio, setAudio] = useState();
  const [doc, setDoc] = useState();
  const [previewImage,setPreviewImage]=useState('');
  const [previewVideo,setPreviewVideo]=useState('');
  const [previewAudio,setPreviewAudio]=useState('');
  const [previewDoc,setPreviewDoc]=useState('');

  const [thumbnailUrl, setthumbnailUrl] = useState(null);
  const [previewThumbnail, setpreviewThumbnail] = useState('')
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
    alternettext: "",
  });
  const router = useRouter();
  async function onChange(e) {
    const file = new File([ ( e.target.files[0]) ], 'nft.png', { type: 'image/png' })
    try {
      const blobDataImage = new Blob([file])
      const metaHash = await client.storeBlob(blobDataImage)
      console.log("Image metahash",metaHash);
      setimaget(metaHash);
      setPreviewImage(URL.createObjectURL(e.target.files[0]))
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function onChangeVideo(e) {
    const video = new File([ ( e.target.files[0]) ], 'nft.mp4', { type: 'video/mp4' })
    try {
      const blobDataVedio = new Blob([video])
      const metaHash = await client.storeBlob(blobDataVedio)
      console.log("vedio metahash",metaHash);
      setVideot(metaHash);
      setPreviewVideo(URL.createObjectURL(e.target.files[0]))

    } catch (error) {

      console.log("Error uploading vedio: ", error);
    }
  }
  async function onChangeAudio(e) {
    e.preventDefault();
    const audio = new File([ ( e.target.files[0]) ], 'nft.mp3', { type: 'audio/mpeg' })
    try {
      const blobDataAudio = new Blob([audio])
      const metaHash = await client.storeBlob(blobDataAudio)
      console.log("audio metahash",metaHash);
      setAudiot(metaHash);
      setPreviewAudio(URL.createObjectURL(e.target.files[0]))

    } catch (error) {
      console.log("Error uploading audio: ", error);
    }
  }
  async function onChangeDoc(e) {
    e.preventDefault();
    const doc = new File([ ( e.target.files[0]) ], 'text.pdf', { type: 'pdf/doc/xml/ppt' })
    try {
      const blobDataDoc = new Blob([doc])
      const metaHash = await client.storeBlob(blobDataDoc)
      console.log("doc metahash",metaHash);
      setDoct(metaHash);
      setPreviewDoc(URL.createObjectURL(e.target.files[0]))

    } catch (error) {
      console.log("Error uploading file doc: ", error);
    }
  }

   function createMarket(e) {
     e.preventDefault();
     e.stopPropagation();
     const { name, description, price, alternettext } = formInput;
     let assetData = {};
     if (!name || !description || !price) {
       setAlertMsg("Please Fill All Fields");
       setOpen(true);
       return;
     }
     assetData = {
       name,
       description,
       price,
       alternettext,
       attributes,
       categories,
     };
     if (!imaget) {
       setAlertMsg("Image is required to create asset");
       setOpen(true);
       return;
     }

     setmodelmsg("Transaction 1 in  progress");
     setmodel(true);

     let image = "",
       videoURI = "",
       audioURI = "",
       docURI = ""
     if (imaget) {
       image = `ipfs://${imaget}`;
       assetData["image"] = image;
     }

     if (videot) {
       videoURI = `ipfs://${videot}`;
       assetData["video"] = videoURI;
       assetData["animation_url"] = videoURI;
     }

     if (audiot) {
       audioURI = `ipfs://${audiot}`;
       assetData["audio"] = audioURI;
       assetData["animation_url"] = audioURI;
       delete assetData['video']
     }

     if (doct) {
       docURI = `ipfs://${doct}`;
       assetData["document"] = docURI;
       if(assetData?.audio || assetData?.video){
        delete assetData['video']
        delete assetData['audio']
        delete assetData['animation_url']
       }
     }

     const data = JSON.stringify({...assetData});
     console.log("Asset Data before create",data)

     const blobData = new Blob([data]);
     try {
       client.storeBlob(blobData).then(async (metaHash) => {
         const ipfsHash = metaHash;
         const url = `ipfs://${metaHash}`;
         console.log("doc ipfs", ipfsHash, url);
         await createItem(ipfsHash, url);
       });
     } catch (error) {
       setmodelmsg("Transaction failed");
       console.log("Error uploading file: ", error);
     }
   }  


  async function createItem(ipfsHash, url) {
    const options = new WalletConnectProvider({
      rpc: {
        137: 'https://rpc-mumbai.maticvigil.com/v1/f336dfba703440ee198bf937d5c065b8fe04891c',
      },
      rpcUrl:'https://rpc-mumbai.maticvigil.com/v1/f336dfba703440ee198bf937d5c065b8fe04891c',
      infuraId: process.env.INFURA_KEY,

    });
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: options,
      },
    };

    const web3Modal = new Web3Modal({cacheProvider: true,
      providerOptions, network: "testnet",
      version: "mumbai" });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(storeFrontAddress, StoreFront.abi, signer);
    console.log("ipfs://" + ipfsHash);

    try {
      let transaction = await contract.createAsset(url);
      let tx = await transaction.wait();
      console.log("transaction",transaction);
      setmodelmsg("Transaction 1 Complete");
      let event = tx.events[0];
      let value = event.args[2];
      let tokenId = value.toNumber();
      const price = ethers.utils.parseUnits(formInput.price, "ether");
      await listItem(transaction, contract, tokenId, price, signer);
      
    } catch (e) {
      console.log(e);
      setmodelmsg("Transaction 1 failed");
      return;

    // }finally{
    //   setPreviewImage("");
    //   setPreviewVideo("");
    //   setPreviewAudio("");
    //   setPreviewDoc("");
    // }
    }
    /* then list the item for sale on the marketplace */
    // contract = new ethers.Contract(marketplaceAddress, Marketplace.abi, signer)
    // transaction = await contract.createMarketItem(storeFrontAddress, tokenId, price)
    // await transaction.wait()
    router.push("/explore");
  }
  const listItem = async (transaction, contract, tokenId, price, signer) => {
    try {
      setmodelmsg("Transaction 2 in progress");
      contract = new ethers.Contract(
        marketplaceAddress,
        Marketplace.abi,
        signer
      );
      transaction = await contract.createMarketItem(
        storeFrontAddress,
        tokenId,
        price
      );
      await transaction.wait();
      console.log("transaction completed");
      setmodelmsg("Transaction 2 Complete !!");
    } catch (e) {
      console.log(e);
      setmodelmsg("Transaction 2 failed");
    }
  };
  const [advancemenu, Setadvancemenu] = useState(false);
  const [attributes, setInputFields] = useState([
    { id: uuidv4(), display_type: "", trait_type: "", value: "" },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("attributes", attributes);
  };

  const handleChangeInput = (id, event) => {
    const newInputFields = attributes.map((i) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value;
      }
      return i;
    });

    setInputFields(newInputFields);
  };

  const handleAddFields = () => {
    setInputFields([
      ...attributes,
      { id: uuidv4(), display_type: "", trait_type: "", value: "" },
    ]);
  };

  const handleRemoveFields = (id) => {
    const values = [...attributes];
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    );
    setInputFields(values);
  };

  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("Something went wrong");

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const walletAddr = useSelector(selectUser);
  var wallet = walletAddr ? walletAddr[0] : "";

  const [hasRole, setHasRole] = useState(true);

  useEffect(async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(storeFrontAddress, StoreFront.abi, signer);
    setHasRole(
      await contract.hasRole(await contract.STOREFRONT_CREATOR_ROLE(), wallet)
    );
  }, []);

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
      getRole();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const getRole = async () => {
    const token = localStorage.getItem("platform_token");

    const config1 = {
      url: `${BASE_URL}/api/v1.0/roleId/0x01b9906c77d0f3e5e952265ffbd74a08f1013f607e72528c5c1fbaf8f36e3634`,
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
    const result = await web3.eth.personal.sign(hexMsg, wallet);

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
      const msg = await response?.data?.message;
      console.log(msg);
      setHasRole(true);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const [options, setOptions] = useState([
    "Art",
    "Music",
    "Sports",
    "Video",
    "Cartoon",
    "Others",
  ]);
  const [categories, setCategory] = useState([]);

  if (!hasRole) {
    const loader = setTimeout(() => {
      router.push("/profile");
    }, 1000);
    loader;
  }

  return (
    <Layout>
      <div className=" w-full">
        <div className="dark:bg-gray-800 kumbh text-center">
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              {alertMsg}
            </Alert>
          </Snackbar>
          {model && (
            <BuyAsset open={model} setOpen={setmodel} message={modelmsg} />
          )}

          <div className="max-w-[1250px] mx-auto myshadow rounded">
            <div className="bg-white dark:bg-gray-800 mb-5">
              <div className="">
                <div className="p-4 mt-5">
                  <form action="#">
                    <h3 className="text-3xl py-4 font-semibold">
                      Create Asset
                    </h3>

                    <div className="">
                      <input
                        placeholder="Asset Name"
                        className="w-full rounded-md p-3 bg-white  dark:bg-gray-900 outline-none mb-4 border-[1px] border-[#d5d5d6]"
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            name: e.target.value,
                          })
                        }
                      />

                      <textarea
                        type="text"
                        placeholder="Asset Description"
                        className="w-full bg-white  dark:bg-gray-900 rounded-md shadow-sm p-3 outline-none border-[1px] border-[#d5d5d6] mb-4"
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            description: e.target.value,
                          })
                        }
                      />

                      <input
                        type="text"
                        placeholder="Asset Price in Matic"
                        className="w-full bg-white dark:bg-gray-900 rounded-md mb-4 shadow-sm p-3 outline-none border-[1px] border-[#d5d5d6]"
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            price: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="bg-[#1e1f26] flex items-center rounded-sm flex justify-center">
                      <div
                        onClick={() => setimaget(!imaget)}
                        style={{ height: "60px" }}
                        className={` dark:text-white hover:text-gray-400 dark:hover:bg-[#131417] text-gray-900 cursor-pointer p-3 border-b-2 border-transparent hover:border-[#47cf73] transition-all ${
                          animation === "image"
                            ? "bg-[#131417] border-[#47cf73]"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-x-2">
                          <IoMdCreate className="text-xl dark:text-white" />
                          <p className="text-xl font-semibold dark:text-white">
                            Image
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => setVideot(!videot)}
                        style={{ height: "60px" }}
                        className={`dark:text-white hover:text-gray-400 dark:hover:bg-[#131417] text-gray-900 cursor-pointer p-3 border-b-2 border-transparent hover:border-[#47cf73] transition-all ${
                          animation === "video"
                            ? "bg-[#131417] border-[#47cf73]"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-x-2">
                          <p className="text-xl font-semibold dark:text-white">
                            Video
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => setAudiot(!audiot)}
                        style={{ height: "60px" }}
                        className={`dark:text-white hover:text-gray-400 dark:hover:bg-[#131417] text-gray-900 cursor-pointer p-3 border-b-2 border-transparent hover:border-[#47cf73] transition-all ${
                          animation === "audio"
                            ? "bg-[#131417] border-[#47cf73]"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-x-2">
                          <p className="text-xl font-semibold dark:text-white">
                            Audio
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => setDoct(!doct)}
                        style={{ height: "60px" }}
                        className={`dark:text-white hover:text-gray-400 dark:hover:bg-[#131417] text-gray-900 cursor-pointer p-3 border-b-2 border-transparent hover:border-[#47cf73] transition-all ${
                          animation === "document"
                            ? "bg-[#131417] border-[#47cf73]"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-x-2">
                          <p className="text-xl font-semibold dark:text-white">
                            Document
                          </p>
                        </div>
                      </div>
                    </div>

                    {imaget && (
                      <div className="p-8 border-[1px] rounded-md border-[#d5d5d6]">
                        <div className="w-full rounded-md bg-white dark:bg-gray-900">
                          <div className="w-full">
                            <div
                              className={
                                file
                                  ? "h-auto w-full border-4 rounded-md"
                                  : "h-80 w-full rounded-md border-2 border-dashed hover:border-[#286efa] bg-white dark:bg-gray-900"
                              }
                            >
                              <div className="relative h-full">
                                {previewImage ? (
                                  <img
                                    src={previewImage}
                                    alt=""
                                    className="w-full object-cover h-72 flex justify-center"
                                  />
                                ) : (
                                  <div>
                                    <div className="">
                                      <input
                                        type="file"
                                        name="Asset"
                                        className="bg-slate-500 absolute top-0 left-0 w-full h-full opacity-0 z-50"
                                        onChange={onChange}
                                      />
                                      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                                        <span className="flex items-center justify-center">
                                          <FiFile className="text-4xl" />
                                        </span>
                                        <h1 className="text-lg font-semibold">
                                          Drag file here to upload
                                        </h1>
                                        <p className="text-[#6a6b76]">
                                          Alternatively, you can select a file
                                          by
                                          <br />
                                          <span className="text-lg font-bold text-[#2e44ff] cursor-pointer">
                                            clicking here
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className=""></div>
                        </div>
                      </div>
                    )}
                    {videot && (
                      <div className="p-8 border-[1px] rounded-md border-[#d5d5d6]">
                        <div className="w-full rounded-md bg-white dark:bg-gray-900">
                          <div className="w-full">
                            <div
                              className={
                                video
                                  ? "h-auto w-full border-4 rounded-md"
                                  : "h-80 w-full rounded-md border-2 border-dashed hover:border-[#286efa] bg-white dark:bg-gray-900"
                              }
                            >
                              <div className="relative h-full">
                                {previewVideo ? (
                                  <video
                                    alt=""
                                    className="w-full object-cover h-72 flex justify-center"
                                  >
                                    <source
                                      src={previewVideo}
                                      type="video/mp4"
                                    ></source>
                                  </video>
                                ) : (
                                  <div>
                                    <div className="">
                                      <input
                                        type="file"
                                        name="Asset"
                                        className="bg-slate-500 absolute top-0 left-0 w-full h-full opacity-0 z-50"
                                        onChange={onChangeVideo}
                                        id="default_btn"
                                      />
                                      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                                        <span className="flex items-center justify-center">
                                          <FiFile className="text-4xl" />
                                        </span>
                                        <h1 className="text-lg font-semibold">
                                          Drag video here to upload video
                                        </h1>
                                        <p className="text-[#6a6b76]">
                                          Alternatively, you can select a video
                                          by
                                          <br />
                                          <span className="text-lg font-bold text-[#2e44ff] cursor-pointer">
                                            clicking here
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {audiot && (
                      <div className="p-8 border-[1px] rounded-md border-[#d5d5d6]">
                        <div className="w-full rounded-md bg-white dark:bg-gray-900">
                          <div className="w-full">
                            <div
                              className={
                                audio
                                  ? "h-auto w-full border-4 rounded-md"
                                  : "h-80 w-full rounded-md border-2 border-dashed hover:border-[#286efa] bg-white dark:bg-gray-900"
                              }
                            >
                              <div className="relative h-full">
                                {previewAudio ? (
                                  <audio
                                    controls
                                    alt=""
                                    className="w-full object-cover h-72 flex justify-center"
                                  >
                                    <source
                                      src={previewAudio}
                                      type="audio/mpeg"
                                    ></source>
                                  </audio>
                                ) : (
                                  <div>
                                    <div className="">
                                      <input
                                        type="file"
                                        name="Asset"
                                        className="bg-slate-500 absolute top-0 left-0 w-full h-full opacity-0 z-50"
                                        onChange={onChangeAudio}
                                        id="default_btn"
                                      />
                                      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                                        <span className="flex items-center justify-center">
                                          <FiFile className="text-4xl" />
                                        </span>
                                        <h1 className="text-lg font-semibold">
                                          Drag Audio here to upload
                                        </h1>
                                        <p className="text-[#6a6b76]">
                                          Alternatively, you can select a Audio
                                          by
                                          <br />
                                          <span className="text-lg font-bold text-[#2e44ff] cursor-pointer">
                                            clicking here
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className=""></div>
                        </div>
                      </div>
                    )}
                    {doct && (
                      <div className="p-8 border-[1px] rounded-md border-[#d5d5d6]">
                        <div className="w-full rounded-md bg-white dark:bg-gray-900">
                          <div className="w-full">
                            <div
                              className={
                                doc
                                  ? "h-auto w-full border-4 rounded-md"
                                  : "h-80 w-full rounded-md border-2 border-dashed hover:border-[#286efa] bg-white dark:bg-gray-900"
                              }
                            >
                              <div className="relative h-full">
                                {previewDoc ? (
                                  <input
                                    file={previewDoc}
                                    alt=""
                                    multiple
                                    className="w-full object-cover h-72 flex justify-center"
                                  />
                                ) : (
                                  <div>
                                    <div className="">
                                      <input
                                        type="file"
                                        name="Upload"
                                        accept="application/pdf,.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                        className="bg-slate-500 absolute top-0 left-0 w-full h-full opacity-0 z-50"
                                        onChange={onChangeDoc}
                                        id="default_btn"
                                      />
                                      <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                                        <span className="flex items-center justify-center">
                                          <FiFile className="text-4xl" />
                                        </span>
                                        <h1 className="text-lg font-semibold">
                                          Drag Document here to upload
                                        </h1>
                                        <p className="text-[#6a6b76]">
                                          Alternatively, you can select a
                                          Document by
                                          <br />
                                          <span className="text-lg font-bold text-[#2e44ff] cursor-pointer">
                                            clicking here
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className=""></div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              <div className="w-full px-8 py-6">
                <div
                  className="bg-gray-100 shadow-sm cursor-pointer p-4 border-2 border-gray-300 rounded-xl font-semibold text-md  dark:bg-gray-800"
                  onClick={() => Setadvancemenu(!advancemenu)}
                >
                  {advancemenu ? " Hide advanced menu" : "Show advanced menu"}
                </div>

                {advancemenu && (
                  <div>
                    <p className="text-md font-semibold mt-6">
                      {" "}
                      Properties{" "}
                      <span className="text-gray-400">(Optipnal) </span>
                    </p>
                    <form onSubmit={handleSubmit}>
                      {attributes.map((inputField) => (
                        <div key={inputField.id}>
                          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4 pb-2">
                            <input
                              name="display_type"
                              label="First Name"
                              placeholder="Display type"
                              className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900"
                              variant="filled"
                              value={inputField.display_type}
                              onChange={(event) =>
                                handleChangeInput(inputField.id, event)
                              }
                            />
                            <input
                              name="trait_type"
                              label="Last Name"
                              placeholder="Trait type"
                              className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900"
                              variant="filled"
                              value={inputField.trait_type}
                              onChange={(event) =>
                                handleChangeInput(inputField.id, event)
                              }
                            />
                            <input
                              name="value"
                              type="number"
                              label="First Name"
                              placeholder="Value"
                              className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900"
                              variant="filled"
                              value={inputField.value}
                              onChange={(event) =>
                                handleChangeInput(inputField.id, event)
                              }
                            />

                            <button
                              disabled={attributes.length === 1}
                              onClick={() => handleRemoveFields(inputField.id)}
                            >
                              <FaMinusSquare style={{ color: "red" }} />
                            </button>
                            <button onClick={handleAddFields}>
                              <FaPlusSquare style={{ color: "green" }} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </form>

                    <p className="text-md font-semibold mt-6">
                      {" "}
                      Alternative text for NFT{" "}
                      <span className="text-gray-400">(Optipnal) </span>
                    </p>
                    <input
                      placeholder="Image description in details"
                      className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900  "
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          alternettext: e.target.value,
                        })
                      }
                    />

                    <p className="font-semibold text-lg my-6">Category</p>
                    <Multiselect
                      isObject={false}
                      onRemove={(event) => {
                        setCategory(event);
                      }}
                      onSelect={(event) => {
                        setCategory(event);
                      }}
                      options={options}
                      selectedValues={[]}
                      showCheckbox
                      style={{
                        optionContainer: {
                          background: "#42C2FF",
                          color: "white",
                        },
                      }}
                    />
                  </div>
                )}
              </div>

              {/* {!fileUrl && (
                <div className="flex justify-evenly">
                  <div className="flex mt-10 font-semibold text-md">
                    <p className="text-md ml-7">
                      Choose a PNG image for thumbnail .&nbsp;
                    </p>
                    <input
                      type="file"
                      name="Asset"
                      onChange={thumbnailUpload}
                      id="thumbnail_btn"
                      hidden
                    />
                    <div>
                      <button
                        onClick={(e) => thumbnailpicker(e)}
                        className="upload_color bg-purple-500 dark:bg-gray-500 hover:bg-purple-300 px-2 py-1 rounded-md text-white"
                      >
                        {" "}
                        Choose File
                      </button>
                    </div>
                  </div>
                  <div
                    className={
                      previewThumbnail
                        ? "h-auto w-1/2 mt-4 rounded-md"
                        : "h-60 w-1/2 mt-4 rounded-md bg-white dark:bg-gray-900 justify-center items-center"
                    }
                  >
                    {previewThumbnail ? (
                      <div
                        className="ml-5"
                        style={{ width: "300px", height: "300px" }}
                      >
                        <img src={previewThumbnail} alt="" className="" />
                      </div>
                    ) : (
                      <p></p>
                    )}
                  </div>
                </div>
              )} */}
              <div style={{ marginTop: "100px" }}>
                <button
                  onClick={(e)=>createMarket(e)}
                  className="bg-[#2e44ff] rounded-xl dark:bg-black text-white py-3 px-3 mb-8"
                >
                  Create digital artifact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
