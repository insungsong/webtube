"use strict";

var _passport = _interopRequireDefault(require("passport"));

var _passportGithub = _interopRequireDefault(require("passport-github"));

var _passportFacebook = _interopRequireDefault(require("passport-facebook"));

var _User = _interopRequireDefault(require("./models/User"));

var _userController = require("./controllers/userController");

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// User.js에서는 passport를 mongoose를 통해 방법론을 쓸거야를 선언한것이라면,
// 해당 파일에서는
// passport-local(즉, 어떻게 로그인할것인 방식을 작성하는 파일 + 사용자 인증 특히, username과 password를 가지고 하는 인증방식)
// 을 설정하는 파일
_passport.default.use(_User.default.createStrategy()); // User(passport-local-mongoose)에 새로운 로그인 방식을 알려줄거야!
// passport에게 github사용하라고 하기

_passport.default.use(
  new _passportGithub.default(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      callbackURL: process.env.NODE_ENV
        ? `https://fathomless-bastion-84075.herokuapp.com${_routes.default.githubCallback}`
        : `http://localhost:4000${_routes.default.githubCallback}`
    },
    _userController.githubLoginCallback
  )
);

_passport.default.use(
  new _passportFacebook.default(
    {
      clientID: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
      callbackURL: `https://70784bec.ngrok.io${_routes.default.facebookCallback}`,
      profileFields: ["id", "displayName", "photos", "email"],
      scope: ["public_profile", "email"]
    },
    _userController.facebookLoginCallback
  )
);

_passport.default.serializeUser(_User.default.serializeUser()); // 쿠키에 id를 주고

_passport.default.deserializeUser(_User.default.deserializeUser()); // 준 id를 사용자로 전환하는 로직
// 여기까지가 사용자 인증을 처리한것이다 어떤 방식으로 처리할지를 말이다.
// 이렇게만 가능한 이유는 passport-local-mongoose를 import했기때문이다.
