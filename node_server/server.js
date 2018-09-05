let http = require("http");
let https = require("https");

let Router = require("router");
let finalHandler = require("finalHandler");
let bodyParser = require("body-parser");

let fs = require("fs");

let requestHandlers = require("./requestHandlers");

function server_start(route, handle) {

  var router = Router();
  router.use(bodyParser());

  router.get("/",requestHandlers.start);
  router.post("/upload",requestHandlers.upload);

  http.createServer((req, res) => {
    res.writeHead(301,{Location: "https://localhost:8443"});
    res.end();
  }).listen(8080,'0.0.0.0');

  const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
  };

  https.createServer(options,(req, res) => {
    router(req, res, finalHandler(req, res));
  }).listen(8443,'0.0.0.0');
  console.log("Server has started.");
}

server_start();
