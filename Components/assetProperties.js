import React, { useEffect, useState } from 'react';
import axios from 'axios';

const assetProperties = ({ uri }) => {

    const [response, setResponse] = useState([]);

    const metadata = async () => {
        const { data } = await axios.get(
            `https://ipfs.io/ipfs/${uri}`
        );
        setResponse(data);
        console.log(data);
    }

    useEffect(() => {
        metadata();
    }, [uri]);

    return (
        <div style={{ minHeight: 80 }}>
            {/* {response.attributes.map(({id,display_type,trait_type,value}) => {
                <div
                    key={id}
                    className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full lg:w-72 hover:scale-105 duration-200 transform transition cursor-pointer border-2 dark:border-gray-800">
                    <div className=" flex items-center justify-between px-4 mb-2">
                        <p className="font-1 text-sm font-bold">Price </p>
                        <div className="flex items-center">
                            <FaEthereum className="h-4 w-4 text-blue-400" />
                            <p className="font-extralight dark:text-gray-400">{trait_type}</p>
                        </div>
                    </div>

                </div>
            })} */}
            <p className="text-sm font-bold text-gray-500 font-1 dark:text-gray-300">{response && response.name}</p>
        </div>
    )
}

export default assetProperties;