export default function handler(req, res) {
  if (req.method === "POST") {
    const obj = JSON.parse(req.body);
    // if (id == undefined) {
    //   res.status(400).send("request body invalid");
    //   return;
    // }
    localStorage.setItem("storefrontID", obj.storefrontID);
    console.log(obj.storefrontId);
    res.status(200).send("recieved storefront id");
  }
}
