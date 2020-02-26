"use strict";

var _axios = _interopRequireDefault(require("axios"));

var _deleteComment = require("./deleteComment");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML) + 1;
}; // 실시간으로 보낸게 아닌데 실시간 처럼 보이는 fake이다.
// 왜냐면, status code를 listening하기때문이다.


const addComment = comment => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const button = document.createElement("button");
  span.innerHTML = comment;
  span.id = "jsComment";
  button.className = "deleteBtn";
  button.innerHTML = "<i class='fas fa-trash-alt'></i>";
  button.addEventListener("click", _deleteComment.handleDeleteComment);
  li.appendChild(span);
  li.appendChild(button);
  commentList.prepend(li);
  increaseNumber(commentNumber);
}; // api로 값을 보내는 역할을 한다.


const sendComment = async comment => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await (0, _axios.default)({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment
    }
  });

  if (response.status === 200) {
    // response.status === 200의 말은, db에 성공적으로 접근했을때의 의미와 같다.
    addComment(comment);
  }
};

const handleSubmit = event => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
  init();
}