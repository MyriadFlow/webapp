/* pages/create-artifacts.js */
import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { MdOutlineColorLens } from "react-icons/md"
import { CgGhostCharacter } from "react-icons/cg"
import { FaVideo } from "react-icons/fa"
import { MdSportsVolleyball } from "react-icons/md"
import { MdMusicNote } from "react-icons/md"
import { RiArrowDropDownLine } from "react-icons/ri"


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  creatifyAddress, marketplaceAddress
} from '../config'

import Creatify from '../artifacts/contracts/Creatify.sol/Creatify.json'
import Marketplace from '../artifacts/contracts/Marketplace.sol/Marketplace.json'
import Header from '../Components/Header'
import Footer from "../Components/Footer"

export default function CreateItem() {

  const filepicker = () => {
    const default_btn = document.querySelector("#default_btn");
    default_btn.click()
  }


  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }
  async function createMarket() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const ipfsHash = added.path;
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(ipfsHash, url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  async function createSale(ipfsHash, url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* next, create the item */
    let contract = new ethers.Contract(creatifyAddress, Creatify.abi, signer)
    console.log("ipfs://" + ipfsHash);
    let transaction = await contract.createArtifact(url);
    let tx = await transaction.wait();
    let event = tx.events[0]
    let value = event.args[2]

    let tokenId = value.toNumber()
    const price = ethers.utils.parseUnits(formInput.price, 'ether')

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(marketplaceAddress, Marketplace.abi, signer)
    // let listingPrice = await contract.getListingPrice()
    // listingPrice = listingPrice.toString()

    // transaction = await contract.createMarketItem(creatifyAddress, tokenId, price, { value: listingPrice })
    transaction = await contract.createMarketItem(creatifyAddress, tokenId, price)
    await transaction.wait()
    router.push('/')
  }


  const [opendrop, Setopendrop] = useState(false);
  const [advancemenu, Setadvancemenu] = useState(false);


  return (
    <div className="dark:bg-gray-800" style={{ minHeight: '100vh' }}>
      <Header />
      {/* <div className="flex justify-center  text-xl font-semibold tracking-widest mt-50 dark:text-white text-purple-500 border-b-2 font-bold">  <p className="pt-24 pb-4">CREATE ASSET</p></div> */}

      {/* <div className="max-w-5xl mx-auto p-4  flex justify-center flex-col md:flex-row "> */}
        {/* <div className="mt-10 ">
          <p className="text-lg font-semibold dark:text-white">Upload file</p> */}
          {/* <div className="w-full md:w-96 rounded-md h-40  mt-4 upload flex justify-center bg-white dark:bg-gray-900   ">
            <div className="flex  flex-col items-center  ">
              <p className="text-md mt-4 mb-8 upload_p ">PNG, GIF, WEBP, MP4 or MP3. Max 100mb.</p>
              <input
                type="file"
                name="Asset"
                classsName="ml-32"
                onChange={onChange}
                id="default_btn"
                hidden
              />
              <button
                onClick={filepicker}
                className="upload_color bg-purple-500 dark:bg-gray-500 hover:bg-purple-300 py-4 px-6 rounded-md text-white">Choose File</button>
            </div>

          </div> */}

          {/* <div className="flex flex-col dark:text-white">
            <input
              placeholder="Asset Name"
              className="mt-8 w-full md:w-96 input_background  rounded-md p-3 bg-white  dark:bg-gray-900 outline-none shadow-sm"
              onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
            />
            <textarea
              placeholder="Asset Description"
              className=" mt-3 p-2 h-24 dark:bg-gray-900  rounded-md outline-none w-full md:w-96 input_background shadow-sm"
              onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
            />
            <input
              placeholder="Asset Price in Eth"
              className="mt-3 p-3 w-full md:w-96 input_background outline-none rounded-md dark:bg-gray-900 "
              onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
            /> */}

            {/* <div className="bg-gray-100 shadow-sm cursor-pointer  mt-10 p-4 flex justify-center hover:shadow-xl border-2 border-gray-300 rounded-xl font-semibold text-md  dark:bg-gray-800 border-dashed "
              onClick={() => Setadvancemenu(!advancemenu)}
            >
              {advancemenu ? " Hide advanced menu" : "Show advanced menu"}
            </div> */}

            {/* {advancemenu &&
              <div>
                <p className="text-md font-semibold mt-6"> Properties <span className="text-gray-400">(Optipnal) </span></p> */}

                {/* <div className="flex items-center space-x-8">
                  <input
                    placeholder="e.g. Size"
                    className="mt-2 p-3 w-36 md:w-44 text-sm input_background outline-none rounded-md dark:bg-gray-900  "
                    onChange={e => updateFormInput({ ...formInput, properties: e.target.value })}
                  />

                  <input
                    placeholder="e.g. M"
                    className="mt-2 p-3 w-36 md:w-44 text-sm input_background outline-none rounded-md dark:bg-gray-900  "
                    onChange={e => updateFormInput({ ...formInput, properties: e.target.value })}
                  />
                </div> */}




                {/* <p className="text-md font-semibold mt-6"> Alternative text for NFT <span className="text-gray-400">(Optipnal) </span></p>
                <input
                  placeholder="Image description in details"
                  className="mt-2 p-3 w-full md:w-96 text-sm input_background outline-none rounded-md dark:bg-gray-900  "
                  onChange={e => updateFormInput({ ...formInput, alternettext: e.target.value })}
                /> */}


                {/* <div
                  onClick={() => Setopendrop(!opendrop)}
                  className="flex items-center cursor-pointer justify-between border-b-2 shadow-sm p-2 px-4 group mt-8">
                  <p className="font-semibold text-lg">Category</p>
                  <RiArrowDropDownLine className="h-8 w-8 text-gray-400 group-hover:text-black" />
                </div> */}
                {/* {opendrop && <div className=" shadow-md rounded-b-md">

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
                    <p className="text-md  text-gray-500 font-bold group-hover:text-black">Videeo</p>
                  </div>
                  <div className="flex items-center p-2  px-8 space-x-2 group hover:bg-gray-200 cursor-pointer">
                    <CgGhostCharacter className="h-8 w-8 text-gray-400" />
                    <p className="text-md  text-gray-500 font-bold group-hover:text-black">Cartoon</p>
                  </div>
                </div>} */}

              {/* </div>} */}


          {/* </div>


        </div> */}

        {/* <div className="mt-10 ml-0 md:ml-4  ">
          <p className="text-lg font-semibold dark:text-white">Preview</p>
          <div className={fileUrl ? "h-auto w-full md:w-96 mt-4 rounded-md upload" : "h-80 w-full md:w-96 mt-4 rounded-md upload bg-white dark:bg-gray-900 "}>

            {fileUrl ? <img src={fileUrl} alt="" className="w-full h-72 flex justify-center" /> : <p className="flex justify-center mt-40 upload_p">Upload file to preview your brand new NFT</p>}


          </div>
          <div class='flex items-center justify-center'>
            <img className="w-64 align-middle pt-3" src="/asset.svg"></img>
          </div>

          <button onClick={createMarket} className="bg-blue-500 dark:bg-black text-white py-4 px-8 w-full mt-2 md:mt-3 rounded-md">
            Create Digital Artifact
          </button>

        </div> */}

      {/* </div> */}






      <div class="w-full relative mt-16 shadow-2xl rounded  overflow-hidden">
        <div class="h-64 w-full bg-blue-600 overflow-hidden relative" >
          <img src="https://images.unsplash.com/photo-1503264116251-35a269479413?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" alt="" class="bg w-full h-full object-cover object-center absolute z-0" />
          <div class="flex flex-col justify-center items-center relative h-full bg-black bg-opacity-50 text-white">
            {/* <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80" class="h-24 w-24 object-cover rounded-full"/> */}
            <h1 class="text-2xl font-semibold">CREATE YOUR ASSET</h1>
            {/* <h4 class="text-sm font-semibold">Joined Since '19</h4> */}
          </div>
        </div>
        <div class="grid grid-cols-10 bg-white dark:bg-gray-800">



          <div class="col-span-12 md:border-solid md:border-r md:border-black md:border-opacity-25 h-full md:col-span-6">
            <div class="p-16 pt-10">
              <form action="#" class="flex flex-col space-y-8">

                <div>
                  <h3 class="text-2xl font-semibold pb-1">Your Asset Information</h3>
                  <hr />
                </div>

                <input
                  placeholder="Asset Name"
                  className="mt-8 w-full input_background  rounded-md p-3 bg-white  dark:bg-gray-900 outline-none shadow-sm"
                  onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                />

                <div class="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">

                  <div class="form-item w-full">
                    <textarea type="text" placeholder="Asset Description" class="w-full input_background bg-white  dark:bg-gray-900 rounded-md shadow-sm p-3 outline-none " 
                    onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                    />
                  </div>

                  <div class="form-item w-full">
                    <input type="text" placeholder="Asset Price in Eth" class="w-full input_background bg-white dark:bg-gray-900 rounded-md shadow-sm p-3 outline-none " 
                    onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <h3 class="text-2xl font-semibold pb-1">Upload File</h3>
                  <hr />
                </div>

                <div class="w-full flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
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
                        onClick={filepicker}
                        className="upload_color bg-purple-500 dark:bg-gray-500 hover:bg-purple-300 py-2 px-4 rounded-md text-white">Choose File</button>
                    </div>
                  </div>
                  <div className="w-full" style={{ marginTop: -20 }}>
                    <p className="text-lg font-semibold dark:text-white">Preview</p>
                    <div className={fileUrl ? "h-auto w-full mt-4 rounded-md upload" : "h-80 w-full mt-4 rounded-md upload bg-white dark:bg-gray-900 flex justify-center items-center"}>

                      {fileUrl ? <img src={fileUrl} alt="" className="w-full h-72 flex justify-center" /> : <p className="flex justify-center upload_p">Upload file to preview your brand new NFT</p>}


                    </div>
                  </div>
                </div>



              </form>
            </div>
          </div>

          <div class="col-span-12 w-full px-8 py-6 justify-center flex space-x-4 md:space-x-0 md:space-y-4 flex-col md:col-span-4 md:justify-start ">

            <div className="bg-gray-100 shadow-sm cursor-pointer  mt-10 p-4 flex justify-center hover:shadow-xl border-2 border-gray-300 rounded-xl font-semibold text-md  dark:bg-gray-800 border-dashed "
              onClick={() => Setadvancemenu(!advancemenu)}
            >
              {advancemenu ? " Hide advanced menu" : "Show advanced menu"}
            </div>

            {advancemenu &&
              <div>
                <p className="text-md font-semibold mt-6"> Properties <span className="text-gray-400">(Optipnal) </span></p>

                <div class="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
                  {/* <div className="flex items-center space-x-8"> */}
                  <input
                    placeholder="e.g. Size"
                    className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900  "
                    onChange={e => updateFormInput({ ...formInput, properties: e.target.value })}
                  />

                  <input
                    placeholder="e.g. M"
                    className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900  "
                    onChange={e => updateFormInput({ ...formInput, properties: e.target.value })}
                  />
                </div>




                <p className="text-md font-semibold mt-6"> Alternative text for NFT <span className="text-gray-400">(Optipnal) </span></p>
                <input
                  placeholder="Image description in details"
                  className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900  "
                  onChange={e => updateFormInput({ ...formInput, alternettext: e.target.value })}
                />


                <div
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
                </div>}

              </div>}

            <div class='flex items-center justify-center'>
              <img className="w-96 align-middle pt-3" src="/asset.svg"></img>
            </div>
          </div>



        </div>
        <div class='flex items-center justify-center mt-4 mb-12'>
          <button onClick={createMarket} className="bg-blue-500 dark:bg-black text-white py-4 px-8 w-full md:w-1/3 mt-2 md:mt-3 rounded-md">
            Create Digital Artifact
          </button>
        </div>
      </div>

<Footer />
    </div>
  )
}