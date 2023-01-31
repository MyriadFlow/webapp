// /* pages/my-artifacts.js */
import { useEffect, useState } from "react";
import Link from "next/link";
import { selectUser } from "../slices/userSlice";
import { useSelector } from "react-redux";
import HomeComp from "./homeComp";
import HomeComp2 from "./homecomp2";
import Loader from "./Loader";
import { request, gql } from "graphql-request";

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHQL_API;

const MyAssets = () => {
  const walletAddr = useSelector(selectUser); 
  var wallet = walletAddr ? walletAddr[0] : "";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wlt, setwlt] = useState();

  const fetchUserAssests = async (walletAddr) => {
    const query = gql`
    query Query($where: AssetCreated_filter) {
      assetCreateds(first:100, where:{creator: "${walletAddr}"}){
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
    setLoading(true);
    setData(result.assetCreateds);
    setLoading(false);
  };
  useEffect(() => {
    if (!localStorage.getItem("platform_wallet") && wallet !== undefined) {
      localStorage.setItem("platform_wallet", wallet);
    } else {
      setwlt(localStorage.getItem("platform_wallet"));
    }
    fetchUserAssests(`${localStorage.getItem("platform_wallet")}`);
  }, []);
  return (
    <div className="p-4 px-10 min-h-screen gradient-blue">
     
      <div className="p-4 mt-10  h-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 " >
        {data?.length > 0 ? (
          data.map((item) => {
            return (
              <div style={{border:"2px solid"}}
                key={item.tokenID}
                className="bg-[white] dark:bg-[#1c1c24]  rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer"
              >
                <Link key={item.tokenID} href={`/assets/${item.tokenID}`}>
                  <div className="p-6">
                    <HomeComp uri={item ? item.metaDataURI : ""} />

                  
                  <div className="px-3 ">
                  <div className="font-bold">Name</div>
                  <div className="font-bold">Price</div>
                  <div className="text-blue-600">Place a bid</div>
                  </div>
                  </div>
                </Link>
              
              </div>
            );
          })
        ) : loading ? (
          <Loader />
        ) : (
          <div className="text-xl pb-10 ">
            You haven&apos;t created any asset.
          </div>
        )}
      </div>
    </div>
  );
};
export default MyAssets;
