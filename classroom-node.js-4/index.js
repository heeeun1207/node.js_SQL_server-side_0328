import http from 'http';
import fs from 'fs'; // file system 모듈 추가
const server = http.createServer((request, response) => {
// 파일을 읽어내는 fs 모듈의 메서드
fs.readFile("./static/basic/header.txt", function (err, data) {
// 에러 처리
if (err) {
return console.error(err);
}
// 응답 처리
response.writeHead(200, { 'Content-Type': 'text/plain' });
response.write(data.toString());
response.end();
});
// 모든 응답이 종료되면 아래 메세지 실행
console.log('서버가 실행되었습니다.');
});
server.listen(3010);