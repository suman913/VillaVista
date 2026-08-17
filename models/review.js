const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({

    Comment: {
    type:String,
    
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
    },

    Date: {
        type: Date,
        default: Date.now,

    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",

    },
    

});


module.exports=mongoose.model("Review",ReviewSchema);
