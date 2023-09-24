import { useState, useEffect } from "react";
import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import store from "../store";
import Router from "next/router";
import { ThirdwebProvider, useAddress } from "@thirdweb-dev/react";
import "../styles/globals.css";
import Loader from "../Components/Loader";
import { DataProvider,useData } from "../context/data";
import { authorize } from '../utils/api';
import axios from 'axios';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
const { chains, publicClient } = configureChains(
  [polygonMumbai, mainnet, polygon, optimism, arbitrum, base, zora],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'abe2b237bacf50276c123ac3df643de3',
  chains
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

// Fixes: Hydration failed because the initial UI does not match what was rendered on the server.

function MyApp({ Component, pageProps }) {

  const [isLoading, isSetLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [resdata, setResdata] = useState(null);

  useEffect(() => {
    async function fetchInitialData() {
      const data = await authorize();
      setInitialData(data);
    }

    fetchInitialData();
  }, []);

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

  const chain = resdata?.blockchain;

  Router.events.on("routeChangeStart", (url) => {
    isSetLoading(true);
  });
  Router.events.on("routeChangeComplete", (url) => {
    isSetLoading(false);
  });
  
  return (
    <>
      {isLoading && <Loader />}
      <ThemeProvider enableSystem={true} attribute="class">
        {/* <ThirdwebProvider desiredChainId={desiredChainId}>
          <Provider store={store} > */}
          <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} initialChain={polygonMumbai}>
          <DataProvider>
          <Component {...pageProps} initialData={initialData}/>
          </DataProvider>
          </RainbowKitProvider>
    </WagmiConfig>
          {/* </Provider>
        </ThirdwebProvider> */}
      </ThemeProvider>
    </>
  );
}

export default MyApp;
