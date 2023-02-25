import React from 'react'

export const  MarketPlaceCardWish = (props) => {
    const {image,name,description}=props
    return (
        <div>
          <img
         
            src={image}
            alt="marketcard"
            className=" w-full object-fit rounded-lg mb-3 grow"
            style={{width:"150px",height:"150px"}}
          />
        </div>
      );
}
