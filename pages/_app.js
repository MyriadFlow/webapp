import { useState, useEffect } from "react";
import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import store from "../store";
import Router from "next/router";
import { ThirdwebProvider, useAddress } from "@thirdweb-dev/react";
import "../styles/globals.css";
import Loader from "../Components/Loader";
import { DataProvider } from "../context/data";
import { authorize } from '../utils/api';

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
  [mainnet, polygon, polygonMumbai, optimism, arbitrum, base, zora],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

// Fixes: Hydration failed because the initial UI does not match what was rendered on the server.

function MyApp({ Component, pageProps }) {
  const desiredChainId = 80001;

  const [isLoading, isSetLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    async function fetchInitialData() {
      const data = await authorize();
      setInitialData(data);
    }

    fetchInitialData();
  }, []);

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
      <RainbowKitProvider chains={chains}>
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
