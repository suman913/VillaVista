const User = require("../models/user")

module.exports.rendersignUpForm = (req, res) => {
    res.render("user/signup.ejs");

}


module.exports.renderloginForm = (req, res) => {
    res.render("user/login.ejs");

}


module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logout Successfully");
        res.redirect("/listings");
    });
}

module.exports.signUpUser = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash("error", "A user with this email already exists.");
            return res.redirect("/signup");
        }

        let newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);

        req.login(registeredUser, function (err) {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};
