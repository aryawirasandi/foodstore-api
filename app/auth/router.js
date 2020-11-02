const router = require('express').Router();
const multer = require("multer");
const controller = require("./controller");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// passport.use(new LocalStrategy({ usernameField : 'email' }, controller.localStrategy));
passport.use(new LocalStrategy({usernameField: 'email'}, controller.localStrategy));
router.post("/register", multer().none(), controller.register);
router.post("/login", multer().none(), controller.login);
router.post("/logout", controller.logout)
router.get("/me", multer().none(), controller.me);
module.exports = router;