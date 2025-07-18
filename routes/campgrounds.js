const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

router.get("/", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.post("", isLoggedIn, validateCampground, async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author");
    if (!campground) {
        req.flash("error", "Cannot find campground");
        console.log("Error!");
        res.redirect("/campgrounds");
    }
    else {
        res.render("campgrounds/show", { campground });
    }
});

router.get("/:id/edit", isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "Cannot find campground");
        console.log("Error!");
        res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
});

router.put("/:id", isLoggedIn, isAuthor, validateCampground, async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, { runValidators: true, new: true });
    req.flash("success", "Successfully edited campground!");
    res.redirect(`/campgrounds/${campground._id}`);
})

router.delete("/:id", isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds");
});

module.exports = router;