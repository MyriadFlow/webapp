import React from "react";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { SiDiscord } from "react-icons/si";
import Link from "next/link";

const Footer = () => {
  let date = new Date();
  let year = date.getFullYear();

  return (
    <div>
      <div className="bg-white dark:bg-gray-900 border-t border-solid mt-5">
        <div className="max-w-6xl m-auto text-gray-800 flex flex-wrap justify-center  dark:text-white"></div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 ">
        <div>
          <div className="flex text-center justify-between">
            <div className="flex items-center">
            <div>
          <Link href="/">
            <div className="pt-2 transition-all cursor-pointer">
              <span className="dark:block hidden">
                <img src="/dark.svg" width="60" height="60" />
              </span>
              <span className="dark:hidden ">
                <img src="/light.svg" width="60" height="60" />
              </span>
            </div>
          </Link>
         
          
          </div>
          <div className="ml-5" style={{width:"20%"}}>
          <div className="font-bold ">
          Myriadflow
          </div>
          <div >MyriadFlow is an innovative platform to
explore & launch NFT Experiences. Dive into
the next generation of Utility NFTs through 
our Revolutionary App Store Explore.</div>
</div>
         </div>
         
         
        <div>
          <div className="font-bold">Join Us</div>

          <div className="flex gap-x-4 items-center mt-5">
            <Link 
              href="https://t.me/MyriadFlow"
              target="_blank"
              className="hover:text-sky-700 text-blue-500 dark:text-white border-solid border-2 border-indigo-600 ... p-1"
            >
              <div  className="hover:text-sky-500">
                <TelegramIcon />
              </div>
            </Link>
            <Link
              href="https://twitter.com/0xMyriadFlow"
              target="_blank"
              className="hover:text-sky-700 text-blue-500 dark:text-white border-solid border-2 border-indigo-600 ... p-1"
            >
              <div  className="hover:text-sky-500">
                <TwitterIcon />
              </div>
            </Link>
            <Link
              href="https://discord.gg/38jktRtuY7"
              target="_blank"
              className="hover:text-sky-700 text-blue-500 dark:text-white border-solid border-2 border-indigo-600 ... p-1"
            > 
              <div  className="hover:text-sky-500">
                <SiDiscord size={22} />
              </div>
            </Link>
          </div>
          </div>
          </div>
          
       
        
        </div>
        <div className="m-auto text-gray-800 text-sm flex flex-col dark:text-white py-2 px-1 text-black text-center gradient-blue mt-3">
          <div className="font-bold">
            MyriadFlow | Copyright © {year} Lazarus Network Inc. All Rights
            Reserved.
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default Footer;
