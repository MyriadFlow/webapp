import React from "react";
import { useData } from "../context/data";

export default function SomeComponent() {
  const { resdata } = useData();

  console.log(resdata);

  return (
    // Render your component using the resdata
    <div>
      {resdata && (
        <div>
          <p>Response Data: {resdata.subgraphUrl}</p>
          <p>{resdata.webappUrl}</p>
          <p>{resdata.headline}</p>
          <p>{resdata.description}</p>
        </div>
      )}
    </div>
  );
}