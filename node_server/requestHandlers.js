let qs = require('query-string');
let fs = require('fs');

function start(request, response) {

  const body = fs.readFileSync('templates/start.html');

  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(body);
  response.end();
}

function upload(request, response){
  let postData = request.body;
  console.log(typeof postData);
  console.log(postData);

  let result = JSON.stringify(postData);
  console.log(typeof result);
  console.log(result);

  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write(result);
  response.end();
}

exports.start = start;
exports.upload = upload;
