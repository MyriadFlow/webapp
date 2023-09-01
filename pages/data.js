import React from "react";
import { useData } from "./DataContext";

export default function SomeComponent() {
  const { resdata } = useData();

  console.log(resdata);

  return (
    // Render your component using the resdata
    <div>
      {resdata && (
        <div>
          {/* Access properties from resdata here */}
          <p>Response Data: {resdata.subgraphUrl}</p>
        </div>
      )}
    </div>
  );
}