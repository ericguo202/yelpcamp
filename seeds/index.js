const mongoose = require("mongoose");
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Connected to Mongoose");
    })
    .catch(err => {
        console.log("Error with connecting to Mongoose", err);
    });


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: "6877a8714ad486ec1d0a7f20",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dmezzqmsp/image/upload/v1753470251/YelpCamp/geeiz0wuxv20cayutzo9.jpg',
                    filename: 'YelpCamp/geeiz0wuxv20cayutzo9'
                },
                {
                    url: 'https://res.cloudinary.com/dmezzqmsp/image/upload/v1753470298/YelpCamp/uxph4g613xeu5ymqmuk9.jpg',
                    filename: 'YelpCamp/uxph4g613xeu5ymqmuk9'
                }
            ],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium explicabo cumque dicta distinctio reiciendis? Harum, deserunt deleniti incidunt accusantium minus commodi velit possimus quas nam beatae obcaecati quia? Doloremque, voluptas.",
            price: Math.floor(Math.random() * 20 + 10)
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})