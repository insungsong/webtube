import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
  res.render("join", { pageTile: "Join" });
};

// next를 넣어줌으로써 middleware로 탈바꿈 할것이다.
export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 }
  } = req;
  if (password !== password2) {
    req.flash("error", "Passwords don't match");
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = await User({
        // 해당 name과 email은 위에 body에서 가져온것이다 그럼 저 body의 name과 email은 누가 보낸거야? join.pug에서 submit해서 보낸 정보이다.
        // name,email은 위에서 const lala = req.body에서 가져온 것이다.
        name,
        email
      });
      await User.register(user, password);
      // DB에 사용자를 생성하고 암호를 암호화합니다.
      next(); // 여기서 끝내지말고, 즉, PostJoin이 이 function을 실행한후 우리는 globalRouter에 나와있는데로, postLogin을 실행하러 가기위해 next를 쓰는것이다.
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};

// 로그인 기능

export const getLogin = (req, res) =>
  res.render("login", { pageTile: "Login" });

export const postLogin = passport.authenticate("local", {
  // 이 'local'은 우리가 설치해준 passport-local-mongoose의 local을 의미한다. 즉, strategy
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: "Welcome",
  failureFlash:"Can't log in. check email and/or password"
});

// 가장 먼저 사용자는 github으로 가야한다. auth/github을 통해 git에 보내지게됨
export const githubLogin = passport.authenticate("github");

// /callback으로 돌아올테고 callback으로 돌아오고 나서 로그인을 해줘야한다. globalRouter에 passport가 하나 있어야한다는 말이지!
// 위에서 githubLogin을 실행하면 passport로 가서, {object}들을 실행하고,
export const githubLoginCallback = async (
  accessToken,
  refreshToken,
  profile,
  cb
) => {
  // console.log(accessToken, refreshToken, profile, cb);
  const {
    _json: { id, avatar_url: avatarUrl, name, email }
  } = profile; // = const blalala = profile.json
  try {
    const user = await User.findOne({ email });
    if (user) {
      // 해당 User에 저장되어 있는 email이라면
      user.githubId = id; // id는 _json에서 얻은 id이다. 이걸로 update해준다는 말이다. githubId는 User에서 온 변수이다.
      user.save(); // 꼭 save해줘야한다.
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

// 로그인을 성공적으로 githubLogin을 통해 했을때
// callback하기 전에 그 정보를 callback주기위해 github로 부터 가져오는 function
export const postGithubLogIn = (req, res) => {
  res.redirect(routes.home);
};

// facebook 로그인
export const facebookLogin = passport.authenticate("facebook");

export const facebookLoginCallback = async (
  accessToken,
  refreshToken,
  profile,
  cb
) => {
  const {
    _json: { id, name, email }
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.facebookId = id;
      user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};
export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
};
export const logout = (req, res) => {
  // TO DO: process Log Out
  req.logout();
  res.redirect(routes.home);
};

export const users = (req, res) => res.render("users", { pageTile: "Users" });

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const userDetail = async (req, res) => {
  const {
    params: { id }
  } = req; // id는 :id를 의미한다 왜? routes에서 :id로 썻기때문이다.
  try {
    const user = await User.findById(id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    res.redirect(routes.home);
  }
};
export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTile: "Edit Profile" });

export const postEditProfile = async (req, res) => {
  const {
    body: { name, email }, // 여기 body는 어디서 받아오는거야? editProfile.pug에서 submit할때 받아오는 name정보들이다.
    file
  } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl // file이 있다면 file.path로 할거고 file이 없다면 기존의 즉, req.user.avatarUrl을 쓴다는 말이다.
    });
    res.redirect(routes.me);
  } catch (error) {
    res.redirect(routes.getEditProfile);
  }
};

export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTile: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 }
  } = req;
  try {
    if (newPassword !== newPassword1) {
      res.status(400);
      res.redirect(`/users/${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    res.status(400);
    res.redirect(`/users/${routes.changePassword}`);
  }
};
