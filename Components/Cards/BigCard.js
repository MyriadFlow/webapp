import Image from "next/image";
import Link from "next/link";
import { BsHeart } from "react-icons/bs";
import LandingMetaData from "../LandingMetaData";
const BigCard = ({ name,description, price, title, img,like }) => {
  return (
    <article className="w-[240px] sm:w-auto flex-shrink-0 mycard p-3"style={{border:"2px solid white"}}>
      <img
        src={img}
        className=" grow rounded-t-3xl w-full  max-w-[300px] h-[280px] sm:h-[300px] object-cover"
        alt="big1"
        width="200"
        height="200"
      />

           
      <div className="bg-white p-6 text-black rounded-b-3xl max-w-[300px]">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <div className="flex justify-between">
        <div className="text-2xl font-bold mb-12">
          <span className="text-xl">$</span>{(price)}
        </div>
        <div>{description}</div>

        </div>
       
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image width="200" height="200" src="/vr.png" className="w-10 rounded-full" alt="big2" />
            <div className="font-medium">{name}</div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="">
              <BsHeart className="text-2xl" />
            </Link>
            <div>{like}</div>
          </div>
        </div>
      </div>
    </article>
  );
};
export default BigCard;
