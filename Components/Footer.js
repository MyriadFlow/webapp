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
      <div className="bg-white dark:bg-gray-900 border-t border-solid">
        <div className="max-w-6xl m-auto text-gray-800 flex flex-wrap justify-center  dark:text-white"></div>
      </div>

      <div className="bg-white dark:bg-gray-900">
        <div className="m-auto text-gray-800 text-sm flex flex-col md:flex-row md:justify-between max-w-6xl dark:text-white py-2 px-1 text-black">
          <div className="">
            MyriadFlow | Copyright © {year} Lazarus Network Inc. All Rights
            Reserved.
          </div>
          <div className="flex gap-x-4 items-center">
            <Link
              href="https://t.me/MyriadFlow"
              target="_blank"
              className="hover:text-sky-700 text-blue-500 dark:text-white"
            >
              <Link href="" className="hover:text-sky-500">
                <TelegramIcon />
              </Link>
            </Link>
            <Link
              href="https://twitter.com/0xMyriadFlow"
              target="_blank"
              className="hover:text-sky-700 text-blue-500 dark:text-white"
            >
              <Link href="" className="hover:text-sky-500">
                <TwitterIcon />
              </Link>
            </Link>
            <Link
              href="https://discord.gg/38jktRtuY7"
              target="_blank"
              className="hover:text-sky-700 text-blue-500 dark:text-white"
            >
              <Link href="" className="hover:text-sky-500">
                <SiDiscord size={22} />
              </Link>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
