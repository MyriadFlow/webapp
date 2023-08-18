export default function handler(req, res) {
  if (req.method === "POST") {
    const obj = JSON.parse(req.body);
    // if (id == undefined) {
    //   res.status(400).send("request body invalid");
    //   return;
    // }
    console.log(obj.storefrontId);
    res.status(200).send("recieved storefront id");
  }
}
