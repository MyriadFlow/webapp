import React, { useState, useEffect } from "react";

export default function Home() {
    const [resdata, setResdata] = useState(null);

    useEffect(() => {
      async function fetchData() {
        try {
          const response = await fetch('/data.json');
          const data = await response.json();
          setResdata(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
  
      fetchData();
    }, []);

    console.log(resdata);
    return (
        <>
        </>
    );
}

// export async function getServerSideProps() {
//     const response = await fetch(
//         'http://localhost:3000/api/getData');
//     const data = await response.json();

//     return {
//         props: { data: data },
//     };
// }