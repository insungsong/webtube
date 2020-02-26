import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport"; // 쿠키에 id를 주고 그 id를 받아서 사용자를 판별하는 것
import mongoose from "mongoose";
import session from "express-session";
import path from "path";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import { localMiddleware } from "./middlewares";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import apiRouter from "./routers/apiRouter";
import routes from "./routes";
import "./passport";

const app = express(); // express를 위에서 import했고 express를 실행한 결과를 여기서 app변수에 담아준것이다.

const CookieStore = MongoStore(session);

app.use(helmet());
// view engine 설정
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
//app.use("/uploads", express.static("uploads"));"/uploads"는 해당 경로접두사에서 uploads디렉토리 있는 파일을 로드할 수 있다, express.static("uploads")는 root디렉토리를 의미 또한 express.static는 이미지, CSS 파일 및 JavaScript 파일과 같은 정적 파일을 제공하려면 Express.static 내장 미들웨어 기능을 사용하십시오.
app.use("/static", express.static(path.join(__dirname, "static"))); // 해당 /static에서, static 파일을 로드할수있다는 의미이다.

// middleware
app.use(cookieParser()); // cookie를 전달받아서, 사용할 수 있도록 만들어주는 미들웨어이다. 사용자 인증과 같은 곳에서 쿠키를 검사할때 사용한다.
app.use(bodyParser.json()); // bodyParser 자체는 서버가 사용자에게 받아온 정보를 이해하는 방법 즉, 사용자가 웹사이트로 전달하는 정보들을 검사하는 미들웨어다. requset정보에서 form 이나 json형태로된 body를 검사한다.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  session({
    // 해당 cookie를 관리하기 위해 passport가 session을 관리하다 이때 express session을 install해야함 passport.session은 영구 로그인을 체크할때 사용한다.
    // 이렇게 진행되다가 localMiddleware로 간다.
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CookieStore({ mongooseConnection: mongoose.connection })
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // papssport로 session을 넘기다는 의미를한다.

// locals middleware
app.use(localMiddleware); // 이게 잘 작동할 수 있는 이유는, 어떤 routes들 보다도 위에 있기때문이다.

// routes
app.use(routes.home, globalRouter); // 좌항에는 url의 의미가 우항에는 해당 좌항에 따른 로직이 쓰여진 곳을 알려줘야함
// routes에 들어가서 routes를 살펴보면 routes.home은 "/"인것을 볼 수 있다. 즉, "/"를 실행하려고 하는데 "/"를 실행할떄 globalRouter에 가서 globalRouter에 선언한 여러 routers에 맞는 어떤걸 실행한다는 뜻이다.
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
app.use(routes.api, apiRouter);

export default app;
