const mongoose = require("mongoose")

const Coordinate = mongoose.Schema({
    type: { type: String, default: "Point" },
    coordinates: [Number],
})

const Destination = mongoose.Schema({
    name: { type: String, required: ["Name is required", true] },
    coordinates: {type:Coordinate, required: ["coordinates is required", true] },
    description: { type: String, required: ["description is required", true] },
    itinerary: [{type: String}],
    imageUrl: [{ type: String, required: ["image is required", true] }],
    rating: { type: Number, default: 0},
    reviews: [{type: mongoose.Types.ObjectId, ref: "Review"}],
    region: { type: String, required: ["region is required", true] },
    bestSeason: { type: String, required: ["bestSeason is required", true] },
    duration: { type: String, required: ["duration is required", true] },
    maxHeight: { type: String, required: ["maxHeight is required", true] },
    category: {type: mongoose.Types.ObjectId, ref:"Category", required: ["category is required", true] },
    views: {type: Number},
    favouriteCount: {type: Number},
    emergencyContact : [{type: String}]
}, { timestamps: true })

Destination.pre('save', async function(next) {

    next()
})

module.exports = { Destination: mongoose.model("Destination", Destination) }