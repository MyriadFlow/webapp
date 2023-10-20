import Image from "next/image";
import Link from "next/link";
import React from "react";
import { NavLink } from "reactstrap";
import Layout from "../Components/Layout";
import { useRouter } from "next/router";

export default function Rewards() {
  const router = useRouter();

  return (
    <Layout title="Drops" description="Airdrop Alert, Claim Your NFTs Now!">
      <div className="flex dark:body-back body-back-light mx-auto items-center justify-center lg:flex-row flex-col">
        <div className="lg:mb-16">
          <img alt="alt" src="/imagere.png" />
        </div>
        <div className="items-center flex flex-col">
          <div className="reward-text text-4xl font-bold lg:mt-18 md:-mt-20">
            {" "}
            Airdrop Alert
          </div>
          <div className="mt-16">
            <div className="text-center text-2xl font-bold text-gray-500 dark:text-white">
              Claim Your NFTs Now!
            </div>
            {/* <div className='text-center text-2xl font-bold text-gray-500 dark:text-white'>Now!</div> */}
          </div>
          <div className="text-gray-500 dark:text-gray text-sm mt-10">
            Currently you do not meet the
          </div>
          <div className="text-gray-500 dark:text-gray text-sm mb-10">
            eligibility requirements
          </div>

          <div className="mt-10 text-2xl text-center text-gray-500 dark:text-white">
            Stay Tunned For Upcoming Drops
          </div>
          <div className="text-center mt-10 mb-10 dark:bg-white bg-blue-500 dark:text-black px-10 py-3 rounded-full ... text-sm">
            <Link className="" href="/explore">
              <div className={router.pathname == "/explore" ? "active " : ""}>
                Explore Now
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
