import { useState } from "react"
import { AiOutlineClose } from "react-icons/ai"
import { BsFilter } from "react-icons/bs"
import { RiArrowDropDownLine } from "react-icons/ri"
import { MdOutlineColorLens } from "react-icons/md"
import { GiCardRandom } from "react-icons/gi"
import { GiWallet } from "react-icons/gi"
import { MdSportsVolleyball } from "react-icons/md"
import { MdMusicNote } from "react-icons/md"

function Filter({ toogle, filter }) {

    const [opendrop, Setopendrop] = useState(false);
    const [status, Setstatus] = useState(false);

    return (
        <div className={!filter ? "fixed top-[49px] w-full  z-40 md:w-2/6 h-full  dark:bg-gray-900 bg-white filter right-0 overflow-y-auto" : "hidden"}>
            <div className=" flex p-2 px-4 justify-between items-center border-b-2">
                <div className="flex space-x-2 items-center">
                    <div className="font-semibold text-lg">Filter</div>
                    <BsFilter className="h-8 w-8" />
                </div>

                <AiOutlineClose onClick={toogle} className="h-6 w-6" />

            </div>
            <div
                onClick={() => Setopendrop(!opendrop)}
                className="flex items-center cursor-pointer justify-between border-b-2 shadow-sm p-2 px-4 group">
                <div className="font-semibold text-lg">Category</div>
                <RiArrowDropDownLine className="h-8 w-8 text-gray-400 group-hover:text-black" />
            </div>
            {opendrop && <div className="">

                <div className="flex items-center p-2  px-8 space-x-2 group hover:bg-blue-100 cursor-pointer">
                    <MdOutlineColorLens className="h-8 w-8 text-blue-400" />
                    <div className="text-md  text-gray-500 font-bold group-hover:text-black">Art</div>
                </div>

                <div className="flex items-center p-2  px-8 space-x-2 group hover:bg-blue-100 cursor-pointer">
                    <MdMusicNote className="h-8 w-8 text-blue-400" />
                    <div className="text-md  text-gray-500 font-bold group-hover:text-black">Music</div>
                </div>

                <div className="flex items-center p-2  px-8 space-x-2 group hover:bg-blue-100 cursor-pointer">
                    <MdSportsVolleyball className="h-8 w-8 text-blue-400" />
                    <div className="text-md  text-gray-500 font-bold group-hover:text-black">Sports</div>
                </div>

                <div className="flex items-center p-2  px-8 space-x-2 group hover:bg-blue-100 cursor-pointer">
                    <GiWallet className="h-8 w-8 text-blue-400" />
                    <div className="text-md  text-gray-500 font-bold group-hover:text-black">Utility</div>
                </div>
                <div className="flex items-center p-2  px-8 space-x-2 group hover:bg-blue-100 cursor-pointer">
                    <GiCardRandom className="h-8 w-8 text-blue-400" />
                    <div className="text-md  text-gray-500 font-bold group-hover:text-black">Trading Cards</div>
                </div>
            </div>}

            <div
                onClick={() => Setstatus(!status)}
                className="flex items-center cursor-pointer justify-between border-b-2 shadow-sm p-2 px-4 group border-t-2">
                <div className="font-semibold text-lg">Status</div>
                <RiArrowDropDownLine className="h-8 w-8 text-gray-400 group-hover:text-black" />
            </div>

            {status && <div className=" grid grid-cols-2 p-2 px-8">

                <div className="p-4 font-semibold text-md text-gray-500 hover:text-black cursor-pointer bg-gray-100  hover:bg-blue-100 rounded-md mt-2 ml-2">New</div>
                <div className="p-4 font-semibold text-md text-gray-500 hover:text-black cursor-pointer bg-gray-100 hover:bg-blue-100  rounded-md mt-2 ml-2">Best Seller</div>
                <div className="p-4 font-semibold text-md text-gray-500 hover:text-black cursor-pointer bg-gray-100 hover:bg-blue-100  rounded-md mt-2 ml-2">Trending</div>
                <div className="p-4 font-semibold text-md text-gray-500 hover:text-black cursor-pointer bg-gray-100  hover:bg-blue-100 rounded-md mt-2 ml-2"> Offers</div>

            </div>}





        </div>


    )
}

export default Filter