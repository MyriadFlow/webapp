/* pages/_app.js */
import "../styles/globals.css";
import {ThemeProvider} from "next-themes"
import {Provider} from "react-redux"; 
import store from "../pages/store";



function Marketplace({ Component, pageProps }) {


  return (



<ThemeProvider enableSystem={true} attribute="class">
  <Provider  store={store}>

    <Component {...pageProps} />
    </Provider>
</ThemeProvider>


  );
}

export default Marketplace;
