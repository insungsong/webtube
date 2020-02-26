"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _passport = _interopRequireDefault(require("passport"));

var _routes = _interopRequireDefault(require("../routes"));

var _videoController = require("../controllers/videoController");

var _userController = require("../controllers/userController");

var _middlewares = require("../middlewares");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const globalRouter = _express.default.Router();

globalRouter.get(_routes.default.join, _middlewares.onlyPublic, _userController.getJoin);
globalRouter.post(_routes.default.join, _middlewares.onlyPublic, _userController.postJoin, _userController.postLogin);
globalRouter.get(_routes.default.login, _middlewares.onlyPublic, _userController.getLogin);
globalRouter.post(_routes.default.login, _middlewares.onlyPublic, _userController.postLogin);
globalRouter.get(_routes.default.home, _videoController.home); // "/"가 실행되면 home이 실행된다는 말이다 home은 import를 위에서 했다 videoController에 있는 home

globalRouter.get(_routes.default.search, _videoController.search);
globalRouter.get(_routes.default.logout, _middlewares.onlyPrivate, _userController.logout);
globalRouter.get(_routes.default.gitHub, _userController.githubLogin);
globalRouter.get(_routes.default.githubCallback, _passport.default.authenticate("github", {
  failureRedirect: "/login"
}), _userController.postGithubLogIn);
globalRouter.get(_routes.default.me, _userController.getMe); // 사용자를 페이스북에 보냄

globalRouter.get(_routes.default.facebook, _userController.facebookLogin); // 사용자를 페이스북에서 다시 받아올때

globalRouter.get(_routes.default.facebookCallback, _passport.default.authenticate("facebook", {
  failureRedirect: "/login"
}), _userController.postFacebookLogin);
var _default = globalRouter;
exports.default = _default;