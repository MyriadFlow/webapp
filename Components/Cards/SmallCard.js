import Image from "next/image";
import Link from "next/link";
import { BsHeart } from "react-icons/bs";

const SmallCard = ({ title, img, price, like, name }) => {
  return (
    <article className="w-[240px] flex-shrink-0">
      <Image width="200" height="200"
        src={img} 
        className="rounded-t-3xl w-full max-w-[240px] h-[240px] object-cover"
        alt="small1"
      />
      <div className="bg-white p-3 text-black rounded-b-3xl">
        <h1 className="text-xl font-bold mb-1">{title}</h1>
        <h2 className="text-2xl font-bold mb-6">
          <span className="text-lg">$</span>
          {price}
        </h2>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image width="200" height="200" src="/vr.png" className="w-8 rounded-full" alt="small2" />
            <p className="font-medium">{name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="">
              <BsHeart className="text-xl" />
            </Link>
            <p>{like}</p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default SmallCard;
