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
                <img alt="" loading="lazy" src="/pic1.png"/>
            </div>
            <div>
                <img alt="" loading="lazy" src="/pic2.jpg" />
            </div>
            <div>
                <img alt="" loading="lazy" src="/pic3.jpeg" />
            </div>
        </Carousel>
            
        </div>
    )
}

export default Banner
