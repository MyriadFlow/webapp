// pages/api/graphql.js
import axios from "axios";

export default async function handler(req, res) {
  const endPoint = "http://3.15.54.199:8000/subgraphs/name/fnl";
  const headers = {
    "Content-Type": "application/json",
  };

  const AllBuildingQuery = `{
    instaGenAssetCreated(orderBy: id) {
        blockNumber
        blockTimestamp
        creator
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
