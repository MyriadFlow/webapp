// import Layout from "../Components/Layout";
// import { selectUser } from "../slices/userSlice";
// import { FaMinusSquare } from "react-icons/fa";
// import { React, useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import Accessmaster from '../artifacts/contracts/accessmaster/AccessMaster.sol/AccessMaster.json';
// import etherContract from "../utils/web3Modal";
// import { request, gql } from "graphql-request";
// import Loader from "../Components/Loader";
// const accessmasterAddress = process.env.NEXT_PUBLIC_ACCESS_MASTER_ADDRESS;
// const graphqlAPI = process.env.NEXT_PUBLIC_STOREFRONT_API;
// export default function Manage() {
//   const [loading, setLoading] = useState(true);
//   const [rolGranted, setRoleGranteds] = useState([]);
//   const [role, setRole] = useState([]);

//   const walletAddr = useSelector(selectUser);
//   var wallet = walletAddr ? walletAddr[0] : "";
//   const [userData, setUserData] = useState({contract:null, creatorRoleId:null})
//   const revokeRole=async(wallet)=>{
//      const roleRevoked = await userData.contract.revokeRole(userData.creatorRoleId, wallet)
//      console.log("revolerole",roleRevoked)
//     setRoleGranteds(null)
//   }
//   const initRole=async()=>{
//     const contract = await etherContract(accessmasterAddress,Accessmaster.abi)
//     const creatorRoleId =  await contract.FLOW_CREATOR_ROLE()
//     const hasCreatorRole = await contract.hasRole(creatorRoleId, wallet)
//     setRoleGranteds(hasCreatorRole ? wallet : null)
//     setUserData({contract, creatorRoleId})
//   }
//   useEffect(() => {
//      initRole()
//   }, [])
  
//   const fetchCreator = async () => {
//     const query = gql`
//       query Query($where: RoleGranted_filter) {
//         roleGranteds(first:100) {
//           role
//           account
//           id
//           sender
//           blockNumber
//           transactionHash
//           blockTimestamp
//         }
//       }
//     `;
//     const result = await request(graphqlAPI, query);
//     const resul=result.roleGranteds
//     const finalresult = resul.reduce((finalArray, current) => {
//       let obj = finalArray.find((item) => item.account === current.account);
//       if (obj) {
//         return finalArray;
//       }
//       return finalArray.concat([current]);
//     }, []);
//     setLoading(true);
//     setRole(finalresult);
//     setLoading(false);
//   };
//   useEffect(() => {
//     if (!localStorage.getItem("platform_wallet") && wallet !== undefined) {
//       localStorage.setItem("platform_wallet", wallet);
//     } else {
//     }
//     fetchCreator(`${localStorage.getItem("platform_wallet")}`);
//   }, []);

//   return (
//     <Layout title="Manage" description="This is used to Manage creator info">
     
//     {rolGranted &&  <div className="dark:body-back body-back-light">
//               <div  className=" mt-10">
//                 <div
//                   className="flex justify-between p-2.5 border-y-2"
//                 >
//                   <table className="text-gray-500 dark:text-white">
//                 <tr className="margin-table">
//                 <th>Creator</th>
//                 <th>Time</th>
//                 <th>Action</th>

//                  </tr>

//               {role?.length > 0 ? (
//                role.map((item) => {
//                const date = new Date(parseInt(item.blockTimestamp+'000')).toDateString() 
//                 return (

//                   <tr className="margin-table" key={item.id}>

//                     <td className="margin-table">{item.account}</td>
//                     <td className="margin-table">{date ?? "--"}</td>
//                     <td className="flex"> 
//                       <FaMinusSquare onClick={()=>revokeRole(item.account)} className="text-red-600 ml-5 cursor-pointer" />
//                     </td>

//                   </tr>
//                 );
//               })
//             ) : loading ? (
//               <Loader />
//             ) : (
//               <div className="text-2xl pb-10 text-center font-bold">
//                 You Haven&apos;t Any Role.
//               </div>
//             )}
//             </table>
                 
//                 </div>
             
//               </div>
//       </div>
// }
//     </Layout>
//   );
// }


export default function Manage() {

    return(
        <></>
    )
}