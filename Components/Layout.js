import Header from "./Header";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { connectwallethandler } from "../pages/api/setConnection";

const Layout = ({ children }) => {
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
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;