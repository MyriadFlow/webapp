import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { NavLink } from 'reactstrap'
import Layout from '../Components/Layout'
import { useRouter } from "next/router";

export default function Rewards() {
  const router = useRouter();

  return (
   <Layout title="Drops"description="This is used to show the drops info">
    <div className='flex body-back'>
<div>
  <img alt="alt"  src="/imagere.png"/>
</div>
<div> 
  <div className='reward-text text-4xl font-bold mt-20'> Airdrop Alert</div>
  <div className='mt-20'>
    <div className='text-center text-2xl font-bold text-gray-500 dark:text-white'>Claim Your NFTs </div>
    <div className='text-center text-2xl font-bold text-gray-500 dark:text-white'>Now!</div>
</div>
<div className='text-gray-500 dark:text-white text-sm mt-10'>Currently You Do Not Have Access To </div>
<div className='text-gray-500 dark:text-white text-sm'>The Creator Role. To Gain Access,......</div>

<div className='mt-10 text-center text-gray-500 dark:text-white'>Stay Tunned For Upcoming Drops</div>
<div className='text-center mt-10 bg-white text-black px-4 py-2 rounded-full ... text-sm'>
  <Link className="rewards-style" href="/explore">
              <NavLink
                className={router.pathname == "/explore" ? "active " : ""}
              >
                Explore Now
              </NavLink>
            </Link>
</div>
</div>

    </div>
   </Layout>
  )
}
