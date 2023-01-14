import React, {useEffect, useState} from 'react';
import axios from 'axios';

const assetcomp = ({uri}) => {
    const removePrefix = (uri) => {
        return uri.substring(7, uri.length);
      };
    const [response,setResponse] = useState([]);
    const [image, setImage] = useState("");

    const metadata = async()=>{
        const { data } = await axios.get(
            `https://cloudflare-ipfs.com/ipfs/${removePrefix(uri)}`
        );
        setResponse(data);
        // setResponse(JSON.parse(data));
        console.log("Asset compo image",uri);
        if(data.image.length > 1)
        setImage(data.image);
        else
        setImage(data.thumbnailimage);
        // console.log(typeof data.image);
        let preuri = image.substr(7,50);
        // console.log(data);

        
    }

    useEffect(() => {
        // setTimeout(() =>{
        //     metadata();
        // },1000)
        metadata();
        // console.log(props.uri);
        
      },[uri]);

    //   console.log(response.image);

    // console.log(image);
    let preuri = removePrefix(image);
    console.log("Asset compo image",preuri,image);

    return (
        <div>
            {/* <pre>{JSON.stringify(response)}</pre> */}

             <img
                 src={`https://cloudflare-ipfs.com/ipfs/${preuri}`}
                 alt="" className=" h-100  p-2 w-full object-fit" />
            </div>
    )
}

export default assetcomp;