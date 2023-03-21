import dynamic from "next/dynamic";

const Insta = dynamic(() => import("./insta"), { ssr: false });

function Instagram() {
  return (
    <div>
      <Insta />
    </div>
  );
}

export default Instagram;
