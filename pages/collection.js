// /* pages/my-artifacts.js */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import { request, gql } from "graphql-request";
import Homecomp from "../Components/homeComp";
import Loader from "../Components/Loader";
import Layout from "../Components/Layout";
import etherContract from "../utils/web3Modal";
import Marketplace from "../artifacts/contracts/Marketplace.sol/Marketplace.json";
const graphqlAPI = process.env.NEXT_PUBLIC_STOREFRONT_API;
const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS;

const Collection = () => {
  const [info, setInfo] = useState([]);
  const itemStatus = new Map(["NONEXISTANT", "SALE", "AUCTION", "SOLD","REMOVED"].map((v,index)=>[index,v]));
  const sortedCollection=async()=>{
}
  const walletAddr = useSelector(selectUser);
  var wallet = walletAddr ? walletAddr[0] : "";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wlt, setwlt] = useState();
  const fetchUserAssests = async () => {
    setLoading(true);
    const query = gql`
    query Query($where: AssetCreated_filter) {
      assetCreateds(first:100){
        id
        tokenID
        creator
        blockNumber
        blockTimestamp
        metaDataURI
      }
          }
          `;
    const result = await request(graphqlAPI, query);
    const refineArray = []
          Promise.all(result.assetCreateds.map(async item=>{
            const marketPlaceContarct = await etherContract(marketplaceAddress, Marketplace.abi);
            const itemResult = await marketPlaceContarct.idToMarketItem(item.tokenID)
            const status=  itemStatus.get(parseInt(itemResult.status))
            if(status=="SALE"){
              refineArray.push(item.tokenID)
            }
          })).then(()=>{
            setData(result.assetCreateds.filter(assetItem=>refineArray.some(item=>item ===assetItem.tokenID)));
          })
    setLoading(false);
  };

  // const getStatuswiseItems=async(itemtatus,id)=>{
  //   const refineArray = []
  //         Promise.all(result.assetCreateds.map(async item=>{
  //           const marketPlaceContarct = await etherContract(marketplaceAddress, Marketplace.abi);
  //           const itemResult = await marketPlaceContarct.idToMarketItem(item.tokenID)
  //           const status=  itemStatus.get(parseInt(itemResult.status))
  //           if(status=="SALE"){
  //             refineArray.push(item.tokenID)
  //           }
  //         })).then(()=>{
  //           setData(result.assetCreateds.filter(assetItem=>refineArray.some(item=>item ===assetItem.tokenID)));
  //         })
  // }
  useEffect(() => {
    sortedCollection();
    if (!localStorage.getItem("platform_wallet") && wallet !== undefined) {
      localStorage.setItem("platform_wallet", wallet);
    } else {
      setwlt(localStorage.getItem("platform_wallet"));
    }
    fetchUserAssests(`${localStorage.getItem("platform_wallet")}`);
  }, []);

 
  return (
    <Layout>
    <div className="p-4 px-10 min-h-screen body-back">
      <div className=" mt-10  h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ">
        {data?.length > 0 ? (
          data.map((item) => {
            return (
              <div
                key={item.tokenID}
                className=" border-2 p-2.5  dark:bg-[#1c1c24]  rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer"
              >
                <Link key={item.tokenID} href={`/assets/${item.tokenID}`}>
                  <div>
                    <Homecomp uri={item ? item.metaDataURI : ""} />

                    <div>
                      <div className="text-blue-600 text-gray-500 dark:text-white">
                        Place a bid
                      </div>
                      <div>
                        <div className="flex justify-between mt-3">
                          <div className="font-bold text-gray-500 dark:text-white">
                            Wallet Address :{" "}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-white">
                            {item.creator.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        ) : loading ? (
          <Loader />
        ) : (
          <div className="text-2xl pb-10 font-bold text-center">
            You haven&apos;t created any asset.
          </div>
        )}
      </div>
    </div>
    </Layout>
  );
};
export default Collection;
