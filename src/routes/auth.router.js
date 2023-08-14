const authRouter = require("express").Router();
const AuthController = require("../controllers/auth.controller");

const { asyncHandler } = require("../auth/checkAuth.utils");

// ! [POST]: Đăng ký tài khoản
authRouter.post("/signup", asyncHandler(AuthController.signUp));

// ! [POST]: Đăng nhập
authRouter.post("/signin", (req, res, next) => {
  return res.status(200).json("hello world");
});

module.exports = authRouter;
