import Head from "next/head";
import Link from "next/link";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Layout from "../Components/Layout";
import { BsHeart } from "react-icons/bs";
import BigCard from "../Components/Cards/BigCard";
import SmallCard from "../Components/Cards/SmallCard";
// import NotifyContainer from "../Components/NotifyContainer";
import Slider from "react-slick";

function landingpage() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  const settings2 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
        <title>Marketplace</title>
      </Head>
      <Layout>
        {/* <NotifyContainer /> */}
        <div className="min-h-screen lg:flex justify-center items-center">
          <div className="lg:flex xl:gap-8 lg:w-[1025px] x2:w-[1200px] xxl:w-[1400px] mx-auto lg:mt-12">
            <div className="text-center lg:text-left lg:w-1/2 mt-16 lg:mt-0  p-2 sm:p-4 lg:px-8 lg:pt-0">
              <h2 className=" dark:text-white font-poppins font-bold m48:w-[470px] l32:w-[450px] xxl:w-auto  text-3xl sm:text-4xl lg:text-6xl x2:text-7xl xxl:text-8xl capitalize mb-8 x2:mb-10 mx-auto lg:mx-0">
                Collect and trade the New Fresh Thing
              </h2>
              <h6 className="text-lg x2:text-2xl text-slate-500 m48:max-w-[487px] mx-auto lg:mx-0 lg:w-[80%] font-opensans mb-8">
                A NFT marketplace to explore the digital gold mine, that
                supports the creators. A place where you can Make Collect and
                Sell digital arts.
              </h6>
              <div className="lg:flex items-center lg:gap-x-4 x2:gap-x-6 xl:gap-x-10 mb-8 lg:mb-0">
                <button className="py-3 px-6 rounded-lg bg-[#0162ff] text-white font-semibold mb-8 lg:mb-0">
                  <Link href="/home">
                    <span className="font-raleway">Explore Now</span>
                  </Link>
                </button>
                <div className="flex flex-col x2:text-lg lg:flex-row items-center font-bold gap-4 x2:gap-6 xl:gap-8 text-center text-[#83838e] dark:text-gray-100">
                  <div>
                    <h4 className="text-3xl">1800+</h4>
                    <p className="capitalize">auction</p>
                  </div>
                  <div>
                    <h4 className="text-3xl">55k</h4>
                    <p className="capitalize">artworks</p>
                  </div>
                  <div>
                    <h4 className="text-3xl">38k</h4>
                    <p className="capitalize">artists</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pr-8">
              <div className="flex gap-2 m48:gap-3 lg:gap-5">
                <div className="flex flex-col gap-5 w-1/3 justify-between">
                  <img
                    src="/design/1.jpg"
                    className="rounded-xl m37:rounded-3xl"
                    alt=""
                  />
                  <img
                    src="/design/2.jpg"
                    className="rounded-xl m37:rounded-3xl"
                    alt=""
                  />
                  <img
                    src="/design/4.jpg"
                    className="rounded-xl m37:rounded-3xl"
                    alt=""
                  />
                </div>
                <div className="flex flex-col gap-5 w-1/3">
                  <img
                    src="/design/8.jpg"
                    className="rounded-xl m37:rounded-3xl"
                    alt=""
                  />
                  <img
                    src="/design/9.jpg"
                    className="rounded-xl m37:rounded-3xl"
                    alt=""
                  />
                  <img
                    src="/design/7.jpg"
                    className="rounded-xl m37:rounded-3xl"
                    alt=""
                  />
                </div>
                <div className="flex w-1/3">
                  <img
                    src="/design/3.jpg"
                    className="object-cover rounded-xl m37:rounded-3xl"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Call to Action Button */}
        <section className="max-w-[1280px] mx-auto px-8 my-20">
          <div className="bg-white sm:text-xl font-semibold text-black mx-auto p-6 sm:p-8 lg:p-10 gap-x-4 flex items-center justify-between rounded-2xl">
            <h1 className="">Polygon is in beta on MyriadFlow</h1>
            <a href="" className="text-white bg-[#0162ff] py-2 px-3 rounded-md">
              Explore
            </a>
          </div>
        </section>

        {/* Trending Section */}
        <section className="mb-20">
          <h1 className="text-center text-6xl font-semibold mb-20">Trending</h1>
          <div className="bg-[#161a1d] py-16">
            <div>
              <Slider {...settings} className="max-w-[1280px] mx-auto">
                <BigCard
                  title="VR BOY #007"
                  img="vr.png"
                  price="100,000"
                  name="John Sanders"
                  like={76}
                />
                <BigCard
                  title="VR BOY #007"
                  img="vr.png"
                  price="100,000"
                  name="John Sanders"
                  like={76}
                />
                <BigCard
                  title="Monkey #AK007"
                  img="monkey.png"
                  price="100,000"
                  name="Bernie Sanders"
                  like={99}
                />
                <BigCard
                  title="Warrior #786"
                  img="nft-gb70e4bed1_1920.jpg"
                  price="100,000"
                  name="Warrior"
                  like={101}
                />
              </Slider>
            </div>
          </div>
        </section>
        {/* End Of Trending Section */}
        {/* Highlight Section */}
        <div className="mb-20">
          <h1 className="text-center text-6xl font-semibold mb-20">
            Highlights
          </h1>
          <div className="max-w-[1280px] mx-auto bg-[#161a1d] rounded-3xl">
            <div className="px-10 py-10 bg-[#0e1012] rounded-tl-3xl rounded-bl-3xl myhigh inline-block">
              <article className="w-[285px] sm:w-[400px] flex-shrink-0">
                <h1 className="text-center text-2xl font-semibold mb-10">
                  Highlight of the Day
                </h1>
                <img
                  src="nft-gb70e4bed1_1920.jpg"
                  className="rounded-t-3xl w-full max-w-[400px] h-[400px] object-cover"
                  alt=""
                />
                <div className="bg-white p-6 text-black rounded-b-3xl">
                  <h1 className="text-2xl font-bold mb-2">Warrior #786</h1>
                  <h2 className="text-2xl font-bold mb-12">
                    <span className="text-xl">$</span>100,000
                  </h2>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img src="vr.png" className="w-10 rounded-full" alt="" />
                      <p className="font-medium">Warrior</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href="">
                        <BsHeart className="text-2xl" />
                      </a>
                      <p>76</p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            <Slider {...settings2}>
              <SmallCard
                title="Monkey #AK007"
                img="monkey.png"
                price="100,000"
                name="Bernie Sanders"
                like={99}
              />

              <SmallCard
                title="Monkey #AK007"
                img="monkey.png"
                price="100,000"
                name="Bernie Sanders"
                like={99}
              />
              <SmallCard
                title="Monkey #AK007"
                img="monkey.png"
                price="100,000"
                name="Bernie Sanders"
                like={99}
              />
              <SmallCard
                title="Monkey #AK007"
                img="monkey.png"
                price="100,000"
                name="Bernie Sanders"
                like={99}
              />
              <SmallCard
                title="Monkey #AK007"
                img="monkey.png"
                price="100,000"
                name="Bernie Sanders"
                like={99}
              />
              <SmallCard
                title="Monkey #AK007"
                img="monkey.png"
                price="100,000"
                name="Bernie Sanders"
                like={99}
              />
              <SmallCard
                title="Monkey #AK007"
                img="monkey.png"
                price="100,000"
                name="Bernie Sanders"
                like={99}
              />
              <SmallCard
                title="Monkey #AK007"
                img="monkey.png"
                price="100,000"
                name="Bernie Sanders"
                like={99}
              />
            </Slider>
          </div>
        </div>
        {/* End Of Highlight Section */}
        {/* <Footer /> */}
      </Layout>
    </div>
  );
}

export default landingpage;
