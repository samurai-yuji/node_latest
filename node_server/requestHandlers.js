let qs = require('query-string');
function start(response, postData) {

  const body = `
    <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>jqueryのajaxサンプル</title>
          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        </head>
        <body>
          <p>jqXHR.statusを表示:<span id="out1"></span></p>
          <p>textStatusを表示:<span id="out2"></span></p>
          <p>errorThrownを表示:<span id="out3"></span></p>
          <p>表示1 (テキストボックスの内容) : <span id="out4"></span></p>
          <p>表示2 (テキストボックス２の内容) : <span id="out5"></span></p>
          <p>表示3 : <span id="out6"></span></p>
          <p>ボタンを押すと通信が始まります</p>
          <form id="form1">
            <input type="button" id="btn1" value="ボタン1"><br />
            テキストボックス<br />
            <input type="text" name="textbox1" value="custom1"><br />
            テキストボックス2<br />
            <input type="text" name="textbox2" value="custom2">
          </form>
          <script type="text/javascript">
          /*
            function my_querystring(query){
              new_object = {};
              query.split('&').forEach(function(single_query){
                var keyvalue = single_query.split('=');
                var key = keyvalue[0];
                var value = keyvalue[1];
                new_object[key] = value;
              });
              return new_object;
            }
          */
            $( function(){
              $("#btn1").click(function(){
                $("#out6").html("データ取得中です");
                $.ajax({
                  url:"http://localhost:8888/upload",
                  type:"POST",
                  data:$("#form1").serialize(),
                  timeout: 1000,
                }).done(function(data, textStatus, jqXHR){
                  console.log(typeof data);
                  console.log(data);
//                  var obj = my_querystring(data);
                  $("#out1").html(jqXHR.status);
                  $("#out2").html(textStatus);
                  $("#out4").html(data["textbox1"]);
                  $("#out5").html(data["textbox2"]);
                }).fail(function(jqXHR, textStatus, errorThrown){
                  $("#out1").html(jqXHR.status);
                  $("#out2").html(textStatus);
                  $("#out3").html(errorThrown);
                }).always(function(){
                  $("#out6").html("complete");
              });
            });
          });
          </script>
        </body>
    </html>
  `;

  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(body);
  response.end();
}

function upload(response, postData){
  let result = JSON.stringify(qs.parse(postData));
  console.log(typeof result);
  console.log(JSON.stringify(qs.parse(postData)));

  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write(result);
  response.end();
}


exports.start = start;
exports.upload = upload;
