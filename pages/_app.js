import { useState, useEffect } from "react";
import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import store from "../store";
import Router from "next/router";
import { ThirdwebProvider, useAddress } from "@thirdweb-dev/react";
import "../styles/globals.css";
import Loader from "../Components/Loader";

import { authorize } from '../utils/api';

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
        <ThirdwebProvider desiredChainId={desiredChainId}>
          <Provider store={store} >
          <Component {...pageProps} initialData={initialData}/>
          </Provider>
        </ThirdwebProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
