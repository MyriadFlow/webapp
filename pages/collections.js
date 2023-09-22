// /* pages/my-artifacts.js */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice";
import { request, gql } from "graphql-request";
import Homecomp from "../Components/homeComp";
import Loader from "../Components/Loader";
import Layout from "../Components/Layout";
import { BsShop } from "react-icons/bs";
import { IoCreate, IoEaselSharp } from "react-icons/io5";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import SignatureSeries from "../Components/sigseries";
import FusionSeries from "../Components/fusionseries";
import Instagen from "../Components/instagen";
import Eternum from "../Components/eternumpass";
import etherContract from "../utils/web3Modal";
import Tradhub from '../artifacts/contracts/tradehub/TradeHub.sol/TradeHub.json'
import { useAccount } from "wagmi";

const Collection = () => {
  const [info, setInfo] = useState([]);
  const itemStatus = new Map(["NONEXISTANT", "SALE", "AUCTION", "SOLD","REMOVED"].map((v,index)=>[index,v]));
  const sortedCollection=async()=>{
}
  const walletAddr = useAccount().address;
  var wallet = walletAddr ? walletAddr[0] : "";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("signature");
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
    const result = [];
    const refineArray = []
          // Promise.all(result.assetCreateds.map(async item=>{
          //   const tradhubContarct = await etherContract(tradhubAddress, Tradhub.abi);
          //   const itemResult = await tradhubContarct.idToMarketItem(item.tokenID)
          //   const status=  itemStatus.get(parseInt(itemResult.status))
          //   if(status=="SALE"){
          //     refineArray.push(item.tokenID)
          //   }
          // })).then(()=>{
          //   setData(result.assetCreateds.filter(assetItem=>refineArray.some(item=>item ===assetItem.tokenID)));
          // })
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
    fetchUserAssests();
  }, []);

 
  return (
    <Layout title="Collections" description="Collection of assets you launched in various categories.">
    <div className="min-h-screen dark:body-back body-back-light">
    <div className="text-2xl font-semibold mb-4 pt-10 text-center dark:text-white text-gray-800">Collections</div>
    <div className="pb-4 px-10 grid grid-cols-2 gap-8 sm:gap-6 lg:grid-cols-6 md:grid-cols-3 w-full pt-6 border-t">
      
          <div
            className={`rounded-full text-center text-gray-500 dark:text-gray dark:hover:bg-white  cursor-pointer p-3 border-b-2 border-transparent transition-all ${
              page === "signature" ? "bg-white" : ""
            }`}
            onClick={() => setPage("signature")}
           >
              <div className="text-sm lg:text-xl md:text-lg font-semibold">SignatureSeries</div>
          </div>

          <div
            className={`rounded-full text-center text-gray-500 dark:text-gray dark:hover:bg-white  cursor-pointer p-3 border-b-2 border-transparent transition-all ${
              page === "fusion" ? "bg-white" : ""
            }`}
            onClick={() => setPage("fusion")}
           >
              <div className="text-sm lg:text-xl md:text-lg font-semibold">FusionSeries</div>
          </div>

          <div
            className={`rounded-full text-center text-gray-500 dark:text-gray dark:hover:bg-white  cursor-pointer p-3 border-b-2 border-transparent transition-all ${
              page === "instagen" ? "bg-white" : ""
            }`}
            onClick={() => setPage("instagen")}
          >
              <div className="text-sm lg:text-xl md:text-lg font-semibold">Instagen</div>
          </div>

          <div
            className={`rounded-full text-center text-gray-500 dark:text-gray dark:hover:bg-white  cursor-pointer p-3 border-b-2 border-transparent transition-all ${
              page === "eternum" ? "bg-white" : ""
            }`}
            onClick={() => setPage("eternum")}
          >
              <div className="text-sm lg:text-xl md:text-lg font-semibold">EternumPass</div>
          </div>

          <div
            className={`rounded-full text-center text-gray-500 dark:text-gray dark:hover:bg-white  cursor-pointer p-3 border-b-2 border-transparent transition-all ${
              page === "eternal" ? "bg-white" : ""
            }`}
            onClick={() => setPage("eternal")}
          >
              <div className="text-sm lg:text-xl md:text-lg font-semibold">EternalSoul</div>
          </div>

          <div
            className={`rounded-full text-center text-gray-500 dark:text-gray dark:hover:bg-white  cursor-pointer p-3 border-b-2 border-transparent transition-all ${
              page === "phygital" ? "bg-white" : ""
            }`}
            onClick={() => setPage("phygital")}
          >
              <div className="text-sm lg:text-xl md:text-lg font-semibold">Phygital NFTs</div>
          </div>
        </div>



{page == "signature" && (
          <div className="p-4 px-10">
            <SignatureSeries />
          </div>
        )}

{page == "fusion" && (
          <div className="p-4 px-10">
            <FusionSeries />
          </div>
        )}

{page == "instagen" && (
          <div className="p-4 px-10">
            <Instagen />
          </div>
        )}

{page == "eternum" && (
          <div className="p-4 px-10">
            <Eternum />
          </div>
        )}
      
    </div>
    </Layout>
  );
};
export default Collection;
