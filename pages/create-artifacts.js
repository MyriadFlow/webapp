/* pages/create-artifacts.js */
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
// Icons
import { FiFile } from "react-icons/fi";
import { FaVideo, FaPlusSquare, FaMinusSquare, FaHeart } from "react-icons/fa"
import { v4 as uuidv4 } from 'uuid';
import Multiselect from "multiselect-react-dropdown";
import axios from "axios";
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
import Creatify from '../artifacts/contracts/Creatify.sol/Creatify.json'
import Marketplace from '../artifacts/contracts/Marketplace.sol/Marketplace.json'
import BuyAsset from "../Components/buyAssetModal";
import { Alert, Snackbar } from "@mui/material";
import Layout from "../Components/Layout";
import { useSelector } from 'react-redux'
import { selectUser } from '../slices/userSlice'
import { convertUtf8ToHex } from "@walletconnect/utils";
const Web3 = require("web3");
const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
const creatifyAddress = process.env.NEXT_PUBLIC_CREATIFY_ADDRESS;
const BASE_URL=process.env.NEXT_PUBLIC_BASE_URL;

export default function CreateItem() {

  const [model, setmodel] = useState(false);
  const [modelmsg, setmodelmsg] = useState("Transaction in progress!");

  const filepicker = (e) => {
    e.preventDefault();
    const default_btn = document.querySelector("#default_btn");
    default_btn.click()
  };

  const thumbnailpicker = (e) => {
    e.preventDefault();
    const thumbnail_btn = document.querySelector("#thumbnail_btn");
    thumbnail_btn.click()
  };


  const [fileUrl, setFileUrl] = useState(null)
  const [thumbnailUrl, setthumbnailUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '', alternettext: '' });
  const router = useRouter();

  async function onChange(e) {
    e.preventDefault();
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      );
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function thumbnailUpload(e) {
    e.preventDefault();
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (thumb) => console.log(`received thumbnail: ${thumb}`)
        }
      );
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setthumbnailUrl(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function createMarket() {
    const { name, description, price, alternettext } = formInput;
    if (!name || !description || !price ) {
      setAlertMsg("Please Fill All Fields");
      setOpen(true);
      return;
    }
    setmodelmsg("Transaction 1 in  progress");
    setmodel(true);

    let thumbnailimage="";
    /* first, upload to IPFS */
    if(thumbnailUrl)
    {
      thumbnailimage = `ipfs://${thumbnailUrl.substr(28, 71)}`;
    }
    let img = '';
    if(fileUrl)
    img=`ipfs://${fileUrl.substr(28, 71)}`;
    const data = JSON.stringify({
      name, description, image: {img}, thumbnailimage, alternettext, attributes, categories,
    })
    try {
      const added = await client.add(data)
      const ipfsHash = added.path;
      const url = `ipfs://${added.path}`

      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createItem(ipfsHash, url)
    } catch (error) {
      setmodelmsg("Transaction failed");
      console.log('Error uploading file: ', error)
    }
  }

  async function createItem(ipfsHash, url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* next, create the item */
    let contract = new ethers.Contract(creatifyAddress, Creatify.abi, signer)
    console.log("ipfs://" + ipfsHash);

    try {
      let transaction = await contract.createArtifact(url);
      let tx = await transaction.wait();
      setmodelmsg("Transaction 1 Complete");
      let event = tx.events[0]
      let value = event.args[2]
      let tokenId = value.toNumber()
      const price = ethers.utils.parseUnits(formInput.price, 'ether')
      await listItem(transaction, contract, tokenId, price, signer);
    } catch (e) {
      console.log(e);
      setmodelmsg("Transaction 1 failed");
      return;
    }

    /* then list the item for sale on the marketplace */
    // contract = new ethers.Contract(marketplaceAddress, Marketplace.abi, signer)
    // transaction = await contract.createMarketItem(creatifyAddress, tokenId, price)
    // await transaction.wait()
    router.push('/home')
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
        creatifyAddress,
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
  const [opendrop, Setopendrop] = useState(false);
  const [advancemenu, Setadvancemenu] = useState(false);


  const [attributes, setInputFields] = useState([
    { id: uuidv4(), display_type: '', trait_type: '', value: '' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("attributes", attributes);
  };

  const handleChangeInput = (id, event) => {
    const newInputFields = attributes.map((i) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value
      }
      return i;
    })

    setInputFields(newInputFields);
  }

  const handleAddFields = () => {
    setInputFields([...attributes, { id: uuidv4(), display_type: '', trait_type: '', value: '' }])
  }

  const handleRemoveFields = (id) => {
    const values = [...attributes];
    values.splice(values.findIndex((value) => value.id === id), 1);
    setInputFields(values);
  }

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
  }

  const walletAddr = useSelector(selectUser);
  // console.log(walletAddr);
  // console.log(walletAddr?walletAddr[0]:"");
  var wallet = walletAddr ? walletAddr[0] : "";

  const [hasRole, setHasRole] = useState(true);

  useEffect(async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(creatifyAddress, Creatify.abi, signer);
    setHasRole(await contract.hasRole(await contract.CREATIFY_CREATOR_ROLE(), wallet))

  }, []);


  const authorize = async () => {
    const { data } = await axios.get(
      `${BASE_URL}/api/v1.0/flowid?walletAddress=${wallet}`
    );
    // console.log(data);

    let web3 = new Web3(Web3.givenProvider);
    let completemsg = data.payload.eula + data.payload.flowId;
    // console.log(completemsg);
    const hexMsg = convertUtf8ToHex(completemsg);
    // console.log(hexMsg);
    const result = await web3.eth.personal.sign(hexMsg, wallet);
    // console.log(result);

    var signdata = JSON.stringify({
      flowId: data.payload.flowId,
      signature: result,
    })

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
      getRole();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const getRole = async () => {

    const token = localStorage.getItem('platform_token');

    const config1 = {
      url: `${BASE_URL}/api/v1.0/roleId/0x01b9906c77d0f3e5e952265ffbd74a08f1013f607e72528c5c1fbaf8f36e3634`,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
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
    })

    const config = {
      url: `${BASE_URL}/api/v1.0/claimrole`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
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
  }

  const [options, setOptions] = useState(["Art", "Music", "Sports", "Video", "Cartoon", "Others"]);
  const [categories, setCategory] = useState([]);


  if (!hasRole) {
    const loader = setTimeout(() => {
      router.push('/profile')
    }, 1000);
    loader;
  }
  
  // return (
  //   <Layout>
  //      <div className="dark:bg-gray-800" style={{ minHeight: '100vh' }}>
  //      <div>
  //                   <h3 className="text-2xl text-center font-semibold pb-1 pt-20  pl-5 pr-5">You do not have the required Role. Please click on Get creator role button to proceed.</h3>
  //                   <div className="flex justify-center">
  //                       <button
  //                           onClick={authorize}
  //                           className="bg-blue-800 uppercase shadow-md transition duration-300  
  //                           ease-in text-white font-bold hover:bg-white hover:text-blue-800 px-6 rounded py-2 mt-2">Get creator role</button>
  //                   </div>
  //                 </div>
  //       </div>
  //   </Layout>
  // )
  return (
    <Layout>
      <div className="bg-[#d0d1de] w-full">
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

          <div className="max-w-[1200px] mx-auto myshadow rounded">
            {/* <div className="h-64 w-full bg-blue-600 overflow-hidden relative" >
            <img src="https://images.unsplash.com/photo-1503264116251-35a269479413?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" alt="" className="bg w-full h-full object-cover object-center absolute z-0" />
            <div className="flex flex-col justify-center items-center relative h-full bg-black bg-opacity-50 text-white">
              <h1 className="text-2xl font-semibold">CREATE YOUR ASSET</h1>
            </div>
          </div> */}
            <div className="bg-white dark:bg-gray-800">
              <div className="">
                <div className="p-4">
                  <form action="#">
                    <h3 className="text-3xl py-4 font-semibold">
                      Create Asset
                    </h3>
                    <input
                      placeholder="Asset Name"
                      className="w-full rounded-md p-3 bg-white  dark:bg-gray-900 outline-none mb-4 border-[1px] border-[#d5d5d6]"
                      onChange={(e) =>
                        updateFormInput({ ...formInput, name: e.target.value })
                      }
                    />

                    <div className="">
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
                    <div className="p-8 border-[1px] rounded-md border-[#d5d5d6]">
                      <div className="w-full rounded-md bg-white dark:bg-gray-900">
                        <div className="w-full">
                          <div
                            className={
                              fileUrl
                                ? "h-auto w-full border-4 rounded-md"
                                : "h-80 w-full rounded-md border-2 border-dashed hover:border-[#286efa] bg-white dark:bg-gray-900"
                            }
                          >
                            <div className="relative h-full">
                              {/* {fileUrl ? <img src={fileUrl} alt="" className="w-full h-72 flex justify-center" /> : <p className="flex justify-center upload_p">Upload file to preview your brand new NFT</p>} */}
                              {fileUrl ? (
                                <img
                                  src={fileUrl}
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
                                      id="default_btn"
                                    />
                                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                                      <span className='flex items-center justify-center'>
                                        <FiFile className="text-4xl" />
                                      </span>
                                      <h1 className="text-lg font-semibold">
                                        Drag file here to upload
                                      </h1>
                                      <p className="text-[#6a6b76]">
                                        Alternatively, you can select a file by
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
                        <div className="">
                          {/* <button
                          onClick={(e) => filepicker(e)}
                          className=" dark:bg-gray-500 hover:bg-purple-300 py-2 px-4 rounded-md text-white"
                        >
                          Choose File
                        </button> */}
                        </div>
                      </div>
                    </div>
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

              {!fileUrl && (
                <div>
                              <div className='flex mt-10 font-semibold text-md'>
                                {/* <img className="w-96 align-middle pt-3" src="/asset.svg"></img> */}
                                <p className="text-md mt-2">Choose a PNG image for thumbnail .&nbsp;</p>
                                <input
                                  type="file"
                                  name="Asset"
                                  onChange={thumbnailUpload}
                                  id="thumbnail_btn"
                                  hidden
                                />
                                <button
                                  onClick={(e) => thumbnailpicker(e)}
                                  className="upload_color bg-purple-500 dark:bg-gray-500 hover:bg-purple-300 px-2 py-1 rounded-md text-white"> Choose File</button>
                              </div>
                              <div className={thumbnailUrl ? "h-auto w-1/2 mt-4 rounded-md" : "h-60 w-1/2 mt-4 rounded-md bg-white dark:bg-gray-900 justify-center items-center"}>

                                {thumbnailUrl ? (
                                  <img
                                    src={thumbnailUrl}
                                    alt=""
                                    className=""
                                  />
                                ) : (
                                  <p className="">
                                    Upload file to preview the thumbnail.
                                  </p>
                                )}

                              </div>
                              </div>)}
              <button
                onClick={createMarket}
                className="bg-[#2e44ff] rounded-xl dark:bg-black text-white py-4 px-8 mb-8"
              >
                Create digital artifact
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}