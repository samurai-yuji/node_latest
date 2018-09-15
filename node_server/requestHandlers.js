let qs = require('query-string');
let fs = require('fs');
let mysql = require('mysql');
let moment = require('moment');

function start(request, response) {

  const body = fs.readFileSync('public/templates/start.html');

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

  let session_id = "";

  if(request.session.user != null){
    session_id = request.session.user["account"];
  }

  console.log(session_id);

  if(session_id == ""){
    response.writeHead(401, {"Content-Type": "text/html"});
    response.write("");
    response.end();
    return;
  }

  var conn = mysql.createConnection({
    host : 'localhost',
    database : 'users',
    user : 'admin',
    password : 'passxxxxxxxx'
  });

  conn.query(
    "CREATE TABLE IF NOT EXISTS user_words (user varchar(64), words blob)",
    {},
    (error,results,fields) => {}
  );

  var all_words = "";
  if(postData != null){
    if(postData.words != null){
      conn.query("SELECT * FROM user_words WHERE user = ?",
        [ session_id ],
        (error, results, fields) => {

          if(results.length == 0) {
            all_words = postData.words;
            conn.query(
              "INSERT INTO user_words set ?",
              { user: session_id, words:all_words },
              (error,results,fields) => {}
            );
          }else{
            all_words = results[0]["words"].toString()+ " " +postData.words;
            conn.query(
              "UPDATE user_words SET words = ? WHERE user = ?",
              [ all_words, session_id ],
              (error,results,fields) => {}
            );
          }

          var word_counts = {};
          all_words.split(' ').forEach( (val) => {
            if(val != ''){
              if(word_counts[val] != null){
                word_counts[val] += 1;
              }else{
                word_counts[val] = 1;
              }
            }
          });

          var arr = Object.keys(word_counts).map( (key) => {
            return [key,word_counts[key]];
          });

          arr.sort( (a,b) => {
            return a[1]<b[1]?1:-1;
          });

          let result = JSON.stringify(arr);
          console.log(result);

          response.writeHead(200, {"Content-Type": "text/plain"});
          response.write(result);
          response.end();

        }
      )
    }
  }
}

/* Temporary data */
/* This should be in database. */
let accounts = {
  "yuji" : "passwordxxxx",
  "taro" : "passwordzzzz"
};


function login(request, response) {
  let postData = request.body;
  let result = false;

  console.log(postData);
  if(postData != null){
    if(postData.account != null && postData.password != null){
      if(Object.keys(accounts).indexOf(postData.account) >= 0){
        if(accounts[postData.account] == postData.password){
          result = true;
        }
      }
    }
  }

  console.log(result);

  let expire = moment().add(1,'minutes').format('LLLL Z'); // GMT(UTC)

  if(result){
    request.session.user = { account: postData.account };
    start(request,response);
  }else{
    response.writeHead(401, {"Content-Type": "text/html"});
    response.write("");
    response.end();
  }
}

exports.start = start;
exports.upload = upload;
exports.count = count;
exports.login = login;

