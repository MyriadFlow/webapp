// pages/api/graphql.js
import axios from "axios";
import { useData } from "../../context/data";

export default async function handler(req, res) {
  const { walletAddress } = req.query;

  const { resdata } = useData();

  const graphql = resdata?.Storefront.subgraphUrl;
  console.log(graphql);

  const regex = /^(.*?)(?=\/graphql)/;

  // Use the regular expression to extract the URL
  const match = graphql?.match(regex);

  // Extract the matched URL or set it to null if no match was found
  const graphqlAPI = match ? match[0] : null;
  console.log(graphqlAPI);

  const endPoint = graphqlAPI;
  const headers = {
    "Content-Type": "application/json",
  };

  const AllBuildingQuery = `{
    itemSolds(
        where: {buyer: "${walletAddress}"}
        orderBy: id
      ) {
        id
        itemId
        metadataURI
        nftContract
        price
        seller
        tokenId
        transactionHash
        buyer
        blockNumber
        blockTimestamp
      }
    }`;

  const graphqlQuery = {
    operationName: "itemSolds",
    query: `query itemSolds ${AllBuildingQuery}`,
    variables: {},
  };

  try {
    const response = await axios({
      url: endPoint,
      method: "post",
      data: graphqlQuery,
      headers: headers,
    });
    res.status(200).json(response.data.data);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
