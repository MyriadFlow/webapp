/* pages/index.js */

import Landingpage from "../pages/landingpage";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  accountChangedHandler,
  connectwallethandler,
} from "./api/setConnection";

export default function Home() {
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
      <Landingpage />
    </div>
  );
}