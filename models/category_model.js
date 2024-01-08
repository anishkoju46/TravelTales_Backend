const mongoose = require("mongoose")

const Category = mongoose.Schema({
    name: {type: String},
    user: {type: mongoose.Types.ObjectId, ref: "User"}
}, { timestamps: true })

Category.pre('save', async function(next) {

    next()
})

module.exports = { Category: mongoose.model("Category", Category) }