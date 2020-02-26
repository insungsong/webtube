"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _helmet = _interopRequireDefault(require("helmet"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _passport = _interopRequireDefault(require("passport"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _path = _interopRequireDefault(require("path"));

var _expressFlash = _interopRequireDefault(require("express-flash"));

var _connectMongo = _interopRequireDefault(require("connect-mongo"));

var _middlewares = require("./middlewares");

var _userRouter = _interopRequireDefault(require("./routers/userRouter"));

var _videoRouter = _interopRequireDefault(require("./routers/videoRouter"));

var _globalRouter = _interopRequireDefault(require("./routers/globalRouter"));

var _apiRouter = _interopRequireDefault(require("./routers/apiRouter"));

var _routes = _interopRequireDefault(require("./routes"));

require("./passport");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 쿠키에 id를 주고 그 id를 받아서 사용자를 판별하는 것
const app = (0, _express.default)(); // express를 위에서 import했고 express를 실행한 결과를 여기서 app변수에 담아준것이다.

const CookieStore = (0, _connectMongo.default)(_expressSession.default);
app.use((0, _helmet.default)()); // view engine 설정

app.set("view engine", "pug");
app.set("views", _path.default.join(__dirname, "views")); //app.use("/uploads", express.static("uploads"));"/uploads"는 해당 경로접두사에서 uploads디렉토리 있는 파일을 로드할 수 있다, express.static("uploads")는 root디렉토리를 의미 또한 express.static는 이미지, CSS 파일 및 JavaScript 파일과 같은 정적 파일을 제공하려면 Express.static 내장 미들웨어 기능을 사용하십시오.

app.use("/static", _express.default.static(_path.default.join(__dirname, "static"))); // 해당 /static에서, static 파일을 로드할수있다는 의미이다.
// middleware

app.use((0, _cookieParser.default)()); // cookie를 전달받아서, 사용할 수 있도록 만들어주는 미들웨어이다. 사용자 인증과 같은 곳에서 쿠키를 검사할때 사용한다.

app.use(_bodyParser.default.json()); // bodyParser 자체는 서버가 사용자에게 받아온 정보를 이해하는 방법 즉, 사용자가 웹사이트로 전달하는 정보들을 검사하는 미들웨어다. requset정보에서 form 이나 json형태로된 body를 검사한다.

app.use(_bodyParser.default.urlencoded({
  extended: true
}));
app.use((0, _morgan.default)("dev"));
app.use((0, _expressSession.default)({
  // 해당 cookie를 관리하기 위해 passport가 session을 관리하다 이때 express session을 install해야함 passport.session은 영구 로그인을 체크할때 사용한다.
  // 이렇게 진행되다가 localMiddleware로 간다.
  secret: process.env.COOKIE_SECRET,
  resave: true,
  saveUninitialized: false,
  store: new CookieStore({
    mongooseConnection: _mongoose.default.connection
  })
}));
app.use((0, _expressFlash.default)());
app.use(_passport.default.initialize());
app.use(_passport.default.session()); // papssport로 session을 넘기다는 의미를한다.
// locals middleware

app.use(_middlewares.localMiddleware); // 이게 잘 작동할 수 있는 이유는, 어떤 routes들 보다도 위에 있기때문이다.
// routes

app.use(_routes.default.home, _globalRouter.default); // 좌항에는 url의 의미가 우항에는 해당 좌항에 따른 로직이 쓰여진 곳을 알려줘야함
// routes에 들어가서 routes를 살펴보면 routes.home은 "/"인것을 볼 수 있다. 즉, "/"를 실행하려고 하는데 "/"를 실행할떄 globalRouter에 가서 globalRouter에 선언한 여러 routers에 맞는 어떤걸 실행한다는 뜻이다.

app.use(_routes.default.users, _userRouter.default);
app.use(_routes.default.videos, _videoRouter.default);
app.use(_routes.default.api, _apiRouter.default);
var _default = app;
exports.default = _default;