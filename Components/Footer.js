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
               {/* <div className="p-5 w-48 ">
                  <div className="text-xs uppercase text-gray-500 font-medium">Home</div>
                  <a className="hover:text-sky-700 block text-black dark:text-white" href="/#crypto">Crypto <span className="text-teal-600 text-xs p-1"></span></a>
                  <a className="hover:text-sky-700 block text-black dark:text-white" href="/#home">About Us <span className="text-teal-600 text-xs p-1"></span></a>
                  <a className="hover:text-sky-700 block text-black dark:text-white" href="/#subscribe">Subscribe <span className="text-teal-600 text-xs p-1"></span></a>
               </div>
               <div className="p-5 w-48 ">
                  <div className="text-xs uppercase text-gray-500 font-medium">User</div>
                  <a className=" hover:text-sky-700 block text-black dark:text-white" href="https://demo.1ramp.app/login/">Log In <span className="text-teal-600 text-xs p-1"></span></a>
                  <a className="hover:text-sky-700 block text-black dark:text-white" href="https://demo.1ramp.app/signup/">Sign Up <span className="text-teal-600 text-xs p-1"></span></a>
               </div>
               <div className="p-5 w-48 ">
                  <div className="text-xs uppercase text-gray-500 font-medium">Support</div>
                  <a
                     href=""
                     className="hover:text-sky-700 block text-black dark:text-white"
                  >
                     support email
                  </a>
                  <a className="hover:text-sky-700 block text-black dark:text-white" href="/refund">Refund Policy <span className="text-teal-600 text-xs p-1"></span></a>
                  <a className="hover:text-sky-700 block text-black dark:text-white" href="/terms">Terms & Conditions <span className="text-teal-600 text-xs p-1"></span></a>
               </div>
               <div className="p-5 w-48 ">
                  <div className="text-xs uppercase text-gray-500 font-medium">Contact us</div>
                  <a
                     href=""
                     className="hover:text-sky-700 block text-black dark:text-white"
                  >
                     CONTACT_PHONE
                  </a>
                  <a
                     href=""
                     className="hover:text-sky-700 block text-black dark:text-white"
                  >
                     CONTACT_EMAIL
                  </a>
                  <a className="hover:text-sky-700 block text-black dark:text-white" href="https://t.me/oneramp_official" target="_blank">Connect on Telegram<span className="text-teal-600 text-xs p-1"></span></a>
               </div> */}
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
