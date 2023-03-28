var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');
var db = mysql.createConnection({
  host     : '127.0.0.1',   
  //host : localhost 사용 => error 뜸 ! 
  user     : 'root',
  password : 'kkai0114@@',
  database : 'opentutorials'
});
db.connect();  
// 커넥트를 통해서 실제 접속이 일어난다. 
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        // fs.readdir('./data', function(error, filelist){
        //   var title = 'Welcome';
        //   var description = 'Hello, Node.js';
        //   var list = template.list(filelist);
        //   var html = template.HTML(title, list,
        //     `<h2>${title}</h2>${description}`,
        //     `<a href="/create">create</a>`
        //   );
        //   response.writeHead(200);
        //   response.end(html);
        // });
        //두번째 인자는 콜백함수를 준다  첫번째는 error 두번째 성공일때 =topics
        db.query(`select * from topic`,function(error,topics){
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
          response.writeHead(200);
          response.end(html);
          //list ->topic -> html ( title ,list , body ,control) <= template.js
        });
      } else {
        /*
        // 글 목록을 가져온다 . 
        fs.readdir('./data', function(error, filelist){
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
            });
            var list = template.list(filelist);
            var html = template.HTML(sanitizedTitle, list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
            );
            response.writeHead(200);
            response.end(html);
          });
        });
        */
       // 토픽을 가져오고 , 웹페이지 내용을 구성하는 코드를 짜기 . 
        db.query(`select * from topic`,function(error,topics){
        if(error){
          throw error;
          //throw : 던지다 => 에러가 있을경우에 , node.js 는 그다음 코드를 실행시키지 않고 콘솔에 표현함과 동시에 즉시 코드 종료함.
        }
          db.query(`select * from topic where id=?`, [queryData.id], function(error2, topic){
            //사용자가 입력한 정보는 불신해야한다.  where =id 값을 주는대신, ? 데이터 베이스의 코드의 특성에 의해서 공격을 당할 수 있다 .
            // 두번째 값에 인자로 배열에 담아서 값을준다.reload 했을때 결과는 같지만, sql 문에 ? 값이 공격 의도가 있는 값들은 세탁해줌. 
            if(error2){
              throw error2;
            }
          var title = topic[0].title;
          var description = topic[0].description;
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
          ` <a href="/create">create</a>
          <a href="/update?id=${queryData.id}">update</a>
          <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${queryData.id}">
            <input type="submit" value="delete">
          </form>`
          );
            response.writeHead(200);
            response.end(html);
          });
        })
      }
    } else if(pathname === '/create'){
      // fs.readdir('./data', function(error, filelist){
      //   var title = 'WEB - create';
      //   var list = template.list(filelist);
      //   var html = template.HTML(title, list, `
      //     <form action="/create_process" method="post">
      //       <p><input type="text" name="title" placeholder="title"></p>
      //       <p>
      //         <textarea name="description" placeholder="description"></textarea>
      //       </p>
      //       <p>
      //         <input type="submit">
      //       </p>
      //     </form>
      //   `, '');
      //   response.writeHead(200);
      //   response.end(html);
      // });
      db.query(`select * from topic`,function(error,topics){
        var title = 'Create';
        // var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
          ` <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
          <a href="/create">create</a>`
        );
          response.writeHead(200);
          response.end(html);
        });
    } else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          // var title = post.title;
          // var description = post.description;
          // fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          //   response.writeHead(302, {Location: `/?id=${title}`});
          //   response.end();
          // })
          db.query(`
          INSERT INTO topic (title,description, created , author_id ) 
          VALUES ( ? , ?, NOW() , ?)`,
          [post.title,post.description,1],
          // 콜백함수 
          function(error,result){
            if(error){ // 에러 날 경우 , 
              throw error;
              }
              response.writeHead(302, {Location: `/?id=${result.insertID}`}); // id 값에는 뭐가 들어가야하는지 ? 
              response.end();
            }
          )
          // SQL INSERT 정보 받아오기 => 배열을 이용해서 첫번째? : title , 두번째 ? description , 네번째 : author_id
      });
    } else if(pathname === '/update'){
      fs.readdir('./data', function(error, filelist){
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
          var title = queryData.id;
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
        
      });
    } else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var description = post.description;
          fs.rename(`data/${id}`, `data/${title}`, function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            })
          });
      });
    } else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var filteredId = path.parse(id).base;
          fs.unlink(`data/${filteredId}`, function(error){
            response.writeHead(302, {Location: `/`});
            response.end();
          })
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3001);
// 포트번호 , 3000에서 꼭 바꿔줘야 적용된다. 