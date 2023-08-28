import Link from "next/link";
import React from "react";
import { NavLink } from "reactstrap";
import Layout from "../Components/Layout";
import { useRouter } from "next/router";
import Image from 'next/image'
export default function About() {
  const router = useRouter();
  return (
    <Layout
      title="About"
      description="All the information you want to know about NFT and the company is here."
    >
      <div className="flex dark:body-back body-back-light mx-auto items-center justify-center lg:flex-row flex-col lg:px-32 px-10 pb-10">
      <div className="lg:w-1/2 w-full mt-6 lg:hidden block">
          <img src="/aboutIm.png"alt="Picture of the author"/>
        </div>
        <div className="lg:w-1/2">
          <div
            className="text-3xl font-bold mt-10 text-gray-500 dark:text-green-400 text-green-400"
          >
            Experience the Power of NFTs:
          </div>
          <div className="mt-10 text-2xl text-gray-500 dark:text-white">From Exploration to Launch</div>
          <div className="mt-10 text-sm text-gray-500 dark:text-white">
            NFT Stands for Non-Fungible Token, which is a Unique Gigital Asset
            Stored on a Blockchain. NFTs are Unique and cannot be Replaced or
            exchanged on a one-to-one basis. NFTs can be used to represent a
            Wide Range of Assets, Including Digital Art, Music, videos,
            Collectibles, and More. They are Becoming Increasingly Popular as a
            Way to Own and Trade Unique Digital Assets in a Secure and
            Verifiable Manner.
          </div>
          <div className="mt-10 text-sm text-gray-500 dark:text-white">
            MyriadFlow is an Innovative Platform to Explore and Launch NFT
            Experiences into the next generation of Utility NFTs through
            our Revolutionary App Store. A Secure Platform with Robust Measures
            in Place to Protect Users Digital Assets is Essential for Users to
            Feel Confident and Secure in Their NFT Transactions.
          </div>
          <div className="mt-10 text-gray-500 dark:text-white">Interested in Joining Us ?</div>
          <div className="mt-5 ">
            <Link href="/explore">
              <div
                className={router.pathname == "/explore" ? "active " : ""}
              >
                <button
                  className="bg-white text-black px-4 py-2 rounded-full ... text-sm border-black"
                >
                  Explore Now
                </button>
              </div>
            </Link>
          </div>
        </div>
        <div className="lg:w-1/2 w-full mt-6 lg:block hidden">
          <img src="/aboutIm.png"alt="Picture of the author"/>
        </div>
      </div>

      
    </Layout>
  );
}
