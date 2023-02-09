import Image from 'next/image'
import React from 'react'
import Layout from '../Components/Layout'

export default function AuthWallet() {
  return (
    <Layout>
    <div className='text-center auth-gradient'>
        <div >
            <Image alt="" width="200" height="200" src="/sadface.png" style={{margin:"0 auto"}}/>
        </div>
        <div className='mt-5'>we’ re sorry!</div>
        <div className='mt-5'>Currently you do not have access to 
the creator role. To gain access, you need to complete 
the wallet authentication process.</div>
<div className='mt-20'>
    <button className='bg-white text-black px-4 py-2 rounded-full ... text-sm'>Authenticate your wallet</button>
</div>
    </div>
    </Layout>
  )
}
