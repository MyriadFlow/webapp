import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Homecomp2 = ({uri}) => {

    const [response,setResponse] = useState([]);
    const removePrefix = (uri) => {
        return uri.substring(7, 50);
      };
    const metadata = async()=>{
        const { data } = await axios.get(
            `https://cloudflare-ipfs.com/ipfs/${removePrefix(uri)}`
        );
        setResponse(data);
        console.log(data);
    }

    useEffect(() => {
        metadata();
      },[uri]);

    return (
        <div style={{minHeight:80}} className="font-poppins">
            <p className="text-[14px] font-semibold capitalize text-white">{response && response.name}</p>
            <p className="text-[#83838e] text-[13px] dark:text-[#83838e] ">{response && response.description}</p>
        </div>
    )
}

export default Homecomp2;
