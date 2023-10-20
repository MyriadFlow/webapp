import { useEffect, useState } from "react";
import { useData } from "../context/data";

export default function Home() {
  const [data, setData] = useState(null);

  const { resdata } = useData();

  const graphql = resdata?.Storefront.subgraphUrl;
  console.log(graphql);

  const regex = /^(.*?)(?=\/graphql)/;

  // Use the regular expression to extract the URL
  const match = graphql?.match(regex);

  // Extract the matched URL or set it to null if no match was found
  const graphqlAPI = match ? match[0] : null;
  console.log(graphqlAPI);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/graphql?subgraphUrl=${graphqlAPI}?subgraphUrl=${graphqlAPI}`
        );
        const responseData = await response.json();
        console.log(responseData);
        setData(responseData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>GraphQL Data</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}
