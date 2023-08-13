const AuthService = require("../services/auth.service");

class AuthController {
  signUp = async (req, res, next) => {
    try {
      return res.status(201).json(await AuthService.signup(req.body));
    } catch (error) {
      throw new Error(error);
    }
  };
}

module.exports = new AuthController();
