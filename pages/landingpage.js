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
        <div className="min-h-screen lg:flex justify-center items-center">
          <div className="lg:flex max-w-[1400px] mx-auto p-2 lg:p-0">
            <div className="text-center lg:text-left lg:w-1/2 mb-10">
              <h2 className=" dark:text-white font-raleway font-bold text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-8">
                Collect and trade the New Fresh Thing
              </h2>
              <h6 className="text-lg text-slate-500 lg:w-[80%] font-opensans mb-8">
                A NFT marketplace to explore the digital gold mine, that
                supports the creators. A place where you can Make Collect and
                Sell digital arts.
              </h6>
              <div className="">
                <button className="py-3 px-6 rounded-md bg-[#cafc01] text-black font-semibold">
                  <Link href="/home">
                    <span className="font-raleway">Explore Now</span>
                  </Link>
                </button>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="flex gap-5">
                <div className="flex flex-col gap-5 w-1/3 justify-between">
                  <img src="/design/1.jpg" className="rounded sm:rounded-3xl" alt="" />
                  <img src="/design/2.jpg" className="rounded sm:rounded-3xl" alt="" />
                  <img src="/design/4.jpg" className="rounded sm:rounded-3xl" alt="" />
                </div>
                <div className="flex flex-col gap-5 w-1/3">
                  <img src="/design/8.jpg" className="rounded sm:rounded-3xl" alt="" />
                  <img src="/design/9.jpg" className="rounded sm:rounded-3xl" alt="" />
                  <img src="/design/7.jpg" className="rounded sm:rounded-3xl" alt="" />
                </div>
                <div className="flex w-1/3">
                  <img src="/design/3.jpg" className="object-cover rounded sm:rounded-3xl" alt="" />
                </div>
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