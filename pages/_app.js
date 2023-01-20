import { useState } from "react";
import "../styles/globals.css";
import {ThemeProvider} from "next-themes"
import {Provider} from "react-redux"; 
import store from "../store";
import Router from "next/router";
import Loader from "../Components/Loader";
import { ThirdwebProvider } from '@thirdweb-dev/react';
import "../styles/globals.css";


function MyApp({ Component, pageProps }) {
  const desiredChainId = 80001;

  const [isLoading,isSetLoading] = useState(false);
  Router.events.on('routeChangeStart',(url)=>{
    isSetLoading(true);
  })
  Router.events.on("routeChangeComplete", (url) => {
    isSetLoading(false);
  });
  return (
    <>
    {isLoading && <Loader/>}

       <ThemeProvider enableSystem={true} attribute="class">
       <ThirdwebProvider desiredChainId={desiredChainId}>
       <Provider store={store}>
        <Component {...pageProps} />
        </Provider>
        </ThirdwebProvider>
              </ThemeProvider> 

     
    </>
  );
}

export default MyApp;
