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
        <div className="local-background mt-[49px] min-h-[calc(100vh-49px)]">
          <div className="w-[85vw] max-w-[770px] mx-auto">
            <img className="w-full pt-8 mb-4" src="/nft.svg" alt="" />
            <div className="text-center">
              <h2 className="text-fontblue dark:text-white font-raleway font-bold text-3xl sm:text-4xl mb-8">
                Discover, collect, and sell extraordinary NFTs
              </h2>
              <h6 className="text-lg font-opensans max-w-[650px] mx-auto text-fontblue dark:text-white mb-10">
                A new NFT marketplace, to buy and sell your art Lorem ipsum
                dolor sit amet consectetur adipisicing elit. Similique inventore
                magni repellendus
              </h6>
              <div className="">
                <button className=" bg-blue-500 text-xl sm:text-2xl uppercase shadow-md py-4 outline-2 outline-offset-4 outline-blue-500 dark:outline-white outline px-12 transition duration-300  ease-in text-white font-bold hover:bg-white hover:text-blue-500">
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