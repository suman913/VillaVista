const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
let { saveRedirectUrl } = require("../middleware.js");
const usercontroller = require("../controller/user.js");

const isGoogleAuthConfigured = () =>
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CALLBACK_URL;


router.route("/signup")
    .get(usercontroller.rendersignUpForm)
    .post(wrapAsync(usercontroller.signUpUser))



router.route("/login")
    .get( usercontroller.renderloginForm)
    .post(
         saveRedirectUrl,
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        usercontroller.login
    )

router.get("/logout", usercontroller.logout);

// Google OAuth routes
router.get(
    "/auth/google",
    (req, res, next) => {
        if (!isGoogleAuthConfigured()) {
            req.flash("error", "Google login is not configured.");
            return res.redirect("/login");
        }
        next();
    },
    passport.authenticate("google", { scope: ["profile", "email"] })
  );
  
  router.get(
    "/auth/google/callback",
    (req, res, next) => {
      if (!isGoogleAuthConfigured()) {
          req.flash("error", "Google login is not configured.");
          return res.redirect("/login");
      }
      next();
    },
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      req.flash("success", "Welcome to Wanderlust via Google!");
      res.redirect("/listings");
    }
  );


module.exports = router;
