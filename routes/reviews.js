const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");

// new review
router.post("/", isLoggedIn, validateReview, reviews.createReview);

// delete review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, reviews.deleteReview);

module.exports = router;