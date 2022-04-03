import Header from "../Components/Header";
import Footer from "../Components/Footer"
import { BsCollection } from "react-icons/bs"
import { AiOutlineHeart } from "react-icons/ai"
import { RiPaintBrushLine } from "react-icons/ri"
import { BiReset } from "react-icons/bi"
import { useSelector } from "react-redux";
import { selectUser } from "../slices/userSlice"
import Layout from "../Components/Layout";
import React, { useState,useEffect } from 'react';
import axios from 'axios';
const Web3 = require("web3");
import { convertUtf8ToHex } from "@walletconnect/utils";
import { create as ipfsHttpClient } from 'ipfs-http-client';
import Link from 'next/link';
const BASE_URL=process.env.NEXT_PUBLIC_BASE_URL;

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

function Profile() {

    const walletAddr = useSelector(selectUser);
    var wallet = walletAddr?walletAddr[0]:'';
    console.log(wallet);

 const [showModal, setShowModal] = useState(false);
  const [username,setUsername]=useState("");
  const [bio,setBio]=useState("");
  const [fileUrl, setFileUrl] = useState(null)

  async function uploadImage(e) {
    e.preventDefault();
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      );
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url);
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }
  
  const convertBase64=(file)=>{
    return new Promise((resolve,reject)=>{
      const fileReader=new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload=()=>{
        resolve(fileReader.result);
      }
      
      fileReader.onerror=(err)=>{
        reject(err);
      }
    })
  }

  const updateData=async(e)=>{
    e.preventDefault();
    const token = localStorage.getItem('platform_token');
    try {
      if(!username.trim()||!bio.trim()) alert("Don't leave any field empty!");
      else{
        var signroledata = JSON.stringify({
            name : "Devsi singh",
            country:"India",
            profilePictureUrl: "https://unsplash.it/500"
        })

        const config={
          headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
          },
          data:signroledata,
        }
        await axios.patch('https://marketplace-engine.lazarus.network/api/v1.0/profile',{name:username,country:bio,profilePictureUrl:fileUrl},config);
        alert("Updation successful!");
        console.log(fileUrl);
        setShowModal(false);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  }

    const user = useSelector(selectUser);
    const [page, setPage] = useState("collected");

    const authorize = async () => {
        const { data } = await axios.get(
            `${BASE_URL}/api/v1.0/flowid?walletAddress=0x313bfad1c87946bf893e2ecad141620eaa54943a`
        );
        console.log(data);

        let web3 = new Web3(Web3.givenProvider);
        let completemsg = data.payload.eula+data.payload.flowId;
        console.log(completemsg);
        const hexMsg = convertUtf8ToHex(completemsg);
        console.log(hexMsg);
        const result = await web3.eth.personal.sign(hexMsg,wallet);
        console.log(result);

        var signdata = JSON.stringify({
            flowId : data.payload.flowId,
            signature:result,
        })

        const config = {
             url:`${BASE_URL}/api/v1.0/authenticate`,
             method:"POST",
             headers:{
                 "Content-Type":"application/json",
                //  "Token":`Bearer ${token}`
             },
             data:signdata,
        };
        try{
            const response = await axios(config);
            // console.log(response);
            const token = await response?.data?.payload?.token;
            localStorage.setItem("platform_token",token);
            
            getProfile();

            return true;
        }catch(e){
            console.log(e);
            return false;
        }        
    };

    const getProfile = async ()=>{
        const token = localStorage.getItem('platform_token');
        const config={
            headers:{
              "Content-Type":"application/json",
              "Authorization":`Bearer ${token}`
            }
          }
          axios.get('https://marketplace-engine.lazarus.network/api/v1.0/profile',config).then((res)=>{
            console.log(res.data);
            setUsername(res.data.payload.name);
            setBio(res.data.payload.country?res.data.payload.country:"");
            setFileUrl(res.data.payload.profilePictureUrl);
          }).catch((error)=>{
            console.log(error);
          })
    }

    useEffect(() => {
		authorize();
        
	}, []);

    return (
        <Layout>
            <div
                className="w-full h-64 object-cover" style={{ backgroundColor: '#005bbd', backgroundImage: 'url("https://www.transparenttextures.com/patterns/food.png")' }}>
            </div>
            <div className="flex items-center justify-center -mt-16">
                {!user ? <div
                    className="rounded-full h-32 w-32 ring-offset-2 ring-1 ring-white bg-gray-200">
                </div> : <div className="rounded-full h-32 w-32  ring-offset-2 ring-1 ring-blue-400 connect-profile" style={{backgroundImage:`url(${fileUrl})`, backgroundRepeat:'no-repeat', backgroundSize:'cover',backgroundPosition:'center',backgroundColor:'white'}}>
                    </div>}
            </div>
            <div className=" m-2 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold pb-4 pt-4"> {username}'s Account </p>
                <p className="text-2xl font-bold pb-4">Wallet Address: <span className="text-gray-500">{user}</span></p>
                <p className="text-2xl font-bold pb-4"> Country : <span className="text-gray-500">{bio}</span></p>

                <button
        className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Edit Profile Details
      </button>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold text-gray-400">
                    Edit Profile Details
                  </h3>
                  {/* <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      X
                    </span>
                  </button> */}
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                <div className='update-page'>
              <div>
            <section class="vh-100">
  <div class="container py-5 h-100">
    <div class="row d-flex align-items-center justify-content-center h-100">
      <div class="col-md-8 col-lg-7 col-xl-6 text-center" style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
        <img src={fileUrl} class="img-fluid" alt="Phone image" style={{width:"50%"}}/>
        <input type="file" className="btn btn-primary btn-md ml-20" style={{marginBottom:20, marginTop:20,width:"50%"}} onChange={(e)=>{uploadImage(e)}}/>
      </div>
      <div class="col-md-7 col-lg-5 col-xl-5 offset-xl-1 text-center" style={{zIndex:"1000"}}>
        <form onSubmit={updateData}>
        <div class="md-form mb-3">
            <input type="text" id="form1Example13" class="form-control form-control-lg pl-2" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Name"/>
          </div>

          <div class="md-form mb-3">
            <input  type="text" id="form1Example13" class="form-control form-control-lg pl-2" value={bio} onChange={(e)=>setBio(e.target.value)} placeholder="Country"/>
          </div>

          <button type="submit" className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150">Update Profile</button>
        </form>
      </div>
    </div>
  </div>
</section>
              </div>
        </div>
                  
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-white rounded bg-red-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  {/* <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Save Changes
                  </button> */}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}

               
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

</Layout>
    )
}

export default Profile
