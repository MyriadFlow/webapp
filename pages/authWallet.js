import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { NavLink } from 'reactstrap'
import Layout from '../Components/Layout'
import { useRouter } from "next/router";

export default function AuthWallet() {
  const router = useRouter();

  return (
    <Layout title="AuthWallet"
    description="This is used to show the Contact To The Marketplace Admin Page">
    <div className='text-center  body-back'>
        <div className='mt-10'>
            <Image alt="alt" width="200" height="200" src="/sadface.png" style={{margin:"0 auto"}}/>
        </div>
        <div className='mt-5 text-gray-500 dark:text-white'>We’ re Sorry!</div>
        <div className='mt-5 text-gray-500 dark:text-white'>Currently You Do Not Have Access to 
the Creator Role. To Gain Access, you Need to Complete 
the Wallet Authentication Process.</div>
<div className='mt-10'>
    <Link className=" bg-white text-black px-4 py-2 rounded-full ... text-sm" href="/explore">
              <NavLink
                className={router.pathname == "/explore" ? "active " : ""}
                style={{ cursor: "pointer" }}
              >
                Explore
              </NavLink>
            </Link>
</div>
    </div>
    </Layout>
  )
}
