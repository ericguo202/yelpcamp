const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");

router.route("/")
    .get(campgrounds.index)
    .post(isLoggedIn, validateCampground, campgrounds.createCampground);

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(campgrounds.showCampground)
    .put(isLoggedIn, isAuthor, validateCampground, campgrounds.updateCampground)
    .delete(isLoggedIn, isAuthor, campgrounds.deleteCampground);

router.get("/:id/edit", isLoggedIn, isAuthor, campgrounds.renderEditForm);

module.exports = router;