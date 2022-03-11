const express = require("express");
const router = express.Router();
const Users = require("../model/users");
const bcrypt = require("bcrypt");
const jwt = require("jwt-simple");
const passport = require("passport");
//ใช้ในการ decode jwt ออกมา
const ExtractJwt = require("passport-jwt").ExtractJwt;
//ใช้ในการประกาศ Strategy
const JwtStrategy = require("passport-jwt").Strategy;

const SECRET = process.env.SECRET_KEY; //ในการใช้งานจริง คีย์นี้ให้เก็บเป็นความลับ

//สร้าง Strategy
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

//เสียบ Strategy เข้า Passport
passport.use(jwtAuth);

//ทำ Passport Middleware
const requireJWTAuth = passport.authenticate("jwt", { session: false });

//เสียบ middleware ยืนยันตัวตน JWT เข้าไป
router.get("/auth", requireJWTAuth, (req, res) => {
  res.send({ status: "Authorized" });
});

const login = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      username: req.body.user,
    });
    if (user !== null) {
      const verify_password = bcrypt.compareSync(req.body.pass, user.password);
      if (verify_password) {
        req.id = user._id;
        req.fullname = user.firstname + " " + user.lastname;
        next();
      } else {
        res.json({ message: "รหัสผ่านไม่ถูกต้องกรุณาลองใหม่" });
      }
    } else {
      res.json({ message: "ชื่อผู้ใช้ไม่ถูกต้องกรุณาลองใหม่" });
    }
  } catch (err) {
    res.json({ message: err.message });
  }
};

router.post("/auth", login, (req, res) => {
  const payload = {
    id: req.id,
    fullname: req.fullname,
    avatar:
      "https://stickerly.pstatic.net/sticker_pack/n4iDHYuyvbeamVgnfckVjw/RW4XCZ/31/5cacc1f9-45ef-445d-94a9-f066d212f2f3.png",
    iat: new Date().getTime(), //มาจากคำว่า issued at time (สร้างเมื่อ)
  };
  const jwt_token = jwt.encode(payload, SECRET);
  res.json({ token: jwt_token });
});

module.exports = router;

// var JwtStrategy = require('passport-jwt').Strategy,
//     ExtractJwt = require('passport-jwt').ExtractJwt;
// var opts = {}
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'secret';
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
// passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
//     User.findOne({id: jwt_payload.sub}, function(err, user) {
//         if (err) {
//             return done(err, false);
//         }
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//             // or you could create a new account
//         }
//     });
// }));
