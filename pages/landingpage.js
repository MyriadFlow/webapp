import Head from "next/head"
import Link from "next/link";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function landingpage() {
  return (
    <div className="h-screen">
      <Head>
        <title>Marketplace</title>
      </Head>
      <Header />
      <div className="background"></div>
      <div className="flex items-center justify-center px-3 sm:px-6 md:px-10" style={{marginTop:-650}}>
        <div className="rounded-lg">
          <div className="flex flex-col-reverse lg:flex-row items-center mt-10 sm:mt-12 md:mt-16 lg:mt-12 xl:mt-1 justify-center">
            <div className="flex flex-1  flex-col items-center lg:items-start lg:p-10 ">
              <h2 className="text-3xl md:text-4xl  font-bold text-white lg:text-5xl text-center lg:text-left mb-6 uppercase z-10">Discover, collect, and sell extraordinary NFTs</h2>
              <h6 className="text-lg  text-white text-center lg:text-left mb-6 z-10">A new NFT marketplace, to buy and sell your art</h6>
              <div className="flex justify-center flex-wrap gap-6">
                
                  <button
                    className=" bg-blue-500 shadow-md py-3 px-6 rounded-md transition duration-300  ease-in text-white font-semibold hover:bg-purple-900 z-10"><Link href="/home">Explore</Link></button>
                
              </div>
            </div>
            <div className="flex justify-center flex-1 mb-4 md:mb-10  lg:mb-0  z-10">
              <img className="w-62 h-56 sm:w-3/5 sm:h-3/5 md:w-80 md:h-72 lg:w-full lg:h-full" src="/landing.png" alt="" />
            </div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default landingpage
