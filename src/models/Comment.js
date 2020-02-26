import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: "Text is required"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  /*
    //첫번째 방법
    comment에 연결된 Video ID를 줄것이 첫번째 방법.
    이방법 말고, 두번째 방법을 사용하겠다. 두번째는 Video.js자체에다가 comment []을 만든것이다.
    
    이건 첫번째 방법 object
    video:{
       type:mongoose.Schema.Types.ObjectId,//어떤 objectID가 어디서 온건지를 알려줘야한다. 어느 model에서 온건지 말이다
       ref:"Video"//여기 Video라는 이름은, Video.js에 const model = mongoose.model("Video",VideoSchema) 로 정의된 Video이다.     
    }
    */
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});
const model = mongoose.model("Comment", CommentSchema);
export default model; // 그리고 이렇게 한것을 init.js에 import해야지 왜? 최초 초기화 할떄 init.js니까
