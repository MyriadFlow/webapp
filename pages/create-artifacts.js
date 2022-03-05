/* pages/create-artifacts.js */
import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { MdOutlineColorLens } from "react-icons/md"
import { CgGhostCharacter } from "react-icons/cg"
import { FaVideo, FaPlusSquare, FaMinusSquare, FaHeart } from "react-icons/fa"
import { MdSportsVolleyball } from "react-icons/md"
import { MdMusicNote } from "react-icons/md"
import { RiArrowDropDownLine } from "react-icons/ri";
import { v4 as uuidv4 } from 'uuid';
import Multiselect from "multiselect-react-dropdown";
import Layout from "../Components/Layout";


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  creatifyAddress, marketplaceAddress
} from '../config'

import Creatify from '../artifacts/contracts/Creatify.sol/Creatify.json'
import Marketplace from '../artifacts/contracts/Marketplace.sol/Marketplace.json'
import Header from '../Components/Header'
import Footer from "../Components/Footer"
import BuyAsset from "../Components/buyAssetModal";
import { Alert, Snackbar } from "@mui/material";

export default function CreateItem() {

  const [model, setmodel] = useState(false);
  const [modelmsg, setmodelmsg] = useState("Transaction in progress!");

  const filepicker = (e) => {
    e.preventDefault();
    const default_btn = document.querySelector("#default_btn");
    default_btn.click()
  };


  const [fileUrl, setFileUrl] = useState(null)
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
  async function createMarket() {
    const { name, description, price, alternettext } = formInput;
    if (!name || !description || !price || !fileUrl) {
      setAlertMsg("Please Fill All Fields");
      setOpen(true);
      return;
    }
    setmodelmsg("Transaction 1 in  progress");
    setmodel(true);

    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: `ipfs://${fileUrl.substr(28, 71)}`, alternettext, attributes, categories
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

  const [options, setOptions] = useState(["Art", "Music", "Sports", "Video", "Cartoon", "Others"]);
  const [categories, setCategory] = useState([]);


  return (
    <Layout>
    <div className="dark:bg-gray-800" style={{ minHeight: '100vh' }}>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {alertMsg}
        </Alert>
      </Snackbar>
      {model && <BuyAsset open={model} setOpen={setmodel} message={modelmsg} />}

      <div className="w-full relative lg:mt-16 shadow-2xl rounded  overflow-hidden mt-0">
        <div className="h-64 w-full bg-blue-600 overflow-hidden relative" >
          <img src="https://images.unsplash.com/photo-1503264116251-35a269479413?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" alt="" className="bg w-full h-full object-cover object-center absolute z-0" />
          <div className="flex flex-col justify-center items-center relative h-full bg-black bg-opacity-50 text-white">
            <h1 className="text-2xl font-semibold">CREATE YOUR ASSET</h1>
          </div>
        </div>
        <div className="grid grid-cols-10 bg-white dark:bg-gray-800">



          <div className="col-span-12 md:border-solid md:border-r md:border-black md:border-opacity-25 h-full md:col-span-6">
            <div className="lg:p-16 pt-10 p-4">
              <form action="#" className="flex flex-col space-y-8">

                <div>
                  <h3 className="text-2xl font-semibold pb-1">Your Asset Information</h3>
                  <hr />
                </div>

                <input
                  placeholder="Asset Name"
                  className="mt-8 w-full input_background  rounded-md p-3 bg-white  dark:bg-gray-900 outline-none shadow-sm"
                  onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
                />

                <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">

                  <div className="form-item w-full">
                    <textarea type="text" placeholder="Asset Description" className="w-full input_background bg-white  dark:bg-gray-900 rounded-md shadow-sm p-3 outline-none "
                      onChange={(e) => updateFormInput({ ...formInput, description: e.target.value })}
                    />
                  </div>

                  <div className="form-item w-full">
                    <input type="text" placeholder="Asset Price in Eth" className="w-full input_background bg-white dark:bg-gray-900 rounded-md shadow-sm p-3 outline-none "
                      onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold pb-1">Upload File</h3>
                  <hr />
                </div>

                <div className="w-full flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                  <div className="w-full rounded-md  mt-6 upload flex justify-center bg-white dark:bg-gray-900 ">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-md mb-3 upload_p pl-2">PNG, GIF, WEBP, MP4 or MP3. Max 100mb.</p>
                      <input
                        type="file"
                        name="Asset"
                        classsName="ml-32"
                        onChange={onChange}
                        id="default_btn"
                        hidden
                      />
                      <button
                        onClick={(e) => filepicker(e)}
                        className="upload_color bg-purple-500 dark:bg-gray-500 hover:bg-purple-300 py-2 px-4 rounded-md text-white">Choose File</button>
                    </div>
                  </div>
                  <div className="w-full pt-10 lg:pt-0 md:pt-0" style={{ marginTop: -20 }}>
                    <p className="text-lg font-semibold dark:text-white">Preview</p>
                    <div className={fileUrl ? "h-auto w-full mt-4 rounded-md upload" : "h-80 w-full mt-4 rounded-md upload bg-white dark:bg-gray-900 flex justify-center items-center"}>

                      {/* {fileUrl ? <img src={fileUrl} alt="" className="w-full h-72 flex justify-center" /> : <p className="flex justify-center upload_p">Upload file to preview your brand new NFT</p>} */}
                      {fileUrl ? (
                        <img
                          src={fileUrl}
                          alt=""
                          className="w-full h-72 flex justify-center"
                        />
                      ) : (
                        <p className="flex justify-center upload_p">
                          Upload file to preview your brand new NFT
                        </p>
                      )}

                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="col-span-12 w-full px-8 py-6 justify-center flex space-x-4 md:space-x-0 md:space-y-4 flex-col md:col-span-4 md:justify-start ">

            <div className="bg-gray-100 shadow-sm cursor-pointer  mt-10 p-4 flex justify-center hover:shadow-xl border-2 border-gray-300 rounded-xl font-semibold text-md  dark:bg-gray-800 border-dashed "
              onClick={() => Setadvancemenu(!advancemenu)}
            >
              {advancemenu ? " Hide advanced menu" : "Show advanced menu"}
            </div>

            {advancemenu && (
              <div>
                <p className="text-md font-semibold mt-6">{" "} Properties <span className="text-gray-400">(Optipnal) </span></p>
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
                          onChange={(event) => handleChangeInput(inputField.id, event)}
                        />
                        <input
                          name="trait_type"
                          label="Last Name"
                          placeholder="Trait type"
                          className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900"
                          variant="filled"
                          value={inputField.trait_type}
                          onChange={(event) => handleChangeInput(inputField.id, event)}
                        />
                        <input
                          name="value"
                          type="number"
                          label="First Name"
                          placeholder="Value"
                          className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900"
                          variant="filled"
                          value={inputField.value}
                          onChange={(event) => handleChangeInput(inputField.id, event)}
                        />

                        <button disabled={attributes.length === 1} onClick={() => handleRemoveFields(inputField.id)}>
                          <FaMinusSquare style={{ color: 'red' }} />
                        </button>
                        <button
                          onClick={handleAddFields}
                        >
                          <FaPlusSquare style={{ color: 'green' }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </form>




                <p className="text-md font-semibold mt-6"> Alternative text for NFT <span className="text-gray-400">(Optipnal) </span></p>
                <input
                  placeholder="Image description in details"
                  className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900  "
                  onChange={(e) => updateFormInput({ ...formInput, alternettext: e.target.value })}
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
                      background: '#42C2FF',
                      color: 'white',
                    },
                  }}

                />

                {/* <div
                  onClick={() => Setopendrop(!opendrop)}
                  className="flex items-center cursor-pointer justify-between border-b-2 shadow-sm p-2 px-4 group mt-8">
                  <p className="font-semibold text-lg">Category</p>
                  <RiArrowDropDownLine className="h-8 w-8 text-gray-400 group-hover:text-black" />
                </div>
                {opendrop && <div className=" shadow-md rounded-b-md">

                  <div className="flex items-center p-2  px-8 space-x-2 group hover:bg-gray-200 cursor-pointer">
                    <MdOutlineColorLens className="h-8 w-8 text-gray-400" />
                    <p className="text-md  text-gray-500 font-bold group-hover:text-black">Art</p>
                  </div>

                  <div className="flex items-center p-2  px-8 space-x-2 group hover:bg-gray-200 cursor-pointer">
                    <MdMusicNote className="h-8 w-8 text-gray-400" />
                    <p className="text-md  text-gray-500 font-bold group-hover:text-black">Music</p>
                  </div>

                  <div className="flex items-center p-2  px-8 space-x-2 group hover:bg-gray-200 cursor-pointer">
                    <MdSportsVolleyball className="h-8 w-8 text-gray-400" />
                    <p className="text-md  text-gray-500 font-bold group-hover:text-black">Sports</p>
                  </div>

                  <div className="flex items-center p-2  px-8 space-x-2 group hover:bg-gray-200 cursor-pointer">
                    <FaVideo className="h-8 w-8 text-gray-400" />
                    <p className="text-md  text-gray-500 font-bold group-hover:text-black">Video</p>
                  </div>
                  <div className="flex items-center p-2  px-8 space-x-2 group hover:bg-gray-200 cursor-pointer">
                    <CgGhostCharacter className="h-8 w-8 text-gray-400" />
                    <p className="text-md  text-gray-500 font-bold group-hover:text-black">Cartoon</p>
                  </div>
                  <div className="flex items-center p-2  px-8 space-x-2 group hover:bg-gray-200 cursor-pointer">
                    <FaHeart className="h-6 w-6 text-gray-400 mx-1" />
                    <p className="text-md  text-gray-500 font-bold group-hover:text-black">Others</p>
                  </div>
                </div>} */}

              </div>)}

            <div className='flex items-center justify-center'>
              <img className="w-96 align-middle pt-3" src="/asset.svg"></img>
            </div>
          </div>



        </div>
        <div className='flex items-center justify-center mt-4 lg:mb-12 md:mb-12'>
          <button onClick={createMarket} className="bg-blue-500 dark:bg-black text-white py-4 px-8 w-full md:w-1/3 mt-2 md:mt-3 lg:rounded-md md:rounded-md">
            Create Digital Artifact
          </button>
        </div>
      </div>
    </div>
    </Layout>
  )
}