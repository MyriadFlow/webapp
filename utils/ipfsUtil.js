import axios from "axios";

export const removePrefix = (uri) => {
  return uri.substring(7, uri.length);
};

export const getMetaData = async (uri) => {
  try {
    const parsedURI = removePrefix(uri);
    const { data } = await axios.get(
      `https://cloudflare-ipfs.com/ipfs/${parsedURI}`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
