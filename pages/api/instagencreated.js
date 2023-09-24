// pages/api/graphql.js
import axios from "axios";

export default async function handler(req, res) {
  const { subgraphUrl } = req.query;
  const endPoint = `${subgraphUrl}`;
  const headers = {
    "Content-Type": "application/json",
  };

  const AllBuildingQuery = `{
    instaGenAssetCreateds(orderBy: id){
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
    operationName: "instaGenAssetCreateds",
    query: `query instaGenAssetCreateds ${AllBuildingQuery}`,
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
