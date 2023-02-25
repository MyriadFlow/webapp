import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Homecomp2 = ({uri}) => {

    const [response,setResponse] = useState([]);

    const metadata = async()=>{
        const { data } = await axios.get(
            `https://cloudflare-ipfs.com/ipfs/${uri}`
        );
        setResponse(data);
    }

    useEffect(() => {
        metadata();
      },[uri]);

    return (
        <div style={{minHeight:80}}>
            <div className="text-3xl font-bold text-gray-800 text-gray-500 dark:text-white font-1">{response && response.name}</div>
            <div className=" text-md font-bold dark:text-gray-300 text-gray-500 font-1 ">{response && response.alternettext}</div>
        </div>
    )
}

export default Homecomp2;