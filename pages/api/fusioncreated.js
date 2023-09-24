// pages/api/graphql.js
import axios from "axios";

export default async function handler(req, res) {
  const { subgraphUrl } = req.query;
  const endPoint = `${subgraphUrl}`;
  const headers = {
    "Content-Type": "application/json",
  };

  const AllBuildingQuery = `{
    fusionSeriesAssetCreateds(orderBy: id) {
        amount
        blockNumber
        blockTimestamp
        creator
        id
        tokenID
        transactionHash
      }
    }`;

  const graphqlQuery = {
    operationName: "fusionSeriesAssetCreateds",
    query: `query fusionSeriesAssetCreateds ${AllBuildingQuery}`,
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
