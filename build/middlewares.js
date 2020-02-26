"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onlyPrivate = exports.onlyPublic = exports.localMiddleware = exports.uploadAvatar = exports.uploadVideo = void 0;

var _multer = _interopRequireDefault(require("multer"));

var _multerS = _interopRequireDefault(require("multer-s3"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const s3 = new _awsSdk.default.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
  region: "ap-northeast-1"
}); // const multerVideo = multer({ dest: "uploads/videos/" }); multar는 비디오파일을 url명으로 저장하게 하는 api dest를 통해서 설명으로 videos/의 의미는 server에 존재하는 폴더에 videos/라는 폴더를 만들겠다라는 의미 그 의미를 가진 변수 multarVideo
// 위에 multerVideo는 이 프로젝트 폴더 안에 해당 video들을 저장했다면 이번에는 aws s3에다가 저장할 것이다.
// const multerAvatar = multer({ dest: "uploads/avatars/" });

const multerVideo = (0, _multer.default)({
  storage: (0, _multerS.default)({
    s3: s3,
    acl: "public-read",
    bucket: "wetubeoffcial/video"
  })
});
const multerAvatar = (0, _multer.default)({
  storage: (0, _multerS.default)({
    s3: s3,
    acl: "public-read",
    bucket: "wetubeoffcial/avatar"
  })
});
const uploadVideo = multerVideo.single("videoFile"); // mutarVideo는 videos/ 폴더를 가진곳에 singel(하나만 넣겠다 어떤거? videoFile만! 해당 videoFile이라는 이름은 upload.pug에서 input 부분에 video를 직접적으로 담는 부분의 name과 동일시켰다 그래야 한다) 그리고 이것을 가지고 이제 videoRouter에 갔다.

exports.uploadVideo = uploadVideo;
const uploadAvatar = multerAvatar.single("avatar");
exports.uploadAvatar = uploadAvatar;

const localMiddleware = (req, res, next) => {
  // locals를 추가하면 이제 전역변수처럼 어디서든 쓸 수 있다. locals로 하면 그다음 routes들로 가기전에 해당 res.locals로 하면 어떤 view 즉, templets에서도 볼 수 있다는 말이다.
  res.locals.siteName = "WeTube";
  res.locals.routes = _routes.default; // 모든 routes.js에 정의된 것들을 어떤 view가 호출되든 사용할 수 있게 하는 부분이다.

  res.locals.loggedUser = req.user || null; // req.user의 의미는 쿠키를 포함하고 있냐를 알 수 있는것이다.

  next(); // 다음 미들웨어를 실행하라는 것이다 여기서 말하는 middleware란? 다음 routes들을 의미한다.왜? app.js에서 app.use(localMiddleware); 다음에 나오는  app.use들이 routes에 관한것들이니까
}; // 로그아웃 상태일때만 허용하겠다는 의미의 변수


exports.localMiddleware = localMiddleware;

const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(_routes.default.home);
  } else {
    next();
  }
}; // 오직 로그인한 사람만 이용할 수 있는 수정과 같은것


exports.onlyPublic = onlyPublic;

const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(_routes.default.home);
  }
};

exports.onlyPrivate = onlyPrivate;