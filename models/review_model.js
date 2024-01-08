const mongoose = require("mongoose")

const Review = mongoose.Schema({
    review: {type: String},
    user: {type: mongoose.Types.ObjectId, ref:"User"},
    rating: {type: Number},
    destination: {type: mongoose.Types.ObjectId, ref:"Destination"}
}, { timestamps: true })

Review.pre('save', async function(next) {

    next()
})

module.exports = { Review: mongoose.model("Review", Review) }