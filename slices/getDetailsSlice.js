import { createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import * as service from "../services/listofAPIs"
import axios  from 'axios'
 const BASE_URL=process.env.NEXT_PUBLIC_BASE_URL
 import { GET_DETAILS } from '../services/constants'
 const Link=`${BASE_URL}${GET_DETAILS}`
export const  fetchDetails = createAsyncThunk('details/fetchdetails', async (args,{rejectWithValue}) => {

    try {
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
          };
      const data= await axios.get(Link,headers)
      console.log("data",data.data.payload)
      return data.data.payload
    } catch (error) {
        rejectWithValue(error.respnse)
    }
  })
const initialState = {
  details: [],
  loading: true,
  error: null
}

const detailsSlice = createSlice({
  name: 'details',
  initialState,
  extraReducers:{
 
      [fetchDetails.pending]:(state, {payload}) => {
        state.loading=true
      },
      [fetchDetails.fulfilled]:(state, {payload}) => {
        state.loading=false,
        state.details=payload
        console.log("payload",payload)
      },
      [fetchDetails.rejected]:(state, {payload}) => {
        state.loading=false,
        state.details=payload

      }
  }
})



export default detailsSlice.reducer