/* pages/index.js */

import Landingpage from "../pages/landingpage";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Head from 'next/head';

import {
  connectwallethandler,
} from "./api/setConnection";
import NoSSR from "./NoSSR";

// export async function getServerSideProps() {
//   const response = await fetch(
//       'http://localhost:3000/api/getData');
//   const data = await response.json();

//   return {
//       props: { data: data },
//   };
// }

export default function Home({ data }) {
  // const dispatch = useDispatch();
  // const [errorMessage, SeterrorMessage] = useState(null);
  // const [defaultAccount, SetdefaultAccount] = useState();
  // const [UserBalance, SetUserBalance] = useState();

  // useEffect(() => {
  //   connectwallethandler(
  //     SeterrorMessage,
  //     SetdefaultAccount,
  //     SetUserBalance,
  //     dispatch
  //   );
  // }, []);

  return (
    <>
      <Head>
        <title>Marketplace</title>
        <meta name="description" content="A NFT Marketplace to Explore the Digital Gold Mine, that Supports the Creators. A Place where you can Create, Collect and Sell Digital Assets."></meta>
        <meta property="og:url" content="https://marketplace-myriadflow.netlify.app"></meta>
        <meta name="keywords" content=" crypto, wallet, metamask, nft, asset, marketplace, collections"></meta>
        <meta name="author" content="Myriadflow"></meta>
        <meta charset="UTF-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

        <meta property="og:image" content="/dark.svg"></meta>
        <meta property="og:image:alt" content="Myriadflow"></meta>
        <meta property="og:image:type" content="image/svg+xml"></meta>
        <meta property="og:image:width" content="500"></meta>
        <meta property="og:image:height" content="500"></meta>

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website"></meta>
        <meta property="og:url" content="https://marketplace-myriadflow.netlify.app/"></meta>
        <meta property="og:title" content="Marketplace"></meta>
        <meta property="og:description" content="A NFT Marketplace to Explore the Digital Gold Mine, that Supports the Creators. A Place where you can Create, Collect and Sell Digital Assets."></meta>
        <meta property="og:image" content="/dark.svg"></meta>

        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image"></meta>
        <meta property="twitter:url" content="https://marketplace-myriadflow.netlify.app/"></meta>
        <meta property="twitter:title" content="Marketplace"></meta>
        <meta property="twitter:description" content="A NFT Marketplace to Explore the Digital Gold Mine, that Supports the Creators. A Place where you can Create, Collect and Sell Digital Assets."></meta>
        <meta property="twitter:image" content="/dark.svg"></meta>

        <link rel="apple-touch-icon" sizes="180x180" href="/dark.svg"></link>
        <link rel="icon" type="image/svg+xml" sizes="32x32" href="/dark.svg"></link>
        <link rel="icon" type="image/svg+xml" sizes="16x16" href="/dark.svg"></link>
      </Head>
      <div>
        <NoSSR>
          <Landingpage />

        </NoSSR>

      </div>
    </>
  );
}