import Layout from "../Components/Layout";
import { selectUser } from "../slices/userSlice";
import { FaMinusSquare, FaPlusSquare } from "react-icons/fa";
import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import StoreFront from "../artifacts/contracts/StoreFront.sol/StoreFront.json";
import etherContract from "../utils/web3Modal";
const storeFrontAddress = process.env.NEXT_PUBLIC_STOREFRONT_ADDRESS;
export default function Manage() {
  const [rolGranted, setRoleGranteds] = useState(null);
  const walletAddr = useSelector(selectUser);
  var wallet = walletAddr ? walletAddr[0] : "";
  const [userData, setUserData] = useState({contract:null, creatorRoleId:null})
  const grantRoleFuc= async()=>{
    //Grant creator role to the current urser
    const roleGranted = await userData.contract.grantRole(userData.creatorRoleId, wallet)
    setRoleGranteds(roleGranted.from)
      console.log("grantrole info",roleGranted)
  }
  const revokeRole=async()=>{
     const roleRevoked = await userData.contract.revokeRole(userData.creatorRoleId, wallet)
    setRoleGranteds(null)
  }
  const initRole=async()=>{
    const contract = await etherContract(storeFrontAddress,StoreFront.abi)
    const creatorRoleId =  await contract.STOREFRONT_CREATOR_ROLE()
    const hasCreatorRole = await contract.hasRole(creatorRoleId, wallet)
    setRoleGranteds(hasCreatorRole ? wallet : null)
    setUserData({contract, creatorRoleId})
  }
  useEffect(() => {
    initRole()
  }, [])
 
  return (
    <Layout title="Manage" description="This is used to Manage Marketplce info">
      <div className="body-back">
              <div  className="card-shadow mt-10">
                <div
                  className="flex justify-between p-2.5 border-y-2"
                >
                  <div className=" text-gray-500 dark:text-white text-xl  ">
                    Creators
                  </div>
                  <div className="flex justify-between">
                  <div>
                    <FaPlusSquare onClick={()=>{grantRoleFuc()}} className="text-green-600 cursor-pointer"  />
                  </div>
                 
                  </div>
                 
                </div>
               {rolGranted && <div className="flex justify-between mt-10 text-gray-500 dark:text-white text-xl">
                  <div>{rolGranted}</div>
                  <div>
                  `<FaMinusSquare onClick={()=>{revokeRole()}}  className="text-red-600 ml-5 cursor-pointer" />
                  </div>
                </div>}
              </div>
      </div>
    </Layout>
  );
}
