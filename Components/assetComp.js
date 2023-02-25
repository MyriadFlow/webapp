import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

const Assetcomp = ({ uri }) => {
  const removePrefix = (uri) => {
    return uri.substring(7, uri.length);
  };
  const [response, setResponse] = useState([]);
  const [image, setImage] = useState("");

  const metadata = async () => {
    const { data } = await axios.get(
      `https://cloudflare-ipfs.com/ipfs/${removePrefix(uri)}`
    );
    setResponse(data);
    if (data.image.length > 1) setImage(data.image);
    else setImage(data.thumbnailimage);
    let preuri = image.substr(7, 50);
  };

  useEffect(() => {
    metadata();
  }, [uri]);

  let preuri = removePrefix(image);

  return (
    <div>
      <img 
        src={`https://cloudflare-ipfs.com/ipfs/${preuri}`}
        alt="alt"
        className=" h-100  p-2 w-full object-fit grow"
      />
    </div>
  );
};

export default Assetcomp;
