const AuthService = require("../services/auth.service");

class AuthController {
  signUp = async (req, res, next) => {
    return res.status(201).json(await AuthService.signup(req.body));
  };
}

module.exports = new AuthController();
