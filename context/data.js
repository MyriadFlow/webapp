import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [resdata, setResdata] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data.json');
        const data = await response.json();
        console.log("id", data);

        const apiURL = `https://testnet.gateway.myriadflow.com/api/v1.0/webapp/${data.storefrontId}`;
        const resp = await axios.get(apiURL);
        const resData = resp.data;

        setResdata(resData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ resdata }}>
      {children}
    </DataContext.Provider>
  );
}
