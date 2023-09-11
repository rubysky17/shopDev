const authRouter = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const { authentication } = require("../auth/auth.utils");

const { asyncHandler } = require("../auth/checkAuth.utils");

// ! [POST]: Đăng ký tài khoản
authRouter.post("/signup", asyncHandler(AuthController.signUp));

// ! [POST]: Đăng nhập
authRouter.post("/signin", asyncHandler(AuthController.login));

authRouter.use(authentication);

// ! [POST]: Đăng xuất
authRouter.post("/logout", asyncHandler(AuthController.logout));
authRouter.post(
  "/handleRefreshToken",
  asyncHandler(AuthController.handleRefreshToken)
);

module.exports = authRouter;
