let qs = require('query-string');
let fs = require('fs');
let mysql = require('mysql');

function start(request, response) {

  const body = fs.readFileSync('public/templates/start.html');
  //const body = "aaa"

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

  var arr = Object.keys(words).map( (key) => {
    return [key,words[key]];
  });

  arr.sort( (a,b) => {
    return a[1]<b[1]?1:-1;
  });

  let result = JSON.stringify(arr);
  console.log(result);

  var conn = mysql.createConnection({
    host : 'localhost',
    database : 'users',
    user : 'admin',
    password : 'passxxxxxxxx'
  });

  // Need user id (tentatively fix to 'user1')
  conn.query(
    "CREATE TABLE IF NOT EXISTS user_words (user varchar(64), words blob)",
    {},
    (error,results,fiidds) => {}
  );

  conn.query("SELECT * FROM user_words WHERE user = 'user1'",
    {},
    (error, results, fields) => {
      if(results.length == 0) {
        conn.query(
          "INSERT INTO user_words set ?",
          { user:'user1', words:postData.words },
          (error,results,fiidds) => {}
        );
      }else{
        conn.query(
          "UPDATE user_words SET words = ? WHERE user = ?",
          [ results[0]["words"].toString()+ " " +postData.words, 'user1' ],
          (error,results,fiidds) => {}
        );
      }
    }
  )

  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write(result);
  response.end();
}

function pub(req,res){
  var dir = req.params.dir;
  var file = req.params.file;

  res.write(fs.readFileSync('public/'+dir+'/'+file));
  res.end();
}

exports.start = start;
exports.upload = upload;
exports.count = count;
exports.pub = pub;

