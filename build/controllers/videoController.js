"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postDeleteComment = exports.postAddComment = exports.postRegisterView = exports.deleteVideo = exports.postEditVideo = exports.getEditVideo = exports.videoDetail = exports.postUpload = exports.getUpload = exports.search = exports.home = void 0;

var _routes = _interopRequireDefault(require("../routes"));

var _Video = _interopRequireDefault(require("../models/Video"));

var _Comment = _interopRequireDefault(require("../models/Comment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// db의 element가 아니라, 단지 model이다.
const home = async (req, res) => {
  try {
    const videos = await _Video.default.find({}).sort({
      _id: -1
    }); // 이렇게하면 Video에  있는 모든 db내용을 가져온다; _id:-1은 최신순을 앞에 나오게 하는것이다.

    res.render("home", {
      pageTitle: "Home",
      videos
    });
  } catch (error) {
    console.log(error);
    res.render("home", {
      pageTitle: "Home",
      videos: []
    });
  }
}; // 해당 res.render("home");은 더이상 res.send("home");에서 home이라는 p태그 개념의 내용이 아니라, "home"은 pug를 의미한다.
// 따라서, home.pug에 들어가보면 extends main.pug를 하고있다. 그래서 Home | WeTube라고 나올 수 있는것이다.


exports.home = home;

const search = async (req, res) => {
  const {
    query: {
      term: searchingBy
    } // query는 console.log를 통해 inpute을 통해 글 쓰는걸 엔터누르면 나오는 값이다.

  } = req; //= req.query.term

  let videos = [];

  try {
    videos = await _Video.default.find({
      title: {
        $regex: searchingBy,
        $options: "i"
      }
    });
  } catch (error) {
    console.log(error);
  }

  res.render("search", {
    pageTitle: "Search",
    searchingBy,
    videos
  });
};

exports.search = search;

const getUpload = (req, res) => res.render("upload", {
  pageTitle: "Upload"
});

exports.getUpload = getUpload;

const postUpload = async (req, res) => {
  const {
    body: {
      title,
      description
    },
    file: {
      location
    }
  } = req; // req.body , req.file과 같다.

  console.log(req.file);
  const newVideo = await _Video.default.create({
    fileUrl: location,
    title,
    description,
    creator: req.user.id
  });
  req.user.videos.push(newVideo.id);
  req.user.save();
  res.redirect(_routes.default.videoDetail(newVideo.id));
};

exports.postUpload = postUpload;

const videoDetail = async (req, res) => {
  const {
    params: {
      id
    }
  } = req;

  try {
    const video = await _Video.default.findById(id).populate("creator").populate("comments");
    res.render("videoDetail", {
      pageTitle: video.title,
      video
    });
  } catch (error) {
    console.log(error);
    res.redirect(_routes.default.home);
  }
};

exports.videoDetail = videoDetail;

const getEditVideo = async (req, res) => {
  const {
    params: {
      id
    }
  } = req;

  try {
    const video = await _Video.default.findById(id);

    if (String(video.creator) !== req.user.id) {
      throw Error();
    } else {
      res.render("editVideo", {
        pageTitle: `Edit${video.title}`,
        video
      });
    }
  } catch (error) {
    res.redirect(_routes.default.home);
  }
};

exports.getEditVideo = getEditVideo;

const postEditVideo = async (req, res) => {
  const {
    params: {
      id
    },
    body: {
      title,
      description
    }
  } = req;

  try {
    await _Video.default.findOneAndUpdate({
      _id: id
    }, {
      title,
      description
    });
    res.redirect(_routes.default.videoDetail(id));
  } catch (error) {
    res.render(_routes.default.home);
  }
};

exports.postEditVideo = postEditVideo;

const deleteVideo = async (req, res) => {
  const {
    params: {
      id
    }
  } = req;

  try {
    const video = await _Video.default.findById(id);
    console.log(video);
    console.log(video.creator);
    console.log(req.user.id);

    if (String(video.creator) !== req.user.id) {
      throw Error();
    } else {
      await _Video.default.findOneAndRemove({
        _id: id
      });
    }
  } catch (error) {
    console.log(error);
  }

  res.redirect(_routes.default.home);
}; // Register Video View


exports.deleteVideo = deleteVideo;

const postRegisterView = async (req, res) => {
  const {
    params: {
      id
    }
  } = req; // req.params.id <- 여기서 id를 받아오는게 가능한 이유는 RegisterView에 접근할때 URL에 :id를 전달하기 때문에 id값을 req.params.id가 가능한 것이다.

  try {
    const video = await _Video.default.findById(id);
    video.views = video.views + 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
}; // ADD comment


exports.postRegisterView = postRegisterView;

const postAddComment = async (req, res) => {
  const {
    params: {
      id
    },
    body: {
      comment
    },
    user
  } = req;

  try {
    const video = await _Video.default.findById(id);
    const newComment = await _Comment.default.create({
      text: comment,
      creator: user.id
    });
    video.comments.push(newComment.id);
    video.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

exports.postAddComment = postAddComment;

const postDeleteComment = async (req, res) => {
  const {
    params: {
      id
    },
    body: {
      thisComment
    }
  } = req;

  try {
    const video = await _Video.default.findById(id).populate("creator").populate("comments");
    let index = -1;
    const commentIndex = video.comments.find(function (item, i) {
      if (item.text === thisComment) {
        index = i;
        return i;
      }
    });
    const deleteComment = video.comments.splice(index, 1);
    video.save();
    const deleteCommentId = deleteComment[0].id;
    await _Comment.default.findByIdAndRemove(deleteCommentId);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

exports.postDeleteComment = postDeleteComment;