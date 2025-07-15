const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) next(err);
            req.flash("success", "Welcome to Yelp Camp!");
            res.redirect("/campgrounds");
        })
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
});

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", storeReturnTo, passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), async (req, res) => {
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    req.flash("success", "Welcome back!");
    res.redirect(redirectUrl);
});

router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged you out");
        res.redirect("/campgrounds");
    });
});

module.exports = router;