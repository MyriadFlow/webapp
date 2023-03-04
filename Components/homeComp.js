import React, { useEffect, useState } from "react";
import axios from "axios";
const Homecomp = ({ uri }) => {
  const [response, setResponse] = useState([]);
  const [image, setImage] = useState("");
  const removePrefix = (uri) => {
    return uri.substring(7, uri.length);
  };
  const metadata = async () => {
    try {
      const parsedURI = removePrefix(uri);
      const { data } = await axios.get(`https://cloudflare-ipfs.com/ipfs/${parsedURI}`);
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

  return (
    <div>
      <img
        src={`https://cloudflare-ipfs.com/ipfs/${removePrefix(preuri)}`}
        alt="home-img"
        className=" w-full object-fit rounded-lg mb-3"
       

      />
      <div className="flex justify-between mt-3 text-gray-500 dark:text-white">
        <div>{response.name}</div>
        <div>{response.description}</div>

      </div>
      <div className="flex justify-between mt-3 text-gray-500 dark:text-white">
  <div>Price</div>
  <div>{response.price}</div>
</div>
    </div>
  );
};

export default Homecomp;
