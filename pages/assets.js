import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import Multiselect from "multiselect-react-dropdown";
import '../node_modules/primeicons/primeicons.css';
import '../node_modules/primereact/resources/themes/lara-dark-indigo/theme.css';
import '../node_modules/primereact/resources/primereact.css';
import { InputNumber } from 'primereact/inputnumber';
import Web3Modal from "web3modal";

const YOUR_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDFFODE2RTA3RjBFYTg4MkI3Q0I0MDQ2QTg4NENDQ0Q0MjA4NEU3QTgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MzI0NTEzNDc3MywibmFtZSI6Im5mdCJ9.vP9_nN3dQHIkN9cVQH5KvCLNHRk3M2ZO4x2G99smofw";
const client = new NFTStorage({ token: YOUR_API_KEY });
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
import StoreFront from "../artifacts/contracts/StoreFront.sol/StoreFront.json";
import BuyAsset from "../Components/buyAssetModal";
import { Alert, Snackbar } from "@mui/material";
import Layout from "../Components/Layout";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import { NFTStorage } from "nft.storage";
import Image from "next/image";
import etherContract from "../utils/web3Modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
const storeFrontAddress = process.env.NEXT_PUBLIC_STOREFRONT_ADDRESS;
export default function CreateItem() {
  const [toggle, setToggle] = useState(false);
  const [toggleinput, setToggleInput] = useState(false);
  const [auctionToggle, setAuctionToggle] = useState(false);
  const [show, setShow] = useState(false);
  const handleClos = () => setShow(false);
  const handleShow = () => setShow(true);
  const [model, setmodel] = useState(false);
  const [modelmsg, setmodelmsg] = useState("Transaction in progress!");
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const [mediaHash, setMediaHash] = useState({
    image: "",
    audio: "",
    video: "",
    animation_url: "",
    doctype: "",
  });
  const [previewMedia, setpreviewMedia] = useState("");
  const [addImage, setAddImage] = useState(false);
  const [formInput, updateFormInput] = useState({
    price: 0,
    name: "",
    description: "",
    alternettext: "",
    royalties: 5,
    auctionTime:2
  });

  const router = useRouter();
  async function uploadBlobGetHash(file) {
    try {
      const blobDataImage = new Blob([file]);
      const metaHash = await client.storeBlob(blobDataImage);
      return metaHash;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  const getMetaHashURI = (metaHash) => `ipfs://${metaHash}`;
  async function onChangeThumbnail(e) {
    const file = e.target.files[0];
    const thumbnail = new File([file], file.name, {
      type: file.type,
    });
    try {
      const metaHash = await uploadBlobGetHash(thumbnail);
      const metaHashURI = getMetaHashURI(metaHash);
      setMediaHash({ ...mediaHash, image: metaHashURI });
      setPreviewThumbnail(URL.createObjectURL(e.target.files[0]));
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function onChangeMediaType(e) {
    const file = e.target.files[0];
    const { name, type } = file;
    const fileType = type.split("/")[0];
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    const fileData = new File([file], name, {
      type: type,
    });
    if (addImage && fileType == "image") {
      setAddImage(false);
    }
    if (!validImageTypes.includes(type)) {
      setAddImage(true);
    }
    try {
      const metaHash = await uploadBlobGetHash(fileData);
      const metaHashURI = getMetaHashURI(metaHash);
      if (fileType == "audio" || fileType == "video" || fileType == "doctype") {
        setMediaHash({
          ...mediaHash,
          [fileType]: metaHashURI,
          animation_url: metaHashURI,
        });
      } else {
        setMediaHash({ ...mediaHash, [fileType]: metaHashURI });
      }
      console.log("file data", fileData);
      setpreviewMedia(URL.createObjectURL(e.target.files[0]));
    } catch (error) {
      console.log("Error uploading vedio: ", error);
    }
  }

  function createMarket(e) { //store
    e.preventDefault();
    e.stopPropagation();
    const { name, description, price, alternettext,auctionTime } = formInput;
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
      tags,
      auctionTime

    };

    if (!mediaHash?.image) {
      setAlertMsg("Image is required to create asset");
      setOpen(true);
      return;
    }

    setmodelmsg("Transaction 1 in  progress");
    setmodel(true);

    const data = JSON.stringify({ ...assetData, ...mediaHash });
    console.log("Asset Data before create", data);
     console.log("auction time",assetData,data,assetData.auctionTime)
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
        package: WalletConnectProvider, 
        options: options,
      },
    };
    /* next, create the item */
    const web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions,
      network: "testnet",
      version: "mumbai",
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(
      storeFrontAddress,
      StoreFront.abi,
      signer
    );
    console.log("ipfs://" + ipfsHash);    try {
    console.log('assets crete ',url, formInput.royalties*100)
      let transaction = await contract.createAsset(url, formInput.royalties*100);//500 - royalites dynamic
      let tx = await transaction.wait();
      console.log("transaction", transaction);
      setmodelmsg("Transaction 1 Complete");
      let event = tx.events[0];
      let value = event.args[2];
      let tokenId = value.toNumber();
      const price = ethers.utils.parseUnits(formInput.price, "ether");
      const forAuction = false, endTime=0;
      
      await listItem(transaction, contract, tokenId, price, forAuction, signer, endTime);//Putting item to sale
    } catch (e) {
      console.log(e);
      setmodelmsg("Transaction 1 failed");
      return;
    }
    /* then list the item for sale on the marketplace */
    router.push("/explore");

  }
  const listItem = async (transaction, contract, tokenId, price, forAuction, signer,endTime) => {
    try {
      setmodelmsg("Transaction 2 in progress");
      contract = new ethers.Contract(
        marketplaceAddress,
        Marketplace.abi,
        signer
      );
      transaction = await contract.listItem(
        storeFrontAddress,
        tokenId,
        price,
        forAuction,
        endTime
        //putting for sale/auction
         //number time in minutes always
      );

      await transaction.wait();
      console.log("transaction completed");
      setmodelmsg("Transaction 2 Complete !!");
    } catch (e) {
      console.log(e);
      setmodelmsg("Transaction 2 failed");
    } finally {
      setpreviewMedia("");
      setAddImage("");
      setPreviewThumbnail("");
    }
  };
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
  const [alertMsg, setAlertMsg] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const walletAddr = useSelector(selectUser);
  var wallet = walletAddr ? walletAddr[0] : "";

  const [hasRole, setHasRole] = useState(false);

  useEffect(() => {
    const asyncFn = async () => {
      const contract = await etherContract(storeFrontAddress,StoreFront.abi)
      const hasCreatorRole = await contract.hasRole(await contract.STOREFRONT_CREATOR_ROLE(), wallet)
      setHasRole(hasCreatorRole)
      console.log("hasCreatorRole",hasCreatorRole);
        if (hasCreatorRole) {
          router.push('/assets')
      } else {
        router.push('/authWallet')
      }
    };
    asyncFn();
  }, []);

  const [options1, setOptions] = useState([
    "Image",
    "Music",
    "Video",
    "Document",
    "Others",
  ]);
  const [options2, setOptions2] = useState([
    "colection of special tags",
    " “lo-fi hip hop”, “texas blues”, “guitar shredding”, “solo piano”, “relaxing music” ",
    "Your video's title, thumbnail, and description are more important pieces of metadata for your video's discovery.",
    "document tags are integrated into text document and they are actually a set of directions which directs a browser what to do and what props to use.",
    "Others",
  ]);
  const [categories, setCategory] = useState([]);
  const [tags, setTags] = useState([]);

  // if (!hasRole) {
  //    setTimeout(() => {
  //     router.push("/profile");
  //   }, 1000);
  // }

  return (
    <Layout title="Assets"description="This is used to create NFTs">
      <div className="body-back">
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

               <div className="font-bold text-4xl easy-way ">
                <div>Effective
                Efficient
                Easy Way To create NFT
                </div>
              </div>
              <div className="flex justify-around mt-28">
                <div>
                <h3 className="text-3xl py-4 font-bold text-center text-gray-500 dark:text-white">
                Create New NFT
              </h3>
                </div>
                <div className="text-3xl py-4 font-bold text-center text-gray-500 dark:text-white">preview</div>
              </div>
              
              <div className="flex justify-evenly">
          <div className=" w-3/6 p-9 overflow-y-scroll ...">
           
            <div 
            >
              <div>
                <div>
                  <div className="mt-5">
                    <input
                      required="required"
                      placeholder="Asset Name"
                      className="w-full rounded-md bg-white  dark:bg-gray-900 p-3 outline-none mb-4 border-[1px] border-[#d5d5d6] text-gray-600"
                      onChange={(e) =>
                        updateFormInput({
                          ...formInput,
                          name: e.target.value,
                        })
                      }
                    />

                    <div>
                      <textarea
                        type="text"
                        placeholder="Asset Description"
                        className="w-full bg-white  dark:bg-gray-900 rounded-md shadow-sm p-2 outline-none border-[1px] border-[#d5d5d6] mb-4 text-gray-600"
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="text-md font-semibold mt-6 text-gray-500 dark:text-white">
                   Creator Royalties
                  <span className="text-gray-400 text-gray-500 dark:text-white">*</span>
                </div>
                <input type="number"
                  value={formInput.royalties} // value * 100
                  suffix="%"
                  
                  mode="decimal"
                  className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900  "
                  showButtons
                  onChange={(e) =>{
                    updateFormInput({
                      ...formInput,
                      royalties: e.target.value,
                    })
                    
                   
                  }
                }
                />
                  </div>
                  <div className="flex justify-around">
                    <div className="font-bold  mt-5 text-gray-500 dark:text-white">Upload File</div>
                  </div>
                  <div className="flex gap-6">
                    <div className=" rounded-lg text-center p-3 border-2 border-indigo-600 ...mt-20 text-gray-500 dark:text-white w-full">
                      <h1 className="text-lg font-semibold">
                        Drag File Here to Upload
                      </h1>
                      <div className="text-gray-500 dark:text-white">
                        PNG,GIF,WEBP,MP4,or MP3
                        <br />
                        <div className="flex text-black mt-3 cursor-pointer rounded-lg bg-slate-300 p-2.5 m-auto w-full">
                          <input
                            type="file"
                            accept="image/png, image/jpeg,.txt,.doc,video/mp4,audio/mpeg,.pdf"
                            onChange={(e) => onChangeMediaType(e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {addImage && (
                    <>
                      <div className="flex justify-between">
                        <div className="font-bold  mt-5 text-left text-gray-500 dark:text-white">
                          Upload Preview Image
                        </div>
                        <div className="font-bold  mt-5 text-left text-gray-500 dark:text-white">Priview</div>
                      </div>
                      <div className="flex gap-6">
                        <div className="   rounded-xl border-dashed border-2 border-indigo-600 ... text-center p-3 w-96 ... mt-3">
                          <h1 className="text-lg font-semibold text-gray-500 dark:text-white">
                            Drag File Here to Upload
                          </h1>
                          <div className="text-gray-500 dark:text-white">
                            PNG, JPG, or GIF
                            <br />
                            <div className=" text-black mt-3 cursor-pointer rounded-xl p-2.5 m-auto w-full bg-slate-300">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => onChangeThumbnail(e)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="   rounded-xl border-dashed border-2 border-indigo-600 ... text-center p-3 w-96 ... mt-3">
                          <div className="text-[#6a6b76]">
                            <div className=" text-black mt-3 cursor-pointer rounded-xl p-2.5 m-auto w-full ">
                              {previewThumbnail && (
                                <Image alt="alt" width="200" height="200" src={previewThumbnail} />
                              )}
                              <div />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </div>
              <div className="w-full py-6">
                <div className="flex justify-between">
                  <div>
                    <div className="text-lg font-bold mt-6 text-gray-500 dark:text-white">Properties</div>
                  </div>
                  <div
                    onClick={handleShow}
                    className="mt-7   h-10 p-1.5 border-solid border-2 border-solid-600 ... rounded-lg cursor-pointer text-gray-500 dark:text-white"
                  >
                    Add Properties
                  </div>

                  <Modal
                    open={show}
                    onClose={handleClos}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style} className="text-center bg-black border-[1px] bg-white dark:bg-[#13131a] dark:border-[#bf2180] border-[#eff1f6]" >
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        className="text-center "
                      >
                        <div className="flex justify-between text-gray-500 dark:text-white">
                          <div>Add Properties</div>
                          <div >
                            <Image
                              className="w-3 h-3 text-white"
                              onClose={handleClos}
                              img
                              src="/cross.png"
                              width="200"
                              height="200"
                              alt="alt"
                            />
                          </div>
                        </div>
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <div className="text-gray-500 dark:text-white">
                          Properties Show Up Underneath Your Item, are
                          Clickable, and Can be Filtered in Your
                          Collection&apos;s Sidebar.
                        </div>
                        <div className="flex justify-between text-gray-500 dark:text-white">
                          <div className="font-bold">Type</div>
                          <div className="font-bold">Name</div>
                        </div>
                        <form onSubmit={handleSubmit}>
                          {attributes.map((inputField) => (
                            <div key={inputField.id}>
                              <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4 pb-2 text-gray-600 align-center">
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
                                  className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900 text-gray-600"
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
                                  className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900 text-gray-600"
                                  variant="filled"
                                  value={inputField.value}
                                  onChange={(event) =>
                                    handleChangeInput(inputField.id, event)
                                  }
                                />
                                <div>
                                  <button
                                    disabled={attributes.length === 1}
                                    onClick={() =>
                                      handleRemoveFields(inputField.id)
                                    }
                                    className="text-left mt-5 p-2.5 rounded-lg  bg-slate-300 text-gray-500 dark:text-white flex justify-center"
                                  >
                                    <FaMinusSquare className="text-red-600" />
                                  </button>
                                </div>

                                <div>
                                  <button
                                    className="text-left mt-5 p-2.5 rounded-lg  bg-slate-300 text-gray-500 dark:text-white flex justify-center"
                                    onClick={handleAddFields}
                                  >
                                    <FaPlusSquare className="text-green-600" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </form>
                      </Typography>
                      <div className="mt-5" onClick={handleSubmit}>
                        <button className="bg-blue-500 hover:bg-blue-700 text-gray-500 dark:text-white font-bold py-2 px-4 rounded w-full">
                          Save
                        </button>
                      </div>
                    </Box>
                  </Modal>
                </div>
                <div className="text-md font-semibold mt-6 text-gray-500 dark:text-white">
                  {" "}
                  Alternative Text for NFT{" "}
                  <span className="text-gray-400 text-gray-500 dark:text-white">(Optipnal) </span>
                </div>
                <input
                  placeholder="NFT description in details"
                  className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900  "
                  onChange={(e) =>
                    updateFormInput({
                      ...formInput,
                      alternettext: e.target.value,
                    })
                  }
                />

                <div className="font-semibold text-lg my-6 text-gray-500 dark:text-white">Category</div>
                <Multiselect
                  isObject={false}
                  onRemove={(event) => {
                    setCategory(event);
                  }}
                  onSelect={(event) => {
                    setCategory(event);
                  }}
                  options={options1}
                  selectedValues={[]}
                  showCheckbox
                  className=" bg-white  dark:bg-gray-900 text-gray-500 dark:text-white"
                />
              </div>
              <div className="font-semibold text-lg my-6 text-gray-500 dark:text-white">Tags</div>
              <Multiselect
                isObject={false}
                onRemove={(event) => {
                  setTags(event);
                }}
                onSelect={(event) => {
                  setTags(event);
                }}
                options={options2}
                selectedValues={[]}
                showCheckbox
                className="bg-white  dark:bg-gray-900 text-gray-500 dark:text-white"
              />
              <div className="flex justify-between mt-5">
                <div className="text-left">
                  <div className="font-bold text-3xl text-gray-500 dark:text-white">Put on Marketplace</div>
                  <div className="text-gray-500 dark:text-white">Enter price to Allow Users Instantly Buy your NFT </div>
                </div>

                <input
                  className="h-5 w-5 "
                  onClick={() => {
                    setToggle(!toggle);
                  }}
                  type="checkbox"
                />
              </div>
              {toggle && (
                <div className="flex text-gray-500 dark:text-white justify-between">
                <div className="flex mt-3 gap-6 border-[1px] border-[#d5d5d6] rounded-xl p-3"  onClick={() => {
                  setAuctionToggle(false);
                  setToggleInput(!toggleinput);
                }}> Direct Sale</div>
                 <div className="flex mt-3 gap-6 border-[1px] border-[#d5d5d6] rounded-xl p-3"  onClick={() => {
                   setToggleInput(false);
                  setAuctionToggle(!auctionToggle);
                }}>Auction</div>
                </div>
              )}


             {toggleinput && (
                <div className="flex mt-3 gap-6 ">
                 
              <input type="number" className="w-full p-2"  placeholder="Asset Price in Matic"  onChange={(e) =>
                      updateFormInput({
                        ...formInput,
                        price: e.target.value,
                      })}/>

                  
                </div>
              )}

              {auctionToggle && (
                <div className="flex mt-3 gap-6 ">
                 
                   <input type="number" className="w-full p-2"  placeholder="Asset Price in Matic"  onChange={(e) =>
                      updateFormInput({
                        ...formInput,
                        price: e.target.value,
                      })}/>

                  
                   <InputNumber className="w-full p-2" placeholder="Auction Duration"  inputId="expiry" suffix=" minutes" onValueChange={(e) =>
                      updateFormInput({
                        ...formInput,
                        auctionTime: e.target.value,
                      })} mode="decimal" showButtons min={0} max={100} />
                </div>
              )}

              <div className="flex justify-between p-5">
                <div>
                  <button
                    onClick={(e) => createMarket(e)}
                    className="bg-white  dark:bg-gray-900 rounded-xl dark:bg-black text-gray-500 dark:text-white py-3 px-3 mb-8 "
                  >
                    Create  Assets
                  </button>
                </div>
              </div>
            </div>
        
        
          </div>

          <div className=" rounded-lg text-center p-3 border-2 border-indigo-600 ...mt-20 w-1/5" style={{height:"450px"}}>
                      <div className="flex text-black mt-3 cursor-pointer rounded-lg  p-2.5 m-auto w-full">
                        {previewMedia ? (
                          mediaHash?.image && addImage == false ? (
                            <Image
                              src={previewMedia}
                              alt="assets2"
                              className="w-full object-cover h-72 flex justify-center"
                              width="200"
                              height="200"
                            />
                          ) : mediaHash?.video ? (
                            <video autoPlay controls>
                              <source src={previewMedia}></source>
                            </video>
                          ) : mediaHash?.audio ? (
                            <audio autoPlay controls>
                              <source src={previewMedia}></source>
                            </audio>
                          ) : mediaHash?.doctype ? (
                            <input file={previewMedia} alt="" />
                          ) : null
                        ) : (
                          <div />
                        )}
                      </div>
                    </div>
          </div>
         
               
        </div>
      </div>
    </Layout>
  );
}
