// pages/api/graphql.js
import axios from "axios";
import { useData } from "../../context/data";

export default async function handler(req, res) {
  const { resdata } = useData();
  const endPoint = `${resdata.Storefront.subgraphUrl}`;
  const headers = {
    "Content-Type": "application/json",
  };

  const AllBuildingQuery = `{
      assetCreateds(orderBy: id) {
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
    operationName: "assetCreateds",
    query: `query assetCreateds ${AllBuildingQuery}`,
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
