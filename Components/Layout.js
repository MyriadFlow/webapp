import Header from "./Header";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { connectwallethandler } from "../pages/api/setConnection";
import Head from "next/head";

const Layout = ({ children, title ,description}) => {
  const dispatch = useDispatch();
  const [errorMessage, SeterrorMessage] = useState(null);
  const [defaultAccount, SetdefaultAccount] = useState();
  const [UserBalance, SetUserBalance] = useState();

  useEffect(() => {
    connectwallethandler(
      SeterrorMessage,
      SetdefaultAccount,
      SetUserBalance,
      dispatch
    );
  }, );

  return (
    <>
     <Head>
     <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        <link rel="shortcut icon" href="/dark.svg"width="60" height="60"/>
        <title>{title}</title>
        <meta name="description" content={description}/>

      </Head>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default Layout;