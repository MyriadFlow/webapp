import React, {useEffect, useState} from 'react';
import axios from 'axios';

const AssetImage = ({uri}) => {

    const [response,setResponse] = useState([]);
    const [image, setImage] = useState("");

    const metadata = async()=>{
        const { data } = await axios.get(
            `https://cloudflare-ipfs.com/ipfs/${uri}`
        );
        setResponse(data);
        setImage(data.image);
        let preuri = image.substr(7,50);    
    }

    useEffect(() => {
        metadata();   
      },[uri]);
    let preuri = image.substr(7,50);

    return (
        <div>
             <img
                 src={`https://cloudflare-ipfs.com/ipfs/${preuri}`}
                 alt="" className="h-40 p-2 w-40 object-fit" />
            </div>
    )
}

export default AssetImage;