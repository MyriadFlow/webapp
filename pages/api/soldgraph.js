// pages/api/graphql.js
import axios from "axios";

export default async function handler(req, res) {
  const { walletAddress } = req.query;

  const endPoint = "http://3.15.54.199:8000/subgraphs/name/fnl";
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
