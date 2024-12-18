const express = require('express'); 
const nunjucks = require('nunjucks');
const common = require('./common/common');

const app = express();
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true
});

app.use('/assets', express.static(__dirname + '/assets'));


// DB연결 
// 세션 사용을 위한 세팅
const session = require('express-session')

const sessionDB = require('express-mysql-session')(session);

const db = require('./common/db');

// 세션 세팅 추가 -> 로그인 성공시  
app.use(session({
    secret: "kiwu",
    resave: true,
    saveUninitialized: false , // 세션이 필요할 때만 저장
    store: new sessionDB(db.db)

}));


// POST 값 받기
app.use(express.urlencoded({
    extended: true
}));


// view 단에서 common함수 사용할 때
app.locals.common = common;

indexRouter = require('./router/home');
boardRouter = require('./router/board');
memberRouter = require('./router/member');

app.use('/', indexRouter);
app.use('/board', boardRouter);
app.use('/member', memberRouter);


//404 not found!
app.use((req,res) => {
    console.log('여기');
    res.status(404).send('404 NOT FOUND!');
}); // 얘를 쓰면 전부 걸림

app.listen(80, () => {
    console.log('80번 포트에서 express서버 대기중..');
});

app.get('/some-endpoint', async (req, res) => {
    let result; // SQL 실행 결과를 저장할 변수
  
    try {
      const sql = 'SELECT * FROM some_table';
      result = await runSql(sql); // runSql 함수 호출
  
      // 중복 응답을 피하기 위해 headersSent를 체크
      if (!res.headersSent) {
        res.json(result); // 결과 응답
      }
  
    } catch (error) {
      console.error(error);
  
      // 에러 발생 시에도 이미 응답이 전송되었는지 확인 후 응답
      if (!res.headersSent) {
        res.status(500).send('Internal Server Error'); // 오류 응답
      }
    }
  });
  
