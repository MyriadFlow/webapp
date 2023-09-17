// pages/api/graphql.js
import axios from "axios";

export default async function handler(req, res) {
  const { tokenid } = req.query; 

  const endPoint = "http://18.119.142.140:8000/subgraphs/name/yu";
  const headers = {
    "Content-Type": "application/json",
  };

  const AllBuildingQuery = `{
    saleStarteds(orderBy: id, 
      where: {tokenId: "${tokenid}"}
      ) {
        itemId
        metaDataURI
        nftContract
        seller
        tokenId
        id
        price
        transactionHash
        blockTimestamp
        blockNumber
      }
    }`;

  const graphqlQuery = {
    operationName: "saleStarteds",
    query: `query saleStarteds ${AllBuildingQuery}`,
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
