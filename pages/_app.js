/* pages/_app.js */
import { useState } from "react";
import "../styles/globals.css";
import {ThemeProvider} from "next-themes"
import {Provider} from "react-redux"; 
import store from "../store";
import Router from "next/router";
import Loader from "../Components/Loader";


function Marketplace({ Component, pageProps }) {
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
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </ThemeProvider>
    </>
  );
}

export default Marketplace;
