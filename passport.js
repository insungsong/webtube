// User.js에서는 passport를 mongoose를 통해 방법론을 쓸거야를 선언한것이라면,
// 해당 파일에서는
// passport-local(즉, 어떻게 로그인할것인 방식을 작성하는 파일 + 사용자 인증 특히, username과 password를 가지고 하는 인증방식)
// 을 설정하는 파일
import passport from "passport";
import GithubStrategy from "passport-github";
import FacebookStrategy from "passport-facebook";
import User from "./models/User";
import {
  githubLoginCallback,
  facebookLoginCallback
} from "./controllers/userController";
import routes from "./routes";

passport.use(User.createStrategy()); // User(passport-local-mongoose)에 새로운 로그인 방식을 알려줄거야!

// passport에게 github사용하라고 하기
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      callbackURL: `http://localhost:4000${routes.githubCallback}`
    },
    githubLoginCallback
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
      callbackURL: `https://70784bec.ngrok.io${routes.facebookCallback}`,
      profileFields: ["id", "displayName", "photos", "email"],
      scope: ["public_profile", "email"]
    },
    facebookLoginCallback
  )
);

passport.serializeUser(User.serializeUser()); // 쿠키에 id를 주고
passport.deserializeUser(User.deserializeUser()); // 준 id를 사용자로 전환하는 로직
// 여기까지가 사용자 인증을 처리한것이다 어떤 방식으로 처리할지를 말이다.
// 이렇게만 가능한 이유는 passport-local-mongoose를 import했기때문이다.
