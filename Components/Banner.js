import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"
import Image from "next/image"


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
                <img loading="lazy" src="/pic1.png"/>
            </div>
            <div>
                <img  loading="lazy" src="/pic2.jpg" />
            </div>
            <div>
                <img loading="lazy" src="/pic3.jpeg" />
            </div>
        </Carousel>
            
        </div>
    )
}

export default Banner
