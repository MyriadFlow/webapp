import Head from "next/head";
import Link from "next/link";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Layout from "../Components/Layout";

function landingpage() {
  return (
    <div>
      <Head>
        <title>Marketplace</title>
      </Head>
      <Layout>
        <div className="mt-[49px] min-h-[calc(100vh-49px)]">
          <div className="w-[85vw] max-w-[750px] mx-auto">
            <img
              className="w-full pt-4 sm:pt-8 sm:mb-4"
              src="/nft.svg"
              alt=""
            />
            <div className="text-center">
            <h2 className="text-fontblue dark:text-white font-raleway font-bold text-3xl sm:text-4xl mb-2 sm:mb-8">
            Collect and trade the New Fresh Thing
              </h2>
              <h6 className="text-lg font-opensans max-w-[650px] mx-auto text-fontblue dark:text-white mb-8">
              A NFT marketplace to explore the digital gold mine, that supports the creators. A place where you can Make Collect and Sell digital arts.
              </h6>
              <div className="">
                <button className=" bg-blue-500 dark:bg-purple-700 text-xl sm:text-2xl uppercase shadow-md py-3 outline-2 
                outline-offset-4 outline-blue-500 dark:outline-white outline px-8 sm:mb-4 transition duration-300  
                ease-in text-white font-bold hover:bg-white hover:text-blue-500  dark:hover:bg-white dark:hover:text-purple-700">
                  <Link href="/home">
                    <span className="font-raleway">Explore</span>
                  </Link>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </Layout>
    </div>
  );
}

export default landingpage;