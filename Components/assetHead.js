import React, {useEffect, useState} from 'react';
import axios from 'axios';

const homecomp2 = ({uri}) => {

    const [response,setResponse] = useState([]);

    const metadata = async()=>{
        const { data } = await axios.get(
            `https://cloudflare-ipfs.com/ipfs/${uri}`
        );
        setResponse(data);
        // console.log(data);
    }

    useEffect(() => {
        metadata();
      },[uri]);

    return (
        <div style={{minHeight:80}}>
            <p className="text-3xl font-bold text-gray-800 dark:text-white font-1">{response && response.name}</p>
            <p className=" text-md font-bold dark:text-gray-300 text-gray-500 font-1 ">{response && response.alternettext}</p>
        </div>
    )
}

export default homecomp2;