import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssetProperties = ({ uri }) => {

    const [response, setResponse] = useState([]);

    const metadata = async () => {
        const { data } = await axios.get(
            `https://cloudflare-ipfs.com/ipfs/${uri}`
        );
        setResponse(data.categories ? data.categories : '');
        console.log(data);
    }

    useEffect(() => {
        metadata();
    }, [uri]);

    return (
        
            response.length>0 && (
            <div className="border rounded-md max-w-md w-full px-4 py-3">
                <h3 className="text-gray-700 font-medium dark:text-white">Categories</h3>
                <div className="flex flex-row justify-between mt-6">
                    <div style={{ minHeight: 80 }} className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 h-auto w-full ">
                        {response ? response.map((item, i) => {

                            // console.log(item);

                            return (<div
                                // key={item.id}
                                key={i}
                                className="my-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full hover:scale-105 duration-200 transform transition cursor-pointer">
                                <div className=" flex items-center justify-between w-full ">
                                    <div className="flex flex-col items-center justify-center border bg-blue-500 p-5 w-full ">
                                        <p className="font-extralight text-center">{item}</p>
                                    </div>
                                </div>
                            </div>)
                        }) : null}
                    </div>
                </div>
            </div>
        )
        
        
    )
}

export default AssetProperties;