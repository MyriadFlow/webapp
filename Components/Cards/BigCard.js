import { BsHeart } from "react-icons/bs";
const BigCard = ({ name, price, title, img,like }) => {
  return (
    <article className="w-[285px] sm:w-auto flex-shrink-0 mysnap-item">
      <img
        src={img}
        className="rounded-t-3xl w-full  max-w-[400px] h-[280px] sm:h-[400px] object-cover"
        alt=""
      />
      <div className="bg-white p-6 text-black rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <h2 className="text-2xl font-bold mb-12">
          <span className="text-xl">$</span>{price}
        </h2>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="vr.png" className="w-10 rounded-full" alt="" />
            <p className="font-medium">{name}</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="">
              <BsHeart className="text-2xl" />
            </a>
            <p>{like}</p>
          </div>
        </div>
      </div>
    </article>
  );
};
export default BigCard;
