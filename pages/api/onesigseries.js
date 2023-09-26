// pages/api/graphql.js
import axios from "axios";

export default async function handler(req, res) {
    const { nftid } = req.query;

    const { subgraphUrl } = req.query;
    const endPoint = "http://3.15.54.199:8000/subgraphs/name/v1/cstree";
    
  const headers = {
    "Content-Type": "application/json",
  };

  const AllBuildingQuery = `{
    signatureSeriesAssetCreateds(where: {tokenID: "${nftid}"} ) {
        id
          tokenID
          creator
          metaDataURI
          blockNumber
          blockTimestamp
          transactionHash
      }
    }`;

  const graphqlQuery = {
    operationName: "signatureSeriesAssetCreateds",
    query: `query signatureSeriesAssetCreateds ${AllBuildingQuery}`,
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
