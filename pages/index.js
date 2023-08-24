/* pages/index.js */

import Landingpage from "../pages/landingpage";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import {
  connectwallethandler,
} from "./api/setConnection";
import NoSSR from "./NoSSR";

export async function getServerSideProps() {
  const response = await fetch(
      'http://localhost:3000/api/getData');
  const data = await response.json();

  return {
      props: { data: data },
  };
}

export default function Home({ data }) {
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
  }, []);

  return (
    <div>
      {/* <NoSSR> */}
      <Landingpage injectdata={data}/>
      
      {/* </NoSSR> */}

    </div>
  );
}