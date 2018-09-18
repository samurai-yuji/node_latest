let qs = require('query-string');
let fs = require('fs');
let mysql = require('mysql');
let moment = require('moment');
let sequelize = require('sequelize');

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

  let db = new sequelize('apps','admin','passxxxxxxxx',{
      host: 'localhost',
      dialect: 'mysql',
      pool: {},
      operatorsAliases: false
  });

  let def_user = {
    name: { type: sequelize.STRING },
    age : { type: sequelize.INTEGER, defaultValue : 20}
    //id:   { type: sequelize.INTEGER, autoIncrement: true, primaryKey: true }
  };

  let def_word = {
    data: { type: sequelize.STRING },
    lang: { type: sequelize.STRING },
    userId: { type: sequelize.INTEGER }
  };

  let User = db.define('user', def_user, { /* options */ });
  let Word = db.define('word', def_word, { /* options */ });

  User.hasMany(Word, { foreignKey: 'userId' });

  User.sync({force:false}).then(() => {
    return Word.sync({force:false}).then(() => { return null; });
  }).then(() => {
    return User.findOne({where: {name: session_id}}).then((user) => {
      return user;
    }).then((user) => {
      if(user == null){
        user = User.create({name: session_id}).then((created_user) => { return created_user; });
      }
      return user;
    });
  }).then( (user) => {
    console.log(postData.words);
    Word.create({data: postData.words, lang : "english", userId : user.get('id')}).then( () => {
      user.getWords().then( (words) => {
        var agg_words = "";
        words.forEach( (word) => {
          agg_words += word.get('data') + " ";
        });
        return agg_words
      }).then( (words) => {
        var word_counts = {};
        words.split(' ').forEach( (val) => {
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
      });
    });
  });
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

