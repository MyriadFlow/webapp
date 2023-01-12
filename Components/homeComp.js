import React, { useEffect, useState } from "react";
import axios from "axios";

const homecomp = ({ uri }) => {
  const [response, setResponse] = useState([]);
  const [image, setImage] = useState("");

  const removePrefix = (uri) => {
    return uri.substring(7, uri.length);
  };
  const metadata = async () => {
    try {
      console.log("URI to fetch json", uri);
      const parsedURI = removePrefix(uri);
      const { data } = await axios.get(`https://ipfs.io/ipfs/${parsedURI}`);
      setResponse(data);
      if (data.image.length > 1) setImage(data.image);
      else setImage(data.thumbnailimage);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    metadata();
  }, [uri]);

  let preuri = image;
  console.log("image", image);

  return (
    <div>
      <img
        src={`https://ipfs.io/ipfs/${removePrefix(preuri)}`}
        alt=""
        className="h-60 w-full object-fit rounded-lg mb-3"
      />
    </div>
  );
};

export default homecomp;
