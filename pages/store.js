import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice"
import balanceReducer from "../slices/balanceSlice"
import modelReducer from "../slices/modelSlice"


export default configureStore({
    reducer:{
        user:userReducer,
        balance:balanceReducer,
        model:modelReducer,
    }
})

