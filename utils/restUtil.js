import { useAccount } from "wagmi";

export const getHeader=()=>{
    const token = useAccount().address;
    return {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return
}