import React from "react";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { SiDiscord } from "react-icons/si";
import Link from "next/link";
import { useRouter } from "next/router";
import { NavLink } from "reactstrap";
import Image from "next/image";

const Footer = () => {
  let date = new Date();
  let year = date.getFullYear();
  const router = useRouter();


  return (
    <div>
      <div className="bg-white dark:bg-gray-900 border-t border-solid mt-5">
        <div className="max-w-6xl m-auto text-gray-800 flex flex-wrap justify-center  dark:text-white"></div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 ">
        <div className="flex text-center "style={{padding:"10px 24px 10px 40px"}}>
          <div>
            <div>
              <Link href="/">
                <div className="pt-2 transition-all cursor-pointer">
                  <span className="dark:block hidden">
                    <Image alt="dark" src="/dark.svg" width="60" height="60" />
                  </span>
                  <span className="dark:hidden ">
                    <Image alt="light" src="/light.svg" width="60" height="60" />
                  </span>
                </div>
              </Link>
            </div>
           
              <div className="font-bold text-2xl text-left cursor-pointer">Myriadflow</div>
              <div className="mt-5 text-sm text-left" style={{width:"33%"}}>
                MyriadFlow is an innovative platform to explore & launch NFT
                Experiences. Dive into the next generation of Utility NFTs
                through our Revolutionary App Store Explore.
              </div>
          
          </div>

          <div className="flex gap-24 cursor-pointer">
            <div>
              <div className="font-bold text-2xl">Explore</div>
              <div className="mt-5 text-sm">All</div>
              <div className="text-sm">Image</div>
              <div className="text-sm">Music</div>
              <div className="text-sm">Video</div>
              <div className="text-sm">Document</div>
              <div className="text-sm">Others</div>
            </div>
            <div>
              <div className="font-bold text-2xl">Dashboard</div>
              <div className="mt-5 text-sm">Created</div>
              <div className="text-sm">Sold</div>
              <div className="text-sm">Buy</div>
              <div className="text-sm">Market</div>
            </div>
            <div>
              <div className="font-bold text-2xl"> profile</div>
              <div className="mt-5 text-sm">Create</div>
              <div className="text-sm">Wishlist</div>
              <div className="text-sm">Cart</div>
            </div>
            <div>
              <div className="font-bold text-2xl">Company</div>
              <div className="mt-5 text-sm">
              <Link  href="/about">
              <NavLink
                className={router.pathname == "/about" ? "active " : ""}
                style={{ cursor: "pointer" }}
              >
                About
              </NavLink>
            </Link>
            </div>
            </div>
            <div>
            <div className="font-bold text-2xl">Join Us</div>

            <div className="flex gap-x-4 items-center mt-5">
              <Link
                href="https://t.me/MyriadFlow"
                target="_blank"
                className="hover:text-sky-700 text-blue-500 dark:text-white border-solid border-2 border-indigo-600 ... p-1"
              >
                <div className="hover:text-sky-500">
                  <TelegramIcon />
                </div>
              </Link>
              <Link
                href="https://twitter.com/0xMyriadFlow"
                target="_blank"
                className="hover:text-sky-700 text-blue-500 dark:text-white border-solid border-2 border-indigo-600 ... p-1"
              >
                <div className="hover:text-sky-500">
                  <TwitterIcon />
                </div>
              </Link>
              <Link
                href="https://discord.gg/38jktRtuY7"
                target="_blank"
                className="hover:text-sky-700 text-blue-500 dark:text-white border-solid border-2 border-indigo-600 ... p-1"
              >
                <div className="hover:text-sky-500">
                  <SiDiscord size={22} />
                </div>
              </Link>
            </div>
          </div>
          </div>
         
        </div>

        <div className="m-auto text-gray-800 text-sm flex flex-col dark:text-white py-2 px-1 text-black text-center gradient-blue mt-10">
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
