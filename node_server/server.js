let https = require("https");
let url = require("url");
let fs = require("fs");

function start(route, handle) {
  function onRequest(request, response) {
    let postData = "";
    let pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");

    request.setEncoding("utf8");

    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
      console.log("Received POST data chunk '"+
      postDataChunk + "'.");
    });

    request.addListener("end", function() {
      route(handle, pathname, response, postData);
    });

  }

  const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
  };

  https.createServer(options,onRequest).listen(8888,'0.0.0.0');
  console.log("Server has started.");
}

exports.start = start;
