import axios from "axios";
const fs = require("fs");

export default async function handler(req, res) {

  if (req.method === "POST") {
    try {
      const obj = JSON.parse(req.body);

      if (!obj.storefrontId) {
        res.status(400).send("Storefront ID missing in request body");
        return;
      }

      const storefrontId = obj.storefrontId;

      console.log(storefrontId);

      fs.writeFileSync("./public/data.json", JSON.stringify(obj));

      // You can use responseData for further processing or send it as a response
      res.status(200).json(storefrontId);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
}
