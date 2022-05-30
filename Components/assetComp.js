import React, {useEffect, useState} from 'react';
import axios from 'axios';

const assetcomp = ({uri}) => {

    const [response,setResponse] = useState([]);
    const [image, setImage] = useState("");

    const metadata = async()=>{
        const { data } = await axios.get(
            `https://ipfs.io/ipfs/${uri}`
        );
        setResponse(data);
        // setResponse(JSON.parse(data));
        if(data.image.length > 1)
        setImage(data.image);
        else
        setImage(data.thumbnailimage);
        // console.log(typeof data.image);
        let preuri = image.substr(7,50);
        // console.log(data);

        
    }

    useEffect(() => {
        // setTimeout(() =>{
        //     metadata();
        // },1000)
        metadata();
        // console.log(props.uri);
        
      },[uri]);

    //   console.log(response.image);

    // console.log(image);
    let preuri = image.substr(7,50);
    // console.log(preuri);

    return (
        <div>
            {/* <pre>{JSON.stringify(response)}</pre> */}

             <img
                 src={`https://ipfs.io/ipfs/${preuri}`}
                 alt="" className=" h-100  p-2 w-full object-fit" />
            </div>
    )
}

export default assetcomp;