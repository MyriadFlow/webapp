import Link from 'next/link'
import React from 'react'
import { NavLink } from 'reactstrap'
import Layout from '../Components/Layout'
import { useRouter } from "next/router";

export default function about() {
    const router = useRouter();

  return (
    <Layout title="About"description="This is used to show the information of the marketplace application">
        <div className='flex'>
            <div style={{padding:"10px 10px 10px 106px"}}>
                <div className='text-3xl font-bold mt-10' style={{color:"#00FFBD"}}>
                Experience the Power of NFTs: 
                </div>
                <div className='mt-10 text-2xl'>From Exploration to Launch</div>
                <div className='mt-10' >
                    <p className='text-sm'>NFT stands for Non-Fungible Token, which is a unique digital asset 
stored on a blockchain. NFTs are unique and cannot be replaced 
or exchanged on a one-to-one basis. . NFTs can be used to
 represent a wide range of assets, including digital art, music,
videos, collectibles, and more. They are becoming 
increasingly popular as a way to own and trade unique 
digital assets in a secure and verifiable manner.</p>
                </div>
                <div className='mt-10' >
                    <p className='text-sm'>MyriadFlow is an innovative platform to explore & launch NFT 
Experiences. Dive into the next generation of Utility NFTs through 
our Revolutionary App Store. A secure platform with robust measures
in place to protect users' digital assets is essential for users to feel 
confident and secure in their NFT transactions.</p>
                </div>
                <div className='mt-10'>Interested in Joining us ?</div>
                <div className='mt-5 '>
                    <Link  href="/explore">
              <NavLink
                className={router.pathname == "/explore" ? "active " : ""}
                style={{ cursor: "pointer" }}
              >
                    <button className='bg-white text-black px-4 py-2 rounded-full ... text-sm'style={{border:"1px solid "}} >Explore Now</button>
              </NavLink>
            </Link>
                </div>

            </div>
            <div className='w-full mt-28' style={{padding:"0px 70px 0px 0px"}}>
                <img className='' src="aboutIm.png"></img>
            </div>
        </div>
    </Layout>
  )
}
