// pages/api/graphql.js
import axios from "axios";

export default async function handler(req, res) {

  const { nftid } = req.query;
  
  const { subgraphUrl } = req.query;
  const endPoint = `${subgraphUrl}`;
  const headers = {
    "Content-Type": "application/json",
  };

  const AllBuildingQuery = `{
    instaGenAssetCreated(id: "${nftid}"){
      creator
      blockNumber
      blockTimestamp
      currentIndex
      id
      quantity
      transactionHash
      }
    }`;

  const graphqlQuery = {
    operationName: "instaGenAssetCreated",
    query: `query instaGenAssetCreated ${AllBuildingQuery}`,
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
