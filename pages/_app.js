import { useState, useEffect } from "react";
import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import store from "../store";
import Router from "next/router";
import { ThirdwebProvider, useAddress } from "@thirdweb-dev/react";
import "../styles/globals.css";
import Loader from "../Components/Loader";
import { DataProvider, useData } from "../context/data";
import { authorize } from "../utils/api";
import axios from "axios";
import Cookies from "js-cookie";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygonMumbai, mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const binance = {
  id: 56, // The chain ID for Binance Smart Chain
  name: 'Binance Smart Chain',
  network: 'binance',
  iconUrl: 'https://example.com/binance-icon.svg', // Replace with the actual icon URL
  iconBackground: '#fff', // Replace with the desired background color
  nativeCurrency: {
    decimals: 18,
    name: 'Binance Coin',
    symbol: 'BNB',
  },
  rpcUrls: {
    public: { http: ['https://bsc-dataseed.binance.org/'] }, // BSC public RPC URL
    default: { http: ['https://bsc-dataseed.binance.org/'] }, // You can change this if needed
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://bscscan.com/' }, // BscScan is a popular BSC block explorer
  },
  contracts: {
    multicall3: {
      address: '0x41263cdb56f1b6efc49f1c56b155ae7a9ccbde4b5', // Multicall contract address for BSC
      blockCreated: 6_973_493, // Block number when the contract was created
    },
  },
  testnet: false, // Set to true if you are configuring a BSC testnet
};

const binanceTestnet = {
  id: 97, // The chain ID for Binance Smart Chain Testnet
  name: 'Binance Smart Chain Testnet',
  network: 'binance',
  iconUrl: 'https://example.com/binance-testnet-icon.svg', // Replace with the actual icon URL
  iconBackground: '#fff', // Replace with the desired background color
  nativeCurrency: {
    decimals: 18,
    name: 'Test Binance Coin',
    symbol: 'tBNB',
  },
  rpcUrls: {
    public: { http: ['https://data-seed-prebsc-1-s1.binance.org:8545/'] }, // BSC Testnet public RPC URL
    default: { http: ['https://data-seed-prebsc-1-s1.binance.org:8545/'] }, // You can change this if needed
  },
  blockExplorers: {
    default: { name: 'BscScan Testnet', url: 'https://testnet.bscscan.com/' }, // BscScan Testnet block explorer
  },
  contracts: {
    multicall3: {
      address: '0x1ee38d535d541c55c9a2db7ba35126d6e4e9a6ed', // Multicall contract address for BSC Testnet
      blockCreated: 8_694_853, // Block number when the contract was created
    },
  },
  testnet: true, // Set to true to indicate that this is a BSC testnet configuration
};

const { chains, publicClient } = configureChains(
  [ polygon, polygonMumbai, mainnet, optimism, arbitrum, base, binance, binanceTestnet],
  [
    alchemyProvider({ apiKey: "69qp-YAVmBUC_suyFxzrHw6eVzzpIwUE" }),
    publicProvider(),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "abe2b237bacf50276c123ac3df643de3",
  chains,
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

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

    // const mytoken = localStorage.getItem("platform_token");
    const mytoken = Cookies.get("platform_token");
    if (!mytoken) {
      fetchInitialData();
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/data.json");
        const data = await response.json();
        console.log("id", data);

        const apiURL = `https://testnet.gateway.myriadflow.com/api/v1.0/webapp/${data.storefrontId}`;
        const resp = await axios.get(apiURL);
        const resData = resp.data;

        setResdata(resData);
      } catch (error) {
        console.error("Error fetching data:", error);
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
              <Component {...pageProps} initialData={initialData} />
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
