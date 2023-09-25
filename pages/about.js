import Link from "next/link";
import React from "react";
import { NavLink } from "reactstrap";
import Layout from "../Components/Layout";
import { useRouter } from "next/router";
import Image from 'next/image';
import { useData } from "../context/data";

export default function About() {
  const router = useRouter();

  const { resdata } = useData();

  return (
    <Layout
      title="About"
      description="All the information you want to know about NFT and the company is here."
    >
      <div className="min-h-screen dark:body-back body-back-light">
        <div className="w-4/5 mx-auto p-28 border rounded-lg" style={{backgroundColor: '#FFFFFF'}}> image</div>
        <div className="text-center">
<div className="text-3xl font-bold pt-10">What we do</div>
<div className="text-xl lg:w-1/3 md:w-1/3 mx-auto mt-4 mb-20">Lorem ipsum dolor sit amet. Et odit quibusdam est 
saepe eaque qui enim reprehenderit quo voluptas 
rerum. Sed voluptate possimus aut quidem 
molestias cum velit enim rem maiores temporibus.</div>
</div>
      <div className="flex mx-auto items-center justify-center lg:flex-row flex-col lg:px-32 px-10 pb-60">
        
        <div className="lg:w-1/2 w-full mt-6">
          <img src={resdata?.Storefront.relevantImage} alt="Picture of the owner" />
        </div>
        <div className="lg:w-1/2">
          <div className="text-3xl font-bold">Name</div>
          <div className="text-3xl mt-10">Profession</div>
          <div className="mt-16">Alex Turner is a visionary e-commerce entrepreneur with a passion for creating innovative
            online marketplaces. With a background in computer science and a knack for identifying
            market trends, Alex founded their first successful online marketplace at the age of 25.
            They are committed to fostering a vibrant community of buyers and sellers, empowering small
            businesses, and driving economic growth through their platforms.</div>
          <div className="mt-4">Seattle, Washington, USA</div>
          {/* <div
            className="text-3xl font-bold mt-10 text-gray-500 dark:text-green-400 text-green-400"
          >
            Owner: {resdata?.Storefront.owner}
          </div>
          <div className="mt-10 text-2xl text-gray-500 dark:text-white">{resdata?.Storefront.personalTagline}</div>
          <div className="mt-10 text-sm text-gray-500 dark:text-white">
            Description: {resdata?.Storefront.personalDescription}
          </div>
          <div className="mt-10 text-sm text-gray-500 dark:text-white">
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
          </div> */}
        </div>
        {/* <div className="lg:w-1/2 w-full mt-6 lg:hidden block">
          <img src={resdata?.Storefront.relevantImage} alt="Picture of the owner"/>
        </div> */}
      </div>
      </div>

    </Layout>
  );
}
