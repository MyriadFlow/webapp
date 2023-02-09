import React from 'react'

export const MarketPlaceCard = (props) => {
    const {image,name,description}=props
    return (
        <div>
          <img
         
            src={image}
            alt="marketcard"
            className=" w-full object-fit rounded-lg mb-3"
          />
          <div className="flex justify-between">
            <div>{name}</div>
            <div>{description}</div>
          </div>
        </div>
      );
}
