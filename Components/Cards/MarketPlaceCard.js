import React from 'react'

export const MarketPlaceCard = (props) => {
    const {image,name,description}=props
    return (
        <div className="relative ...">
          <img
         
            src={image}
            alt="marketcard"
            className=" w-full object-fit rounded-lg mb-3 grow h-60"
          />
         
          <div className="justify-between">
            <div className='text-gray-500 dark:text-white'>Asset Name: {name}</div>
            <div className='text-gray-500 dark:text-white'>Asset Description: {description}</div>
          </div>
        </div>
      );
}
