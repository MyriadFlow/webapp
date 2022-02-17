import React, {useEffect, useState} from 'react';
import axios from 'axios';

const homecomp2 = ({uri}) => {

    const [response,setResponse] = useState([]);

    const metadata = async()=>{
        const { data } = await axios.get(
            `https://ipfs.infura.io/ipfs/${uri}`
        );
        setResponse(data);
        console.log(data);
    }

    useEffect(() => {
        metadata();
      },[uri]);

    return (
        <div  >
            <p className="text-sm font-bold text-gray-500 font-1">{response && response.name}</p>
            <p className="text-gray-800 text-sm font-extrabold dark:text-gray-100 font-1 ">{response && response.description}</p>
        </div>
    )
}

export default homecomp2;
