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

function count(request, response){
  let postData = request.body;
  console.log(postData);

  var words = {};
  if(postData != null){
    if(postData.words != null){
      postData.words.split(' ').forEach( (val) => {
        if(val != ''){
          if(words[val] != null){
            words[val] += 1;
          }else{
            words[val] = 1;
          }
        }
      });
    }
  }

  let result = JSON.stringify(words);
  console.log(result);

  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write(result);
  response.end();
}

exports.start = start;
exports.upload = upload;
exports.count = count;
