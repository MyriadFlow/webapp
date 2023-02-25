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
      description="This is used to show the information of the marketplace application"
    >
      <div className="flex body-back">
        <div style={{ padding: "10px 10px 10px 106px" }}>
          <div
            className="text-3xl font-bold mt-10 text-gray-500 dark:text-white"
            style={{ color: "#00FFBD" }}
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
              <NavLink
                className={router.pathname == "/explore" ? "active " : ""}
                style={{ cursor: "pointer" }}
              >
                <button
                  className="bg-white text-black px-4 py-2 rounded-full ... text-sm"
                  style={{ border: "1px solid " }}
                >
                  Explore Now
                </button>
              </NavLink>
            </Link>
          </div>
        </div>
        <div className="w-full mt-28" style={{ padding: "0px 70px 0px 0px" }}>
          <Image  width={7000} height={700}  src="/aboutIm.png"alt="Picture of the author"/>
        </div>
      </div>
    </Layout>
  );
}
