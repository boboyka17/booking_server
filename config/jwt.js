// import
const jwt = require("jwt-simple");
const passport = require("passport");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
const Users = require("../model/users");

const SECRET = process.env.SECRET_KEY || "8f157589fe26126bfe357cad0390f4f4";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: SECRET, //SECRETเดียวกับตอนencodeในกรณีนี้คือ MY_SECRET_KEY
};

const jwtAuth = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await Users.findOne({ _id: payload.sub });
    if (user) {
      done(null, true);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, false);
  }
});

passport.use(jwtAuth);

// Middleware
const requireJWTAuth = passport.authenticate("jwt", { session: false });

module.exports = requireJWTAuth;
