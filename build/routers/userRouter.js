"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _routes = _interopRequireDefault(require("../routes"));

var _userController = require("../controllers/userController");

var _middlewares = require("../middlewares");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
//변수에 export를 붙인것은 해당 변수만 export한다는 말이다.
export const userRouter = express.Router();

외부에서도 이 userRouter를 쓸수있게 export해준것이다.
해당 우항에 맞는 function을 위에다가 만들어주는것도 방법이지만 이번엔, 익명함수를 볼 것이다.
익명함수로 표현한것
userRouter.get("/",(req,res) => res.send('user Index'));
userRouter.get("/edit",(req,res) => res.send('user edit'));
userRouter.get("/password",(req,res)=>res.send('user password'));
*/
const userRouter = _express.default.Router();

userRouter.get(_routes.default.users, _userController.users);
userRouter.get(_routes.default.getEditProfile, _middlewares.onlyPrivate, _userController.getEditProfile);
userRouter.post(_routes.default.getEditProfile, _middlewares.onlyPrivate, _middlewares.uploadAvatar, _userController.postEditProfile);
userRouter.get(_routes.default.changePassword, _middlewares.onlyPrivate, _userController.getChangePassword);
userRouter.post(_routes.default.changePassword, _middlewares.onlyPrivate, _userController.postChangePassword);
userRouter.get(_routes.default.userDetail(), _userController.userDetail);
var _default = userRouter;
exports.default = _default;