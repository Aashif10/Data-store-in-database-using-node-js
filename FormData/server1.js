const fs = require("node:fs");
const http = require("node:http");

const { parse } = require("querystring"); 

const mongodb = require("mongodb").MongoClient;
const URL = "mongodb://localhost:27017";
//  ! Mongodb Connection 
let connectDB = async () => {
  let client = await mongodb.connect(URL);
  let database = client.db("Storage");
  console.log("Database is created");
  let collection = await database.createCollection("data");
  return collection;
};
// connectDB()
//  ! Create Server 
let server = http.createServer((req, res) => {
  if (req.method === "POST") {
    let urlencoded = "application/x-www-form-urlencoded";
    if (req.headers["content-type"] === urlencoded) {
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        try {
          let payload = parse(body);
          let collection = await connectDB();
          await collection.insertOne(payload);
          res.end("Data Stored successfully");
        } catch (error) {
          console.error("Error storing data", error);
          
        }
      });
    } else {
      res.end("Invalid Data");
    }
  } else {
        // ! Routing 
    if (req.url === "/home") {
      res.writeHead(200, { "Content-Type": "text/html" });
        fs.createReadStream("./home.html").pipe(res);
        
    } else if (req.url === "/about") {
      res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("This is About Page");
        
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  }
});
            // ! server listen 
server.listen(5500, err => {
  if (err) throw err;
  console.log(`Server running at http://localhost:5500`);
});
