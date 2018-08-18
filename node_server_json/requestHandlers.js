/*
  doneメソッドに置いて
  [ { “name”: "textbox1", “value” : "aaa" }, { “name” : "textbox2", “value” : "bbb" } ]
  => { “textbox” : “aaa”, “textbox2” : “bbb” }
  と受け取るようコードを編集する
*/

function start(response, postData){
  const body = `
  <!DOCTYPE html>
  <html lang="ja">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>AjaxSample_jquery</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  </head>
  <body>
    <p>jqXHR.statusを表示：<span id="out1"></span></p>
    <p>textStatusを表示：<span id="out2"></span></p>
    <p>errorThrownを表示：<span id="out3"></span></p>

    <p>表示1（テキストボックスの内容）：<span id="out4"></span></p>
    <p>表示2（テキストボックスの内容）：<span id="out5"></span></p>
    <p>表示3：<span id="out6"></span></p>

    <p>ボタンを押すと通信が始まります</p>

    <form id="form1">
      <input type="button" id="btn1" value="ボタン1"><br />
      テキストボックス<br />
      <input type="text" name="textbox1" value="custom1"><br />
      テキストボックス2<br />
      <input type="text" name="textbox2" value="custom2">
    </form>

    <script type="text/javascript">

      $(()=>{
        $("#btn1").click(()=>{
          $("#out6").html("データ取得中です");

          $.ajax({
            url:"http://localhost:8888/upload",
            type:"POST",
            data:JSON.stringify($("#form1").serializeArray()),
            dataType:"json",
            timeout: 1000,
          }).done((data, textStatus, jqXHR)=>{

            console.log(data);
            console.log(typeof data);
            console.log(Array.isArray(data));
            console.log(data[0]);

            $("#out1").html(jqXHR.status);
            $("#out2").html(textStatus);
            $("#out4").html(data["textbox1"]);
            $("#out5").html(data["textbox2"]);

          }).fail((jqXHR, textStatus, errorThrown)=>{

            $("#out1").html(jqXHR.status);
            $("#out2").html(textStatus);
            $("#out3").html(errorThrown);

          }).always(()=>{
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
  json_array = JSON.parse(postData);
  let obj = {};
  json_array.forEach((elem)=>{
    obj[elem["name"]] = elem["value"];
  });
  str_obj = JSON.stringify(obj);
  console.log(str_obj);

  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write(str_obj);
  response.end();
}

exports.start = start;
exports.upload = upload;
