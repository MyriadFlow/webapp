import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Multiselect from "multiselect-react-dropdown";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { confirmAlert } from 'react-confirm-alert'; // Import
import "../node_modules/react-confirm-alert/src/react-confirm-alert.css"
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

// const Web3 = require("web3");
const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;
const storeFrontAddress = process.env.NEXT_PUBLIC_STOREFRONT_ADDRESS;
export default function CreateItem() {
  const [toggle, setToggle] = useState(false);
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
    price: 10,
    name: "",
    description: "",
    alternettext: "",
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
      tags
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
        137: "https://rpc-mumbai.maticvigil.com/v1/f336dfba703440ee198bf937d5c065b8fe04891c",
      },
      rpcUrl:
        "https://rpc-mumbai.maticvigil.com/v1/f336dfba703440ee198bf937d5c065b8fe04891c",
      infuraId: process.env.INFURA_KEY,
    });
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: options,
      },
    };

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
    console.log("ipfs://" + ipfsHash);

    try {
      let transaction = await contract.createAsset(url);
      let tx = await transaction.wait();
      console.log("transaction", transaction);
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
    }
    /* then list the item for sale on the marketplace */
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
    } finally {
      setpreviewMedia("");
      setAddImage("");
      setPreviewThumbnail("");
    }
  };
  // const [advancemenu, Setadvancemenu] = useState(false);
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

  const [hasRole, setHasRole] = useState(true);

  useEffect(() => {
    const asyncFn = async () => {
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

  if (!hasRole) {
    const loader = setTimeout(() => {
      router.push("/profile");
    }, 1000);
    loader;
  }

//  const submit = () => {
//     confirmAlert({
//       title: 'Confirm to submit',
//       message: 'Are you sure to do this.',
//       buttons: [
//         {
//           label: 'Yes',
//           onClick: () => alert('Click Yes')
//         },
//         {
//           label: 'No',
//           onClick: () => alert('Click No')
//         }
//       ]
//     });
//   };

  // const options = {
  //   title: 'Title',
  //   message: 'Message',
  //   buttons: [
  //     {
  //       label: 'Yes',
  //       onClick: () => alert('Click Yes')
  //     },
  //     {
  //       label: 'No',
  //       onClick: () => alert('Click No')
  //     }
  //   ],
  //   closeOnEscape: true,
  //   closeOnClickOutside: true,
  //   keyCodeForClose: [8, 32],
  //   willUnmount: () => {},
  //   afterClose: () => {},
  //   onClickOutside: () => {},
  //   onKeypress: () => {},
  //   onKeypressEscape: () => {},
  //   overlayClassName: "overlay-custom-class-name"
  // };
  
  // confirmAlert(options);
  
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
              <div className="flex">
                <div className="p-4 mt-5" style={{ width: "100%" }}>
                  <form action="#">
                    <div>
                      <img
                        className=" h-32"
                        alt=""
                        src="/NftB1.jpg"
                        style={{ width: "100%" }}
                      ></img>
                    </div>
                    <h3 className="text-3xl py-4 font-bold text-pink-600 mt-10 text-left text-4xl">
                      Create New NFT
                    </h3>

                    <div>
                      <div>
                        <div className="mt-5">
                          <div>
                            <input
                              required="required"
                              placeholder="Asset Name"
                              className="w-full rounded-md bg-white  dark:bg-gray-900 p-3 outline-none mb-4 border-[1px] border-[#d5d5d6] text-pink-600"
                              onChange={(e) =>
                                updateFormInput({
                                  ...formInput,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div>
                            <textarea
                              type="text"
                              placeholder="Asset Description"
                              className="w-full bg-white  dark:bg-gray-900 rounded-md shadow-sm p-2 outline-none border-[1px] border-[#d5d5d6] mb-4 text-pink-600"
                              onChange={(e) =>
                                updateFormInput({
                                  ...formInput,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="font-bold  mt-5 text-left">
                            Upload file
                          </div>
                          <div className="font-bold  mt-5 text-left">
                            Priview
                          </div>
                        </div>
                        <div className="flex gap-6">
                          <div className=" rounded-lg text-center p-3 border-2 border-indigo-600 ...mt-20 w-2/4">
                            <h1 className="text-lg font-semibold">
                              Drag file here to upload
                            </h1>
                            <p className="text-[#6a6b76]">
                              PNG,GIF,WEBP,MP4,or MP3
                              <br />
                              <div className="flex text-black mt-3 cursor-pointer rounded-lg bg-slate-300 p-2.5 m-auto w-full">
                                <input
                                  type="file"
                                  accept="image/png, image/jpeg,.txt,.doc,video/mp4,audio/mpeg,.pdf"
                                  onChange={(e) => onChangeMediaType(e)}
                                />
                              </div>
                            </p>
                          </div>

                          <div className=" rounded-lg text-center p-3 border-2 border-indigo-600 ...mt-20 w-2/4">
                            <div className="flex text-black mt-3 cursor-pointer rounded-lg  p-2.5 m-auto w-full">
                              {previewMedia ? (
                                mediaHash?.image && addImage == false ? (
                                  <img
                                    src={previewMedia}
                                    alt=""
                                    className="w-full object-cover h-72 flex justify-center"
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

                        {addImage && (
                          <>
                            <div className="flex justify-between">
                              <div className="font-bold  mt-5 text-left">
                                Upload preview image
                              </div>
                              <div className="font-bold  mt-5 text-left">
                                Priview
                              </div>
                            </div>
                            <div className="flex gap-6">
                              <div className="   rounded-xl border-dashed border-2 border-indigo-600 ... text-center p-3 w-96 ... mt-10">
                                <h1 className="text-lg font-semibold">
                                  Drag file here to upload
                                </h1>
                                <p className="text-[#6a6b76]">
                                  PNG, JPG, or GIF
                                  <br />
                                  <div className=" text-black mt-3 cursor-pointer rounded-xl p-2.5 m-auto w-full bg-slate-300">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => onChangeThumbnail(e)}
                                    />
                                  </div>
                                </p>
                              </div>
                              <div className="   rounded-xl border-dashed border-2 border-indigo-600 ... text-center p-3 w-96 ... mt-10">
                                <div className="text-[#6a6b76]">
                                  <div className=" text-black mt-3 cursor-pointer rounded-xl p-2.5 m-auto w-full ">
                                    {previewThumbnail && (
                                      <img src={previewThumbnail} />
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
                          <p className="text-lg font-bold mt-6">Properties</p>
                        </div>
                        <div
                          onClick={handleShow}
                          className="mt-7 text-green-500  h-10 p-1.5 border-solid border-2 border-solid-600 ... rounded-lg cursor-pointer"
                        >
                          Add Properties
                        </div>

                        <Modal
                          open={show}
                          onClose={handleClos}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style} className="text-center">
                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              component="h2"
                              className="text-center"
                            >
                              <div className="flex justify-between">
                                <div>Add Properties</div>
                                <div>
                                  <img
                                    className="w-3 h-3"
                                    onClose={handleClos}
                                    img
                                    src="cross.png"
                                  ></img>
                                </div>
                              </div>
                            </Typography>
                            <Typography
                              id="modal-modal-description"
                              sx={{ mt: 2 }}
                            >
                              <div>
                                Properties show up underneath your item, are
                                clickable, and can be filtered in your
                                collection&apos;s sidebar.
                              </div>
                              <div className="flex justify-between">
                                <div className="font-bold">Type</div>
                                <div className="font-bold">Name</div>
                              </div>
                              <form onSubmit={handleSubmit}>
                                {attributes.map((inputField) => (
                                  <div key={inputField.id}>
                                    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4 pb-2 text-pink-600 align-center">
                                      <input
                                        name="display_type"
                                        label="First Name"
                                        placeholder="Display type"
                                        className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900"
                                        variant="filled"
                                        value={inputField.display_type}
                                        onChange={(event) =>
                                          handleChangeInput(
                                            inputField.id,
                                            event
                                          )
                                        }
                                      />
                                      <input
                                        name="trait_type"
                                        label="Last Name"
                                        placeholder="Trait type"
                                        className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900 text-pink-600"
                                        variant="filled"
                                        value={inputField.trait_type}
                                        onChange={(event) =>
                                          handleChangeInput(
                                            inputField.id,
                                            event
                                          )
                                        }
                                      />
                                      <input
                                        name="value"
                                        type="number"
                                        label="First Name"
                                        placeholder="Value"
                                        className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900 text-pink-600"
                                        variant="filled"
                                        value={inputField.value}
                                        onChange={(event) =>
                                          handleChangeInput(
                                            inputField.id,
                                            event
                                          )
                                        }
                                      />
                                      <div>
                                        <button
                                          disabled={attributes.length === 1}
                                          onClick={() =>
                                            handleRemoveFields(inputField.id)
                                          }
                                          className="text-left mt-5 p-2.5 rounded-lg  bg-slate-300 text-white flex justify-center"
                                        >
                                          <FaMinusSquare
                                            style={{ color: "red" }}
                                          />
                                        </button>
                                      </div>

                                      <div>
                                        <button
                                          className="text-left mt-5 p-2.5 rounded-lg  bg-slate-300 text-white flex justify-center"
                                          onClick={handleAddFields}
                                        >
                                          <FaPlusSquare
                                            style={{ color: "green" }}
                                          />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </form>
                            </Typography>
                            <div className="mt-5" onClick={handleSubmit}>
                              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                                Save
                              </button>
                            </div>
                          </Box>
                        </Modal>
                      </div>
                      <p className="text-md font-semibold mt-6">
                        {" "}
                        Alternative text for NFT{" "}
                        <span className="text-gray-400">(Optipnal) </span>
                      </p>
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

                      <p className="font-semibold text-lg my-6">Category</p>
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
                        className="bg-black text-white"
                      />
                    </div>

<div className="font-semibold text-lg my-6">Tags</div>
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
                        className="bg-black text-white"
                      />
                    <div className="flex justify-between mt-5">
                      <div className="text-left">
                        <div className="font-bold text-3xl">
                          Put on marketplace
                        </div>
                        <div>
                          Enter price to allow users instantly Buy your NFT{" "}
                        </div>
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
                      <div className="flex mt-3 gap-6 ">
                        <input

                          type="number"
                          min="1" max="10" 
                           required="true"
                          placeholder="Asset Price in Matic"
                          className="w-full bg-white dark:bg-gray-900 rounded-md mb-4 shadow-sm p-2 outline-none border-[1px] border-[#d5d5d6] text-pink-600"
                          onChange={(e) =>
                            updateFormInput({
                              ...formInput,
                              price: e.target.value,
                            })
                          }
                        />{" "}
                      </div>
                    )}
                  </form>
                </div>
              </div>
              {/* <button onClick={()=>{submit()}}>Confirm dialog</button> */}

              <div className="flex justify-between p-5">
                <div>
                  <button
                    onClick={(e) => createMarket(e)}
                    className="bg-[black] rounded-xl dark:bg-black text-white py-3 px-3 mb-8"
                  >
                    Create digital assets
                  </button>
                </div>
             
              </div>
            
            </div>
          </div>            
        </div>
      </div>
    </Layout>
  );
}
