let http = require("http");
let https = require("https");

let express = require("express");
let bodyParser = require("body-parser");

let fs = require("fs");

let requestHandlers = require("./requestHandlers");

function server_start(route, handle) {
  var app = express();
  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({ extended: false }));

  var router = express.Router();

  configure_routings(app,router);
  start_http();
  start_https(app);
}

function configure_routings(app,router){
  app.get("/",requestHandlers.start);
  app.post("/upload",requestHandlers.upload);
  app.post("/count",requestHandlers.count);
  app.post("/login",requestHandlers.login);
}

function start_http() {
  http.createServer((req, res) => {
    res.writeHead(301,{Location: "https://localhost:8443"});
    res.end();
  }).listen(8080,'0.0.0.0');
}

function start_https(app){
  const options = {
    key: fs.readFileSync('public/secure/server.key'),
    cert: fs.readFileSync('public/secure/server.crt')
  };

  https.createServer(options,app).listen(8443,'0.0.0.0');

  console.log("Server has started.");
}

server_start();

