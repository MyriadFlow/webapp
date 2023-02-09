import Image from "next/image";
import Link from "next/link";
import { BsHeart } from "react-icons/bs";
const BigCard = ({ name, price, title, img,like }) => {
  return (
    <article className="w-[240px] sm:w-auto flex-shrink-0">
      <Image
        src={img}
        className="rounded-t-3xl w-full  max-w-[400px] h-[280px] sm:h-[400px] object-cover"
        alt="big1"
        width="200"
        height="200"

      />
      <div className="bg-white p-6 text-black rounded-b-3xl max-w-[400px]">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <h2 className="text-2xl font-bold mb-12">
          <span className="text-xl">$</span>{price}
        </h2>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image width="200" height="200" src="/vr.png" className="w-10 rounded-full" alt="big2" />
            <p className="font-medium">{name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="">
              <BsHeart className="text-2xl" />
            </Link>
            <p>{like}</p>
          </div>
        </div>
      </div>
    </article>
  );
};
export default BigCard;
