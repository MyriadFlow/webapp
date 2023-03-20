import React, { useState,useEffect } from "react";
import { LoginSocialInstagram } from "reactjs-social-login";
import { InstagramFeed } from "../Components/InstagramFeed";
import { InstagramLoginButton } from "react-social-login-buttons";

const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
const appsecrete = process.env.NEXT_PUBLIC_INSTAGRAM_APP_SECRET;
const REDIRECT_URI = "https://dev.webapp.myriadflow.com/";
const token = process.env.NEXT_PUBLIC_INS_TOKEN;
export default function Insta() {
  
  const allfields = "id,username,account_type,media_count";
  const allscope = "user_profile,user_media";
  const [fields, setFields] = useState(allfields);
  const [scope, setScope] = useState(allscope);
  useEffect(() => {  
    return;
  });
  return (
  
      <LoginSocialInstagram
        client_id={appId || ""}
        client_secret={appsecrete || ""}
        redirect_uri={REDIRECT_URI}
        scope={scope}
        fields={fields}       
      >
        <InstagramLoginButton />
        <InstagramFeed token={token} counter={12} />
      </LoginSocialInstagram>
    
  );
}
