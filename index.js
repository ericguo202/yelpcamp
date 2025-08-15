// dotenv
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
// relating to the app
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const campgroundRouter = require("./routes/campgrounds");
const reviewRouter = require("./routes/reviews");
const userRouter = require("./routes/users");

// utilities
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const sanitizeV5 = require("./utils/mongoSanitizeV5");

// schemas
const User = require("./models/user");

const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Connected to Mongoose");
    })
    .catch(err => {
        console.log("Error with connecting to Mongoose", err);
    });

const app = express();

// related to sanitizeV5
app.set("query parser", "extended");

// view engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(sanitizeV5({ replaceWith: "_" }));

const sessionConfig = {
    name: "sess",
    secret: "thisisnotarealsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // only accessible through http, not javascript (for security reasons)
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.query);
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// routes
app.use("/campgrounds", campgroundRouter);
app.use("/campgrounds/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/", (req, res) => {
    res.render("home");
});

app.use((req, res, next) => {
    throw new ExpressError("Page Not Found", 404);
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    err.status = status;
    err.message = message;
    res.status(status).render("error", { err });
})

app.listen(3000, () => {
    console.log("Listening on Port 3000");
});