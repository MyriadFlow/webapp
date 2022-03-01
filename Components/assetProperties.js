import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgressBar } from "@tomik23/react-circular-progress-bar";

const assetProperties = ({ uri }) => {

    const [response, setResponse] = useState([]);

    const metadata = async () => {
        const { data } = await axios.get(
            `https://ipfs.io/ipfs/${uri}`
        );
        setResponse(data.attributes);
        // console.log(data);
    }

    useEffect(() => {
        metadata();
    }, [uri]);

    return (
        <div style={{ minHeight: 80 }}>
            {response.length > 0 ? response.map((item) => {

                // console.log(item);
                const width = item.value;

                return (<div
                    key={item.id}
                    className="my-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full hover:scale-105 duration-200 transform transition cursor-pointer">
                    <div className=" flex items-center justify-between px-4 mb-2">
                        <div className="flex items-center">
                            <p className="font-extralight">{item && item.trait_type}</p>
                        </div>
                    </div>
                    {
                        item.display_type === "boost_number" && (
                            <div class="w-full bg-gray-200 rounded-full">
                                <div class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-l-full" style={{ width: `${width}%` }}> {width}%</div>
                            </div>)
                    }
                    {
                        item.display_type === "boost_percentage" && (
                            <div style={{padding:10}}>
                            <CircularProgressBar percent= {width} size="100" fontColor= "green"/>
                            </div>
                        )
                    }
                    
                </div>)
            }) : null}
        </div>
    )
}

export default assetProperties;