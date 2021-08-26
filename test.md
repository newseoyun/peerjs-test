
## 구동해보며 겪은 문제

### Uncaught SyntaxError: Unexpected token '<'
1. 스태틱 리소스 경로 설정 문제. app.use(express.static(__dirname)) 여기 수정함.


### Uncaught (in promise) DOMException: Permission denied by system   
1. HTTPS 여야 => certbot(Let's Encrypt)으로 무료 ssl인증서 발급 받았음.   
2. 집 컴퓨터는 잘 됐는데 그램에서만 위 에러가 떴음.   
알고보니 (윈도우11기준) 설정의 [업데이트 및 보안]에서 마이크 액세스 꺼져있었음.



## TODO
* 접속 쉽게: 방식 바꾸기
* 보안 강하게: 암호화?
* 서버 관리: 라이브러리 더 추가
* 보는 화면 컨트롤: 숨기기/보이기, 크기조절
* 카메라 전환할 수 있게 & 화질 조정
