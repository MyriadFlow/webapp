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
        <div style={{ minHeight: 80 }}>
            {response ? response.map((item) => {

                console.log(item);

                return (<div
                    // key={item.id}
                    className="my-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full hover:scale-105 duration-200 transform transition cursor-pointer">
                    <div className=" flex items-center justify-between px-4 mb-2">
                        <div className="flex items-center">
                            {/* {
                                item ? item.map((i) => {
                                    return(
                                        <p className="font-extralight">{i}</p>
                                    )
                                }):null} */}
                        </div>
                    </div>
                </div>)
            }) : null}
        </div>
    )
}

export default assetProperties;