import Image from "next/image";
import Link from "next/link";
import { BsHeart } from "react-icons/bs";

const SmallCard = ({ title, img, price, like, name }) => {
  return (
    <div className="w-[240px] flex-shrink-0">
      <Image width="200" height="200"
        src={img} 
        className="rounded-t-3xl w-full max-w-[240px] h-[240px] object-cover"
        alt="small1"
      />
      <div className="bg-white p-3 text-black rounded-b-3xl">
        <h1 className="text-xl font-bold mb-1">{title}</h1>
        <div className="text-2xl font-bold mb-6">
          <span className="text-lg">$</span>
          {price}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image width="200" height="200" src="/vr.png" className="w-8 rounded-full" alt="small2" />
            <div className="font-medium">{name}</div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="">
              <BsHeart className="text-xl" />
            </Link>
            <div>{like}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallCard;
