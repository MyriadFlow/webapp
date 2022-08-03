import {BASE_URL,GET_DETAILS} from './constants'

export const getDetails = async(headers) => {
    const Link = `${BASE_URL}${GET_DETAILS}`
     await  axios.get(Link,{headers}).then((ers)=>{
        
    console.log("ers",res)
    return res
   }).catch((err)=>{
    console.log(err)
   })
}