import React from "react";
import { useData } from "../context/data";

export default function SomeComponent() {
  const { resdata } = useData();

  console.log(resdata);

  const graphql = resdata?.subgraphUrl;
  console.log(graphql);

  const regex = /^(.*?)(?=\/graphql)/;
  
  // Use the regular expression to extract the URL
  const match = graphql?.match(regex);

  // Extract the matched URL or set it to null if no match was found
  const graphqlAPI = match ? match[0] : null;
  console.log(graphqlAPI);

  return (
    // Render your component using the resdata
    <div>
      {resdata && (
        <div>
          <p>Response Data: {graphqlAPI}</p>
          <p>{resdata.webappUrl}</p>
          <p>{resdata.headline}</p>
          <p>{resdata.description}</p>
        </div>
      )}
    </div>
  );
}