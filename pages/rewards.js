import Image from 'next/image'
import React from 'react'
import Layout from '../Components/Layout'

export default function rewards() {
  return (
   <Layout title="Rewards"description="This is used to show the drops info">
    <div className='flex'>
<div>
  <Image alt="" width="200" height="200" src="/imagere.png"/>
</div>
<div> 
  <div className='reward-text text-4xl font-bold mt-20'>Huge Airdrop Alert:</div>
  <div className='mt-20'>
    <div className='text-center text-2xl font-bold'>Get Free Crypto NFT </div>
    <div className='text-center text-2xl font-bold'>Tokens Now!</div>
</div>
<div className='mt-20 text-center'>Stay tunned for upcoming drops</div>
<div className='text-center mt-10 '>
  <button className='bg-white text-black px-4 py-2 rounded-full ... text-sm' >Explore Now</button>
</div>
</div>

    </div>
   </Layout>
  )
}
