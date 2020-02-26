import mongoose from "mongoose"; // MongoDB 연결
import dotenv from "dotenv";

dotenv.config(); // dotenv.config는 .env에 정의한 정보를 가져옴

// templete가 필요한 이유
// 여기서 우리가 요청하는 것은 string으로된 DB이다. 어디에 db가 저장되었는지 알려주는 것이다.
// 'mongodb://localhost:포트번호/DataBase이름'

mongoose.connect(
  process.env.NODE_ENV ? process.env.MONGO_URL_PROD : process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);
const db = mongoose.connection;

const handleOpen = () => console.log("✅  Connect to DB");
const handleError = error =>
  console.log(`✅   Error on DB Connection: ${error}`);

db.once("open", handleOpen);
db.on("error", handleError);
