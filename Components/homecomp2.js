import React, {useEffect, useState} from 'react';
import axios from 'axios';

const homecomp2 = ({uri}) => {

    const [response,setResponse] = useState([]);
    const removePrefix = (uri) => {
        return uri.substring(7, uri.length);
      };
    const metadata = async()=>{
        const { data } = await axios.get(
            `https://gateway.ipfs.io/ipfs/${removePrefix(uri)}`
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

export default homecomp2;
