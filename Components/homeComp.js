import React, {useEffect, useState} from 'react';
import axios from 'axios';

const homecomp = ({uri}) => {

    const [response,setResponse] = useState([]);
    const [image, setImage] = useState("");

    const metadata = async()=>{
        const { data } = await axios.get(
            `https://ipfs.infura.io/ipfs/${uri}`
        );
        setResponse(data);
        // setResponse(JSON.parse(data));
        setImage(data.image);
        // console.log(typeof data.image);
        let pret = image.substr(7,50);
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
    let pret = image.substr(7,50);
    // console.log(pret);

    return (
        <div>
            {/* <pre>{JSON.stringify(response)}</pre> */}

             <img
                 src={`https://ipfs.io/ipfs/${pret}`}
                 alt="" className=" h-60  p-2 w-full object-fit" />
            </div>
    )
}

export default homecomp;
