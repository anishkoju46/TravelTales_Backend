const mongoose = require("mongoose")


const HotlineNumber = mongoose.Schema({
    phoneNumber: { type: String },
    organizationName: {type: String}
   

}, {timestamps: true})

HotlineNumber.pre('save', async function (next){
    next()
}
)

module.exports = {HotlineNumber: mongoose.model("HotlineNumber", HotlineNumber)}