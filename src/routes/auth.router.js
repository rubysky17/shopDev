const authRouter = require("express").Router();
const AuthController = require("../controllers/auth.controller");

// ! [POST]: Đăng ký tài khoản
authRouter.post("/signup", AuthController.signUp);

// ! [POST]: Đăng nhập
authRouter.post("/signin", (req, res, next) => {
  console.log(req.body);

  return res.status(200).json("hello world");
});

module.exports = authRouter;
