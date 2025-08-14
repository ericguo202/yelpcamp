const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload/", "/upload/w_300/");
});

const campgroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        { type: Schema.Types.ObjectId, ref: "Review" }
    ]
});

campgroundSchema.post("findOneAndDelete", async function (campground) {
    if (campground.reviews) { // first check if any reviews existed on the deleted campground
        await Review.deleteMany({ _id: { $in: campground.reviews } });
    }
});

module.exports = mongoose.model("Campground", campgroundSchema);