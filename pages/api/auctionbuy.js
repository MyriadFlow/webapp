// pages/api/graphql.js
import axios from "axios";

export default async function handler(req, res) {
    const { walletAddress } = req.query; 

    const { subgraphUrl } = req.query;
    const endPoint = `${subgraphUrl}`;
  const headers = {
    "Content-Type": "application/json",
  };

  const AllBuildingQuery = `{
    auctionEndeds(
        where: {highestBidder: "${walletAddress}"}
        orderBy: id
      ) {
        auctionId
        auctioneer
        bid
        blockNumber
        blockTimestamp
        highestBidder
        id
        nftContract
        metadataURI
        tokenId
        transactionHash
      }
    }`;

  const graphqlQuery = {
    operationName: "auctionEndeds",
    query: `query auctionEndeds ${AllBuildingQuery}`,
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
