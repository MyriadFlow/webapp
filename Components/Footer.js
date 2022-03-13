import React from 'react';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { SiDiscord } from 'react-icons/si';

const Footer = () => {
   let date = new Date();
   let year = date.getFullYear();

   return (
      <div>
         <div className="bg-white dark:bg-gray-900 border-t border-solid">
            <div className="max-w-6xl m-auto text-gray-800 flex flex-wrap justify-center  dark:text-white" style={{ justifyContent: 'space-between' }}>
            </div>
         </div>

         <div className="bg-white dark:bg-gray-900">
            <div className="flex px-3 m-auto text-gray-800 text-sm flex-col md:flex-row max-w-6xl dark:text-white">
               <div className="mt-4">MyriadFlow | Copyright © {year} Lazarus Network Inc. All Rights Reserved.</div>
               <div className="md:flex-auto md:flex-row-reverse flex-row flex mr-16">

                  <a
                     href="" target="_blank"
                     className="hover:text-sky-700 w-6 mx-1 text-blue-500 dark:text-white"
                  >
                     <TelegramIcon />
                  </a>
                  <a
                     href="" target="_blank"
                     className="hover:text-sky-700 w-6 mx-1 text-blue-500 dark:text-white"
                  >
                     <TwitterIcon />
                  </a>
                  <a
                     href="" target="_blank"
                     className="hover:text-sky-700 w-6 mx-1 my-1 text-blue-500 dark:text-white"
                  >
                     <SiDiscord size={22} />
                  </a>
               </div>
            </div>
         </div>
      </div>
   )
};

export default Footer;
