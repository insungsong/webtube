import express from "express";
import routes from "../routes";
import {
  userDetail,
  users,
  getEditProfile,
  postEditProfile,
  getChangePassword,
  postChangePassword
} from "../controllers/userController";
import { onlyPrivate, uploadAvatar } from "../middlewares";
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

const userRouter = express.Router();

userRouter.get(routes.users, users);
userRouter.get(routes.getEditProfile, onlyPrivate, getEditProfile);
userRouter.post(
  routes.getEditProfile,
  onlyPrivate,
  uploadAvatar,
  postEditProfile
);

userRouter.get(routes.changePassword, onlyPrivate, getChangePassword);
userRouter.post(routes.changePassword, onlyPrivate, postChangePassword);
userRouter.get(routes.userDetail(), userDetail);

export default userRouter;
