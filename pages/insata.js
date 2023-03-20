import React, { useCallback, useEffect, useState } from "react";
import { LoginSocialInstagram } from "reactjs-social-login";
import { InstagramFeed } from "../Components/InstagramFeed";

import { InstagramLoginButton } from "react-social-login-buttons";
const INSTAGRAM_URL = "https://api.instagram.com";
const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
const appsecrete = process.env.NEXT_PUBLIC_INSTAGRAM_APP_SECRET;
const REDIRECT_URI = "https://dev.webapp.myriadflow.com/";
const token = process.env.NEXT_PUBLIC_INS_TOKEN;
export default function Insata() {
  const allfields = "id,username,account_type,media_count";
  const allscope = "user_profile,user_media";
  const [fields, setFields] = useState(allfields);
  const [scope, setScope] = useState(allscope);
  const [state, setState] = useState("");
  // useEffect(() => {
  //   if (window && typeof window !== "undefined") {
  //     const popupWindowURL = new URL(window.location.href);
  //     const code = popupWindowURL.searchParams.get("code");
  //     const state = popupWindowURL.searchParams.get("state");
  //     if (state?.includes("_instagram") && code) {
  //       localStorage.setItem("instagram", code);
  //       window.close();
  //     }
  //   }
  // }, []);

  const onLogoutSuccess = useCallback(() => {
    alert("logout success");
  }, []);
  const onLogin = useCallback(() => {
    const oauthUrl = `${INSTAGRAM_URL}/oauth/authorize&client_id=${appId}&scope=${scope}&state=${
      state + "_instagram"
    }&redirect_uri=${REDIRECT_URI}`;
    const width = 450;
    const height = 730;
    // if (window && typeof window !== "undefined") {
    //   const left = window.screen.width / 2 - width / 2;
    //   const top = window.screen.height / 2 - height / 2;
    //   window.open(
    //     oauthUrl,
    //     "Instagram",
    //     "menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=" +
    //       width +
    //       ", height=" +
    //       height +
    //       ", top=" +
    //       top +
    //       ", left=" +
    //       left
    //   );
    // }
  }, [scope, state, appId, REDIRECT_URI]);

  return (
    <div onClick={onLogin}>
      <LoginSocialInstagram
        client_id={appId || ""}
        client_secret={appsecrete || ""}
        redirect_uri={REDIRECT_URI}
        scope={scope}
        fields={fields}
        onLogoutSuccess={onLogoutSuccess}
        onResolve={({ data }) => {
          console.log("data", data);
        }}
      >
        <InstagramLoginButton />
      </LoginSocialInstagram>
      <InstagramFeed token={token} counter={12} />
    </div>
  );
}
