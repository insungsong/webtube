"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _passportLocalMongoose = _interopRequireDefault(require("passport-local-mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// passport-local-mongoose를 사용하는 방법론을 정의한 파일
// passport.js에서 사용자에게 쿠키를 주고, 그 준 쿠키를 해당 사용자가 맞는지 확인하는 작업을 한다고 한다면,
// 이 js파일의 경우에는 해당 passport가 사용할 사용법을 정의한다.
// passport-local-mongoose는 해당 쿠키에 id를 주고 id의 사용자를 판별하는 기능은 물론, 여러 암호화 기능등 로그인에 필요한 다양한 기능을 수행한다.
const UserSchema = new _mongoose.default.Schema({
  name: String,
  email: String,
  avatarUrl: String,
  facebookId: Number,
  githubId: Number,
  comments: [{
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Comment"
  }],
  videos: [{
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Video"
  }]
});
UserSchema.plugin(_passportLocalMongoose.default, {
  usernameField: "email"
}); // usernameField로 설정할 것은, form을 해서 보내는, name 즉 value와 값이 같아야한다.
// 스키마를 plugin할때 passportLocalMongoose가 req에 따른 쿠키를 주고 그 쿠키를 받는과정에서 해당 id가 그 사람의 id인지 판단의 기준을 usernameField로 한다는 말이다.
// usernameFile의 기본은 name인데 그것을 usernameField를 통해서 name이 default가 아닌 email로 username을 바꿔준것이다.
// 즉, 해당 Schema(형태)를 읽을때마다, passportmongoose가 email을 정보를 가지고 판단하게 하도록 하는것이다.
// model 생성!

const model = _mongoose.default.model("User", UserSchema); // User라는 이름의 model이고 형태는 UserSchema라는 뜻


var _default = model;
exports.default = _default;