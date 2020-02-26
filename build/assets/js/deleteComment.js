"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleDeleteComment = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const comment = document.getElementById("jsComment");
let deleteBtnArr;

const decreseCommentNum = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML) - 1;
};

const fackDeleteComment = li => {
  li.remove();
  decreseCommentNum();
};

const deleteComment = async thisComment => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await (0, _axios.default)({
    url: `/api/${videoId}/deleteComment`,
    method: "POST",
    data: {
      thisComment
    }
  });
};

const handleDeleteComment = event => {
  const li = event.target.closest("li");
  const comment = li.children;
  const thisComment = comment[0].innerHTML;
  fackDeleteComment(li);
  deleteComment(thisComment);
};

exports.handleDeleteComment = handleDeleteComment;

const init = () => {
  deleteBtnArr = document.querySelectorAll(".deleteBtn");
  deleteBtnArr.forEach(deleteBtn => {
    const DeleteBtn = deleteBtn;
    DeleteBtn.addEventListener("click", handleDeleteComment);
  });
};

if (comment) {
  init();
}