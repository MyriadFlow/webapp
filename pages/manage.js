import Layout from "../Components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { selectUser } from "../slices/userSlice";
import axios from "axios";
import Web3Modal from "web3modal";
import { BsHeart } from "react-icons/bs";
import { FaPlusSquare } from "react-icons/fa";
import { request, gql } from "graphql-request";
import { useEffect, React, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../Components/Loader";
import { ethers } from "ethers";
import StoreFront from "../artifacts/contracts/StoreFront.sol/StoreFront.json";
import etherContract from "../utils/web3Modal";
import BigCard from "../Components/Cards/BigCard";
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
import { saleStartedQuery } from "../utils/gqlUtil";
import { getMetaData, removePrefix } from "../utils/ipfsUtil";
const itemStatus = new Map(["NONEXISTANT", "SALE", "AUCTION", "SOLD","REMOVED"].map((v,index)=>[index,v]))

const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;

const graphqlAPI = process.env.NEXT_PUBLIC_MARKETPLACE_API;
const storeFrontAddress = process.env.NEXT_PUBLIC_STOREFRONT_ADDRESS;

export default function manage() {
  const [loading, setLoading] = useState(true);
  const [hasRole, setHasRole] = useState(true);
  const [operator, setOperator] = useState(true);

  const [highlights, setHighlights] = useState([]);

  const [data, setData] = useState([]);
  const manage = {
    name: "",
    homeDescription: "",
    contact: [
      "instagram_id",
      "facebook_id",
      "twitter_id",
      "discord_id",
      "telegram_id",
    ],
  };
  const [manageData, setManageData] = useState({ ...manage });
  const [updateManageData, setupdateManageData] = useState({ ...manage });

  const router = useRouter();
  const walletAddr = useSelector(selectUser);
  var wallet = walletAddr ? walletAddr[0] : "";

  const fetchCreator = async (walletAddr) => {
    const query = gql`
      query Query($where: RoleGranted_filter) {
        roleGranteds(first:100) {
          role
          account
          id
          sender
          blockNumber
          transactionHash
          blockTimestamp
        }
      }
    `;
    const result = await request(graphqlAPI, query);
    setLoading(true);
    setData(result.roleGranteds);
    setLoading(false);
  };

  
  const updateManageDataInfo = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("platform_token");
    try {
      if (
        !updateManageData.name.trim() ||
        !updateManageData.homeDescription.trim()
      )
        alert("Do not leave any field empty!");
      else {
        var signroledata = JSON.stringify({
          name: "MyriadFlow",
          homeDescription:
            "An innovative platform to explore & launch NFT Experiences.",
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
          "https://testnet.gateway.myriadflow.com/api/v1.0/details",
          { ...updateManageData },
          config
        );
        alert("manage page details Updation successful!");
        setShowModal(false);
        getManageData();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setupdateManageData({ manage });
      setLoading(false);
    }
  };

  const getManageData = async () => {
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
      .get(`https://testnet.gateway.myriadflow.com/api/v1.0/details`, config)
      .then((res) => {
        const {
          data: {
            payload: { name, homeDescription },
          },
        } = res;
        setManageData({
          ...manageData,
          name,
          homeDescription,
        });
        setupdateManageData({
          ...manageData,
          name,
          homeDescription,
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

  const onUpadteManage = (e) => {
    const { name, value } = e.target;
    setupdateManageData({ ...updateManageData, [name]: value });
  };
  const getHighlights = async () => {
    const token = localStorage.getItem("platform_token");
    const config = {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    setLoading(true);
    axios.get(`https://testnet.gateway.myriadflow.com/api/v1.0/products/itemIds`,config)
      .then(async(res) => {
        const marketPlaceContarct = await etherContract(marketplaceAddress, Marketplace.abi)
        const saleInput = res.data.payload.map(i=>parseInt(i))
        const {saleStarteds} = await request(graphqlAPI, saleStartedQuery, {where:{itemId_in: saleInput}}) //saleInput =>[1,2]
        const finalResult=[] 
        Promise.all(saleStarteds.map(async(item)=>{
          const itemResult = await marketPlaceContarct.idToMarketItem(item.itemId)
          const nftData = await getMetaData(item.metaDataURI);
          finalResult.push({...item,...nftData,  
            image: nftData?.image? `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}${removePrefix(nftData?.image)}`:"",
          status: itemStatus.get(parseInt(itemResult.status))})
        })).then(()=>{
          setHighlights(finalResult)
        })
        setLoading(true);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(()=>{
    const token = localStorage.getItem("platform_token");
    if (token) {
      getHighlights();
    }
  },[])
  useEffect(() => {
    const token = localStorage.getItem("platform_token");
    if (token) {
      getManageData();
    }
    if (!localStorage.getItem("platform_wallet") && wallet !== undefined) {
      localStorage.setItem("platform_wallet", wallet);
    } else {
    }
    fetchCreator(`${localStorage.getItem("platform_wallet")}`);
  }, []);
  useEffect(() => {
    const asyncFn = async () => {
      const token = localStorage.getItem("platform_token");
      if (!token) {
      
        getManageData();
      }
      const storeFrontContract = await etherContract(storeFrontAddress, StoreFront.abi)
      setOperator(
        await storeFrontContract.hasRole(
          await storeFrontContract.STOREFRONT_OPERATOR_ROLE(),
          wallet
        )
      );
    };
    asyncFn();
  }, [operator]);
  const { name, homeDescription } = manageData;
console.log("data manage create",data)
  return (
    <Layout title="Manage" description="This is used to Manage Marketplce info">
      <div className="body-back">
        <div className="text-left text-gray-500 dark:text-white text-3xl mt-5 text-center">
          Manage Your Marketplace
        </div>
        <div
          className="text-center text-xl text-gray-500 dark:text-white"
          style={{ padding: "10px", borderBottom: "1px solid" }}
        >
          About
        </div>
        <div className="flex justify-around mt-5 text-gray-500 dark:text-white">
          <div className="flex">
            <div>
              <label>Name : </label>
            </div>

            <div>{name}</div>
          </div>
          <div className="flex">
            <div>
              <label>Description : </label>
            </div>
            <div>{homeDescription}</div>
          </div>

          <div>
            <div>Contact Details : </div>
            <div className="flex">
              <div>Instagram Id :</div>
              <div></div>
            </div>
            <div className="flex">
              <div>Facebook Id :</div>
              <div></div>
            </div>
            <div className="flex">
              <div>Tweeter Id :</div>
              <div></div>
            </div>
            <div className="flex">
              <div>Telegram Id :</div>
              <div></div>
            </div>
          </div>
        </div>
        <form onSubmit={updateManageDataInfo} className="w-full card-shadow">
          <div className="flex justify-evenly">
            <div
              className="md:items-center mb-6 mt-10"
              style={{ width: "30%" }}
            >
              <div className=" text-gray-500 dark:text-white">
                <label
                  className="block text-gray-500 dark:text-white font-bold mb-1 md:mb-0 pr-4"
                  for="inline-full-name"
                >
                  Name
                </label>
              </div>
              <div className="">
                <input
                  name="name"
                  onChange={(e) => onUpadteManage(e)}
                  value={updateManageData.name}
                  className="p-2.5 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  id="123"
                  placeholder="Name"
                />
              </div>
            </div>
            <div
              className=" md:items-center mb-6 mt-10"
              style={{ width: "30%" }}
            >
              <div className=" text-gray-500 dark:text-white">
                <label
                  className="block  font-bold mb-1 md:mb-0 pr-4"
                  for="inline-password"
                >
                  Description
                </label>
              </div>
              <div className="">
                <textarea
                  name="description"
                  onChange={(e) => onUpadteManage(e)}
                  value={updateManageData.homeDescription}
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="7yusb"
                  type="text"
                  placeholder="Enter description"
                ></textarea>
              </div>
            </div>
          </div>
          <div className=" md:items-center mb-6">
            <div>
              <label
                className="block text-gray-500 dark:text-white font-bold  mb-1 md:mb-0 pr-4"
                for="inline-password"
              >
                Contact
              </label>
            </div>
            <div>
              <div className="flex gap-x-4 items-center mt-5">
                <div>
                  <label className="text-gray-500 dark:text-white">
                    Add Teligram
                  </label>
                  <input className="p-2.5" type="text"></input>
                </div>
                <div>
                  <label className="text-gray-500 dark:text-white">
                    Add Instagram
                  </label>
                  <input className="p-2.5" type="text"></input>
                </div>
                <div>
                  <label className="text-gray-500 dark:text-white">
                    Add Facebook
                  </label>
                  <input className="p-2.5" type="text"></input>
                </div>
                <div>
                  <label className="text-gray-500 dark:text-white">
                    Add Discord
                  </label>
                  <input className="p-2.5" type="text"></input>
                </div>
                <div>
                  <label className="text-gray-500 dark:text-white">
                    Add Tweeter
                  </label>
                  <input className="p-2.5" type="text"></input>
                </div>
              </div>{" "}
            </div>
          </div>
          <div style={{ textAlign: "center", color: "black" }}>
            <button
              type="submit"
              style={{
                background: "white",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              Update
            </button>
          </div>
        </form>
        <div className="card-shadow mt-10">

         {highlights.length > 0 && (
          <div className="mb-20 ">
            <h1 className="text-center text-3xl font-semibold mb-20 text-gray-500 dark:text-white">
              Highlights
            </h1>
            <div className="max-w-[1280px] mx-auto rounded-3xl flex " style={{gap:"30px"}}>
                {highlights?.map(function (data, i) {
                   
                  return (
                   
                    <BigCard key={i}
                      title={data.product_name}
                      img={data.image}
                      price={data.price}
                      name={data.seller.slice(-6)}
                      description={data.description}
                    />
                  );
                })}
            </div>
          </div>
            )}

        </div>

        {data?.length > 0 ? (
          data?.map((item) => {
            return (
              <div key={item.id} className="card-shadow mt-10">
                <div
                  className="flex justify-between "
                  style={{ padding: "10px", borderBottom: "1px solid" }}
                >
                  <div className=" text-gray-500 dark:text-white text-xl  ">
                    Creators
                  </div>
                  <div>
                    <FaPlusSquare style={{ color: "green" }} />
                  </div>
                </div>
                <div className="flex justify-between mt-10 text-gray-500 dark:text-white text-xl">
                  <div>{item?.account}</div>
                  <div>{item.blockTimestamp}</div>
                  <div>Action</div>
                </div>
              </div>
            );
          })
        ) : loading ? (
          <Loader />
        ) : (
          <div className="text-2xl pb-10 text-center font-bold">
            You Haven&apos;t Created Any Assets.
          </div>
        )}
      </div>
    </Layout>
  );
}
