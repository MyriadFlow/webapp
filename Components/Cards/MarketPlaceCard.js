import React from 'react'

export const MarketPlaceCard = (props) => {
    const {image,name,description}=props
    return (
        <div>
          <img
         
            src={image}
            alt="marketcard"
            className=" w-full object-fit rounded-lg mb-3 grow"
          />
          <div className="flex justify-between">
            <div className='text-gray-500 dark:text-white'>{name}</div>
            <div className='text-gray-500 dark:text-white'>{description}</div>
          </div>
        </div>
      );
}
