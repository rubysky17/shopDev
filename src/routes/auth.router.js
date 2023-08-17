const authRouter = require("express").Router();
const AuthController = require("../controllers/auth.controller");

const { asyncHandler } = require("../auth/checkAuth.utils");

// ! [POST]: Đăng ký tài khoản
authRouter.post("/signup", asyncHandler(AuthController.signUp));

// ! [POST]: Đăng nhập
authRouter.post("/signin", asyncHandler(AuthController.login));

module.exports = authRouter;
