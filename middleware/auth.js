const jwt = require("jsonwebtoken");
const {User} = require("../models");

const { ErrorHandler } = require("./errors");

const auth = (req, res, next) => {
    try {
      let token = req.header("Authorization");

      if (!token) return next(new ErrorHandler(401, "Access Denied"));
      token = token.replace(/^Bearer\s+/, "");

      jwt.verify(token, process.env.JWT_ACCESS_KEY, async (err, payload) => {
        if (err) {
          return next(new ErrorHandler(401, "Invalid Authentication"));
        }
        
        const { id,iat } = payload;
        const user = await User.findById(id);
        if (!user) next(new ErrorHandler(401, "Invalid Authentication"));
        if (iat < user.lastRefresh)
            return next(new ErrorHandler(401, "Invalid Token"));
        req.user = user;

        next();
      });

    } catch (err) {
      return next(err);
    }
};

module.exports = auth;