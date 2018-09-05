let http = require("http");
let https = require("https");

let Router = require("router");
let finalHandler = require("finalHandler");
let bodyParser = require("body-parser");

let url = require("url");
let fs = require("fs");

let requestHandlers = require("./requestHandlers");

function server_start(route, handle) {

  var router = Router();

  router.use(bodyParser());

  router.get("/",requestHandlers.start);
  router.post("/upload",requestHandlers.upload);

  function onRequest(request, response) {
    router(request, response, finalHandler(request, response));
  }

  http.createServer((req, res) => {
    res.writeHead(301,{Location: "https://localhost:8888"});
    res.end();
  }).listen(8080,'0.0.0.0');

  const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
  };

  https.createServer(options,onRequest).listen(8888,'0.0.0.0');
  console.log("Server has started.");

}

server_start();
