const AuthService = require("../services/auth.service");

const { CREATED, OK } = require("../core/success.response");
class AuthController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Register OK!",
      metadata: await AuthService.signup(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };

  login = async (req, res, next) => {
    new OK({
      message: "Login OK!",
      metadata: await AuthService.login(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };

  logout = async (req, res, next) => {
    new OK({
      message: "Logout OK!",
      metadata: await AuthService.logout(req.keyStore),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AuthController();
