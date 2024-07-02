// 1st step == import http server
// 2nd step== import fs module to read file
// 3rd step== Create Mongodb Connection 
//  4th step == Create Server using http

let http = require("node:http");
let fs = require("node:fs");
let { parse } = require("querystring"); // ! querystring is used to parse the form data

let mongodb = require("mongodb").MongoClient;
let URL = "mongodb://localhost:27017";
let connectDB = async () => {
  let client = await mongodb.connect(URL);
  let database = client.db("FormInfo");
  let collection = await database.createCollection("information");
  console.log("database is created");
  return collection;
};
// connectDB();

http
  .createServer((req, res) => {
    if (req.method == "POST") {
      let urlencoded = "application/x-www-form-urlencoded"; // ! This is common content type while working with forms

      if (req.headers["content-type"] === urlencoded) {
        let body = "";
        req.on("data", chunk => {
          body += chunk.toString(); // ! This tostring() Method will convert the buffer data type
        });
        req.on("end", async () => {
          let payload = parse(body.valueOf());
          // console.log("UserName", payload.UserName);
          let collection = await connectDB();
          await collection.insertOne(payload); 
          // res.end(`email is ${payload.email}`);
          res.end("Data Stored");
        });
      } else {
        res.end("invalid request");
      }
    } else {
      // This is form page
      if (req.url === "/form") {
        res.writeHead(200, "OK", { "Content-type": "text/html" });
        fs.createReadStream("./index.html").pipe(res);
      }
    }
  })
  .listen(9000, err => {
    if (err) throw err;
    console.log("server running at http://localhost:9000");
  });
