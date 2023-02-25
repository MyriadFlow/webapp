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
    }

    useEffect(() => {
        metadata();
      },[uri]);

    return (
        <div style={{minHeight:80}} className="font-poppins">
            <div className="text-[14px] font-semibold capitalize text-gray-500 dark:text-white">{response.name}</div>
            <div className=" text-[13px] text-gray-500 dark:text-white ">{response.description}</div>
        </div>
    )
}

export default Homecomp2;
