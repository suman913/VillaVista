const mongoose = require("mongoose");
const { Schema } = mongoose;

const Review = require("./review.js");



const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            url: String,
            filename: String,
        },
        price: {
            type: Number,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        geometry: {
            type: {
                type: String, // Don't do `{ location: { type: String } }`
                enum: ['Point'], // 'location.type' must be 'Point'
                default: "Point",
                required: true
            },
            coordinates: {
                type: [Number],
                default: [77.209, 28.6139],
                required: true
            }
        },
        category: {
            type : String ,
            

        },

    }
);

listingSchema.post("findOneAndDelete", async (listing) => {

    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }


})

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;

