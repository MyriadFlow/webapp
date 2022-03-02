import React, { useEffect, useState } from 'react';
import axios from 'axios';

const assetProperties = ({ uri }) => {

    const [response, setResponse] = useState([]);

    const metadata = async () => {
        const { data } = await axios.get(
            `https://ipfs.io/ipfs/${uri}`
        );
        setResponse(data.categories);
        // console.log(data);
    }

    useEffect(() => {
        metadata();
    }, [uri]);

    return (
        <div style={{ minHeight: 80 }} className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 h-auto w-full ">
            {response ? response.map((item) => {

                console.log(item);

                return (<div
                    // key={item.id}
                    className="my-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full hover:scale-105 duration-200 transform transition cursor-pointer">
                    <div className=" flex items-center justify-between w-full ">  
                        <div className="flex flex-col items-center justify-center border bg-blue-500 p-5 w-full ">
                        <p className="font-extralight text-center">{item}</p>
                        </div>
                    </div>
                </div>)
            }) : null}
        </div>
    )
}

export default assetProperties;