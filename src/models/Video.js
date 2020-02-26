import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  fileUrl: {
    type: String,
    required: "File url is required"
  },
  title: {
    type: String,
    required: "Title is required"
  },
  description: String,
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now // 현재 날짜를 반환하는 function이다.
  },
  // 첫번째 방법, videoID를 comment에 넣는방법(이 방법의 경우에는, Comment.js에서 작성하는 방법이다.)
  // 두번째 방법(= 비디오가 회원 ID하나하나씩을 배열에 넣는 방법)
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

// 위에서 만든 schema(형태)를 가지고 Model(실제 데이터 = document = JSON)만들기
const model = mongoose.model("Video", VideoSchema);
// model의 이름은 video라는 뜻 그리고 우항은 Video이름을 가진 모델의 schema는 VideoSchema라는 뜻
// 즉 몽구스야 모델의 이름은 Video로 하고 이 date의 형태는 VideoSchema야 라는 말!

export default model;
