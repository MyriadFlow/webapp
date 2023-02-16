export const getHeader=()=>{
    const token = localStorage.getItem("platform_token");
    return {
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return
}