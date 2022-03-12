import React, {useEffect, useState} from 'react';
import axios from 'axios';

const assetDesc = ({uri}) => {

    const [response,setResponse] = useState([]);

    const metadata = async()=>{
        const { data } = await axios.get(
            `https://ipfs.io/ipfs/${uri}`
        );
        setResponse(data);
        // console.log(data);
    }

    useEffect(() => {
        metadata();
      },[uri]);

    return (
        <div style={{minHeight:26}}>
            <p className="text-sm font-bold text-gray-500 font-1 dark:text-gray-300">{response && response.name}</p>
        </div>
    )
}

export default assetDesc;