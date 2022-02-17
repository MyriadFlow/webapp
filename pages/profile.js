import Header from "../Components/Header";
import Footer from "../Components/Footer"
import { BsCollection } from "react-icons/bs"
import { AiOutlineHeart } from "react-icons/ai"
import { RiPaintBrushLine } from "react-icons/ri"
import { BiReset } from "react-icons/bi"
import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice"
import { useState } from 'react';

function profile() {

    const user = useSelector(selectUser);
    const [page, setPage] = useState("collected");

    return (
        <div className=" w-full">
            <Header />

            <div
                className="w-full h-64 object-cover" style={{ backgroundColor: '#005bbd', backgroundImage: 'url("https://www.transparenttextures.com/patterns/food.png")' }}>
            </div>
            <div className="flex items-center justify-center -mt-16">
                {!user ? <div
                    className="rounded-full h-32 w-32 ring-offset-2 ring-1 ring-white bg-gray-200">
                </div> : <div className="rounded-full h-32 w-32  ring-offset-2 ring-1 ring-blue-400 connect-profile"></div>}
            </div>
            <div className=" m-2 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold"> My Account </p>
                <p className="text-sm sm:text-md md:text-lg overflow:hidden font-medium text-gray-500">{user}</p>
            </div>


            {/* user options  */}
            <div className="mt-10 flex items-center space-x-12 px-4 justify-center">
                <div className="flex text-gray-600 hover:text-gray-900  space-x-1 cursor-pointer">
                    <BsCollection className="h-6 w-6 mr-2" />
                    <p onClick={() => setPage("collected")} className="text-xl font-semibold">Collected</p>
                </div>

                <div className="flex  text-gray-600 hover:text-gray-900 space-x-1 cursor-pointer">
                    <RiPaintBrushLine className="h-6 w-6 mr-2" />
                    <p onClick={() => setPage("created")} className="text-xl font-semibold">Created</p>
                </div>

                <div className="flex  text-gray-600 hover:text-gray-900 space-x-1 cursor-pointer">
                    <AiOutlineHeart className="h-6 w-6 mr-2" />
                    <p onClick={() => setPage("favorites")} className="text-xl font-semibold">Favorites</p>
                </div>

                <div className="flex  text-gray-600 hover:text-gray-900 space-x-1 cursor-pointer">
                    <BiReset className="h-6 w-6 mr-2" />
                    <p onClick={() => setPage("activity")} className="text-xl font-semibold">Activity</p>
                </div>
            </div>
            {page === "collected" && (
                // <Collected />
                <div className="min-h-screen text-center">collected</div>
            )}
            {page === "created" && (
                // <Created />
                <div className="min-h-screen text-center">created</div>
            )}
            {page === "favorites" && (
                // <Favorites />
                <div className="min-h-screen text-center">favorites</div>
            )}
            {page === "activity" && (
                // <Activity />
                <div className="min-h-screen text-center">activity</div>
            )}

            <Footer />
        </div>





    )
}

export default profile
