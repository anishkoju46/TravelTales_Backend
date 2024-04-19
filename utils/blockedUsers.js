const {User} = require('../models/user_model');

let blockedUsers = {};

async function initBlocked() {
    const users = await User.find({"block" : true}).select("_id")
    // console.log(users)

    users.forEach((e)=>{
        // console.log(e._id)
        const id = e._id.toString()
        // console.log(id)
        blockUnblockUser(id)
        // if(!blockedUsers[id]){
        //             blockedUsers[id] = id
        //         }
    })
    //  console.log(blockedUsers)
};

function blockUnblockUser(id){
    const idString = id.toString()
    if(!blockUnblockUser[idString]){
        blockedUsers[idString] = idString
    }else{
        delete blockedUsers[idString]
    }
}

function isBlocked(id){
    if(blockedUsers[id.toString()]){
        return true
    }
    return false
}

module.exports = {blockedUsers, initBlocked, blockUnblockUser, isBlocked}