import axios from 'axios';
const fs = require('fs');

export default async function handler(req, res) {

  //   const myVariableValue = {  
  //     "storefrontID": {  
  //         "id":12345,    
  //     }  
  // }  ;
  // fs.writeFileSync('./public/data.json', JSON.stringify(myVariableValue));
  // res.status(200).json(myVariableValue);}

  if (req.method === "POST") {
    try {
      const obj = JSON.parse(req.body);

      if (!obj.storefrontId) {
        res.status(400).send("Storefront ID missing in request body");
        return;
      }

      const storefrontId = obj.storefrontId;

      console.log(storefrontId);

      fs.writeFileSync('./public/data.json', JSON.stringify(storefrontId));

      // Make a GET request to the external API using the storefrontId
      const apiURL = `https://testnet.gateway.myriadflow.com/api/v1.0/webapp/${storefrontId}`;
    const response = await axios.get(apiURL);
    const responseData = response.data;

    // You can use responseData for further processing or send it as a response
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
} else {
  res.status(405).send("Method Not Allowed");
}
}
