import http from 'http';
import fs from 'fs'; // file system 모듈 추가
const server = http.createServer((request, response) => {
// 파일을 읽어내는 fs 모듈의 메서드
//! 첫번째 리딩 (절차)
fs.readFile("./static/basic/header.txt", function (err, data) {
// 에러 처리
if (err) {
return console.error(err);
}
// 모든 txt 파일을 읽어 , HTML 처럼 처리하기 위해 마치 주워담는다.
let basicPage ="";// HTML 은 문자열이므로 , 빈문자열로 시작

basicPage +=  data.toString(); // readFile 메서드의 data 매개변수 테이블에 basicPage 추가 
//! 두번째 리딩 (절차)
fs.readFile("./static/basic/header.txt", function (err, data) {
  // 에러 처리
  if (err) {
  return console.error(err);
  }
  basicPage +=  data.toString(); // 중간 부분 한번 더 추가
  //! 세번째 리딩 (절차)
fs.readFile("./static/basic/header.txt", function (err, data) {
  // 에러 처리
if (err) {
  return console.error(err);
  }
  basicPage +=  data.toString(); // 마지막 부분 한번 더 추가

  // 최종적으로 해당 시점에서 변수 basicPage 에는 HTML 구성에 필요한 모든 내용이 담여있게 됨. 

// 응답 처리
response.writeHead(200, { 'Content-Type': 'text/plain' });
response.write(data.toString());
response.end();
    });
  });
}); 
// 모든 응답이 종료되면 아래 메세지 실행
console.log('서버가 실행되었습니다.');
});

server.listen(3010, (err) => {
  if (err) {
  console.log('서버 실행 중 에러가 발생했습니다.');
  return;
  }
  console.log('port 3010번에서 서버가 실행되었습니다.');
  });
