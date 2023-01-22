import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Multiselect from "multiselect-react-dropdown";
const YOUR_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDFFODE2RTA3RjBFYTg4MkI3Q0I0MDQ2QTg4NENDQ0Q0MjA4NEU3QTgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MzI0NTEzNDc3MywibmFtZSI6Im5mdCJ9.vP9_nN3dQHIkN9cVQH5KvCLNHRk3M2ZO4x2G99smofw";
import axios from "axios";
const client = new NFTStorage({ token: YOUR_API_KEY });
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
import StoreFront from "../artifacts/contracts/StoreFront.sol/StoreFront.json";
import BuyAsset from "../Components/buyAssetModal";
import { Alert, Snackbar } from "@mui/material";
import Layout from "../Components/Layout";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import { convertUtf8ToHex } from "@walletconnect/utils";
import { NFTStorage } from "nft.storage";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 490,
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
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export default function CreateItem() {
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
    doctype:"",

  });
  const [previewMedia, setpreviewMedia] = useState();
  const [addImage, setAddImage] = useState(false);
  const [formInput, updateFormInput] = useState({
    price: "",
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
    if(addImage && fileType=='image'){
      setAddImage(false);
    }
    if (!validImageTypes.includes(type)) {
      setAddImage(true);
    }
    try {
      const metaHash = await uploadBlobGetHash(fileData);
      const metaHashURI = getMetaHashURI(metaHash);
      if (fileType == "audio" || fileType == "video"||fileType=="doctype") {
        setMediaHash({
          ...mediaHash,
          [fileType]: metaHashURI,
          animation_url: metaHashURI,
        });
      } else {
        setMediaHash({ ...mediaHash, [fileType]: metaHashURI });
      }
      console.log("file data",fileData)
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
        // await createItem(ipfsHash, url);
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
        package: WalletConnectProvider, // required
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
    }finally{
      //reset all states here
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
              <div className="flex">
                <div className="p-4 mt-5">
                  <form action="#">
                    <div>
                      <img className="w-72 h-32"
                        alt=""
                        src="/NftB1.jpg"
                      ></img>
                    </div>
                    <h3
                      className="text-3xl py-4 font-bold "
                      style={{
                        color: "pink",
                        marginBottom: "40px",
                        fontSize: "40px",
                        textAlign: "left",
                      }}
                    >
                      Create New NFT
                    </h3>
                    <div className="text-left">
                      <div className="text-secondary text-lg">
                        Single edition on Ethereum
                      </div>
                      <div
                        className="flex justify-between"
                        style={{ width: "75%" }}
                      >
                        <div className="font-bold">Choose Wallet</div>
                      </div>
                    </div>
                    <div className="flex">
                      <div>
                        <div
                          className="mt-5 shadow-2xl ..."
                          style={{
                            width: "600px",
                            height: "75px",
                            borderRadius: "10px",
                            border: "1px solid",
                          }}
                        >
                          <div className="flex">
                            <div style={{ padding: "16px" }}>
                              <img
                                alt=""
                                src="/eth.png"
                                style={{ height: "40px", width: "40px" }}
                              ></img>
                            </div>
                            <div className="mt-3">
                              <div>Address</div>
                              <div>Name</div>
                            </div>
                            <div style={{ margin: "0 auto" }}>Status</div>
                          </div>
                        </div>
                        <div
                          className="font-bold  mt-5"
                          style={{ textAlign: "left" }}
                        >
                          Upload file
                        </div>
                        <div
                          className="  translate-y-[-50%]"
                          style={{
                            marginTop: "85px",
                            border: "2px dotted",
                            borderRadius: "10px",
                            textAlign: "center",
                            padding: "12px",
                          }}
                        >
                          <h1 className="text-lg font-semibold">
                            Drag file here to upload
                          </h1>
                          <p className="text-[#6a6b76]">
                            PNG,GIF,WEBP,MP4,or MP3
                            <br />
                            <div
                              className=" text-black mt-3 cursor-pointer"
                              style={{
                                borderRadius: "10px",
                                background: "#c5bfbf",
                                padding: "10px",
                                margin: "0 auto",
                                width: "25%",
                              }}
                            >
                               {previewMedia ? (mediaHash?.image && addImage==false) ?
                                        <img
                                          src={previewMedia}
                                          alt=""
                                          className="w-full object-cover h-72 flex justify-center"
                                        /> : mediaHash?.video ?
                                        <video  autoPlay controls>
                                          <source
                                          src={previewMedia}
                                          
                                        ></source>
                                        </video>:
                                        mediaHash?.audio ? <audio  autoPlay controls>
                                           <source
                                          src={previewMedia}
                                         
                                        ></source>
                                        </audio> :
                                        mediaHash?.doctype? <input
                                        file={previewMedia}
                                        
                                       alt=""
                                        className="w-full object-cover h-72 flex justify-center"
                                      />:null
                                       : (
                              <input
                                type="file"
                                accept="image/png, image/jpeg,.txt,.doc,video/mp4,audio/mpeg,.pdf"
                                onChange={(e) => onChangeMediaType(e)}
                                className=""
                              />
                                      )}
                            </div>
                          </p>
                        </div>
                        {addImage && (
                          <>
                            <div
                              className="font-bold  mt-5 text-left"
                            >
                              Upload preview image
                            </div>
                            <div
                              className="   translate-y-[-50%] rounded-xl border-dashed border-2 border-indigo-600 ... text-center p-3 w-96 ... mt-20"
                            >
                              <h1 className="text-lg font-semibold">
                                Drag file here to upload
                              </h1>
                              <p className="text-[#6a6b76]">
                                PNG, JPG, or GIF
                                <br />
                                <div
                                  className=" text-black mt-3 cursor-pointer rounded-xl p-2.5 m-auto w-1/3 bg-slate-300"
                                 
                                >
                                  {previewThumbnail&&<img src={previewThumbnail} />}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => onChangeThumbnail(e)}
                                    className=""
                                  />
                                </div>
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    
                    </div>
                   
                    <div className="w-full px-8 py-6">
                      <div
                        className="bg-gray-100 shadow-sm cursor-pointer p-3 border-2 border-gray-300 rounded-xl font-semibold text-md  dark:bg-gray-800 bg-black text-white"
                        onClick={() => Setadvancemenu(!advancemenu)}
                      >
                        {advancemenu
                          ? " Hide advanced menu"
                          : "Show advanced menu"}
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
                                    className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900 text-pink-500"
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
                                    className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900 text-pink-500"
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
                                    className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900 text-pink-500"
                                    variant="filled"
                                    value={inputField.value}
                                    onChange={(event) =>
                                      handleChangeInput(inputField.id, event)
                                    }
                                  />

                                  <button
                                    disabled={attributes.length === 1}
                                    onClick={() =>
                                      handleRemoveFields(inputField.id)
                                    }
                                  >
                                    <FaMinusSquare className="text-red-500"  />
                                  </button>
                                  <button onClick={handleAddFields}>
                                    <FaPlusSquare className="text-green-500" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </form>
                          <div>
                            <Button onClick={handleShow}>
                              Open properties
                            </Button>
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
                                      <img className="w-3 h-3"
                                        onClose={handleClos}
                                        img
                                        src="cross.png"
                                        style={{
                                          width: "13px",
                                          height: "13px",
                                        }}
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
                                  {attributes.map((inputField) => (
                                    <div key={inputField.id}>
                                      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4 pb-2">
                                        <input
                                          name="display_type"
                                          label="First Name"
                                          style={{ color: "pink" }}
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
                                          style={{ color: "pink" }}
                                          placeholder="Trait type"
                                          className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900"
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
                                          style={{ color: "pink" }}
                                          label="First Name"
                                          placeholder="Value"
                                          className="mt-2 p-3 w-full text-sm input_background outline-none rounded-md dark:bg-gray-900"
                                          variant="filled"
                                          value={inputField.value}
                                          onChange={(event) =>
                                            handleChangeInput(
                                              inputField.id,
                                              event
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  ))}
                                  <div
                                    onClick={() =>
                                      handleRemoveFields(inputField.id)
                                    }
                                    className="flex"
                                  >
                                    <div className="mt-3">
                                      <input
                                        type="text"
                                        placeholder="Character"
                                      ></input>
                                    </div>
                                    <div className="mt-3 ml-5">
                                      <input
                                        type="text"
                                        placeholder="Male"
                                      ></input>
                                    </div>
                                  </div>
                                  <div
                                    className="text-left mt-5"
                                    style={{
                                      padding: "10px",
                                      borderRadius: "10px",
                                      width: "28%",
                                      background: "#8f8787",
                                      color: "white",
                                    }}
                                  >
                                    {" "}
                                    <button onClick={handleAddFields}>
                                      Add More
                                    </button>
                                  </div>
                                  <div className="mt-5">
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                                      Save
                                    </button>
                                  </div>
                                </Typography>
                              </Box>
                            </Modal>
                          </div>
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
                                background: "black",
                                color: "white",
                              },
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div
                      className="flex justify-between"
                      style={{ width: "55%" }}
                    >
                      <div className="text-left">
                        <div className="font-bold text-3xl">
                          Put on marketplace
                        </div>
                        <div>
                          Enter price to allow users instantly your NFT{" "}
                        </div>
                      </div>
                      <div>
                        <img
                          alt=""
                          src="/swich.png"
                          style={{ width: "30px", height: "30px" }}
                        ></img>
                      </div>
                    </div>
                    <div className="flex mt-3 gap-6">
                      <div
                        style={{
                          border: "1px solid",
                          height: "200px",
                          width: "280px",
                          borderRadius: "10px",
                        }}
                      >
                        Fixed Price
                      </div>
                      <div
                        style={{
                          border: "1px solid",
                          height: "200px",
                          width: "280px",
                          borderRadius: "10px",
                        }}
                      >
                        Timed auction
                      </div>
                    </div>
                    <div className="mt-5">
                      <div style={{ width: "55%" }}>
                        <input
                          placeholder="Asset Name"
                          style={{ color: "pink" }}
                          className="w-full rounded-md bg-white  dark:bg-gray-900 p-3 outline-none mb-4 border-[1px] border-[#d5d5d6]"
                          onChange={(e) =>
                            updateFormInput({
                              ...formInput,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div style={{ width: "55%" }}>
                        <textarea
                          type="text"
                          placeholder="Asset Description"
                          style={{ color: "pink" }}
                          className="w-full bg-white  dark:bg-gray-900 rounded-md shadow-sm p-2 outline-none border-[1px] border-[#d5d5d6] mb-4"
                          onChange={(e) =>
                            updateFormInput({
                              ...formInput,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div style={{ width: "55%" }}>
                        <input
                          type="text"
                          style={{ color: "pink" }}
                          placeholder="Asset Price in Matic"
                          className="w-full bg-white dark:bg-gray-900 rounded-md mb-4 shadow-sm p-2 outline-none border-[1px] border-[#d5d5d6]"
                          onChange={(e) =>
                            updateFormInput({
                              ...formInput,
                              price: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              {/* <div className="w-full px-8 py-6">
                <div
                  className="bg-gray-100 shadow-sm cursor-pointer p-3 border-2 border-gray-300 rounded-xl font-semibold text-md  dark:bg-gray-800" style={{background:"black",color:"white"}}
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
                              label="First Name" style={{color:"pink"}}
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
                              label="Last Name"style={{color:"pink"}}
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
                              type="number"style={{color:"pink"}}
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
                          background: "black",
                          color: "white",
                        },
                      }}
                    />
                  </div>
                )}
              </div> */}

              <div style={{ marginTop: "100px" }}>
                <button
                  onClick={(e) => createMarket(e)}
                  className="bg-[black] rounded-xl dark:bg-black text-white py-3 px-3 mb-8"
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
