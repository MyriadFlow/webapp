import React from 'react'

export const  MarketPlaceCardWish = (props) => {
    const {image}=props
    return (
        <div>
          <img
         
            src={image}
            alt="marketcard"
            className=" object-fit rounded-lg mb-3 grow h-52 w-52"

          />
        </div>
      );
}
