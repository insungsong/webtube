import axios from "axios";

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
  const response = await axios({
    url: `/api/${videoId}/deleteComment`,
    method: "POST",
    data: { thisComment }
  });
};
export const handleDeleteComment = event => {
  const li = event.target.closest("li");
  const comment = li.children;
  const thisComment = comment[0].innerHTML;
  fackDeleteComment(li);
  deleteComment(thisComment);
};

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
