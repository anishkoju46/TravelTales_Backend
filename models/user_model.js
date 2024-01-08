const mongoose = require("mongoose")

const User = mongoose.Schema({
    fullName: { type: String, required: ["Full Name is required", true] },
    email: { type: String, unique: true,   trim: true, required: ["email is required", true] },
    password: { type: String},
    phoneNumber: { type: String, required: ["phone number is required", true] ,unique: true},
    imageUrl: { type: String, default: ""},
    role: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    favourites: [{type: mongoose.Types.ObjectId, ref: "Destination"}],
    gallery: [{type: String}]
}, { timestamps: true })

User.pre('save', async function(next) {

    next()
})

module.exports = { User: mongoose.model("User", User) }