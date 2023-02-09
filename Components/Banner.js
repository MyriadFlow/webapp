import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"

function Banner() {
    return (
        <div>

        <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showThumbs={false}
        interval={3000}
        showArrows={false}
        >
            <div className="">
                <Image width="200" height="200" alt="banner" loading="lazy" src="/pic1.png"/>
            </div>
            <div>
                <Image width="200" height="200" alt="banner2" loading="lazy" src="/pic2.jpg" />
            </div>
            <div>
                <Image width="200" height="200" alt="banner3" loading="lazy" src="/pic3.jpeg" />
            </div>
        </Carousel>
            
        </div>
    )
}

export default Banner
