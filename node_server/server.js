let http = require("http");
let https = require("https");
let stat = require("node-static");

let Router = require("router");
let finalHandler = require("finalHandler");
let bodyParser = require("body-parser");

let fs = require("fs");
let file = new stat.Server("./public");

let requestHandlers = require("./requestHandlers");

function server_start(route, handle) {

  var router = Router();
  router.use(bodyParser());

  router.get("/",requestHandlers.start);
  router.post("/upload",requestHandlers.upload);
  router.post("/count",requestHandlers.count);

  // For static/template files
  router.get("/public/:dir/:file",requestHandlers.pub);

  http.createServer((req, res) => {
    res.writeHead(301,{Location: "https://localhost:8443"});
    res.end();
  }).listen(8080,'0.0.0.0');

  const options = {
    key: fs.readFileSync('public/secure/server.key'),
    cert: fs.readFileSync('public/secure/server.crt')
  };

  https.createServer(options,(req, res) => {
    router(req, res, finalHandler(req, res));
    req.addListener('end', () => {
      file.serve(req,res);
	}).resume();
  }).listen(8443,'0.0.0.0');
  console.log("Server has started.");
}

server_start();

