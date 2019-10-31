var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// USER SCHEMA STRUCTURE
var UserSchema = new mongoose.Schema({
    username: { 
                type: String, 
                unique: true,
                required: true 
              },
    email:    { 
                type: String, 
                unique: true,
                required: true 
              },
    firstName: {
                type: String, 
                default: ""
              },
    lastName: {
                type: String, 
                default: ""
              },
    gender:   { 
                type: String,
              },
    contact:  { 
                type: Number,
              },       
    image:    {
                type: String, 
                default: "https://cdn.pixabay.com/photo/2014/04/02/16/26/figure-307268_960_720.png"
              },
    imageId:  {
                 type: String, 
                 default: "https://cdn.pixabay.com/photo/2014/04/02/16/26/figure-307268_960_720.png".public_id
    },
    bio:      {
                type: String,
                default: ''
              },
    password: { 
                type: String, 
              },
    password2: { 
                type: String, 
               },
    notes: [   {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Note" 
               }
              ],
    resetPasswordToken: String,
    resetPasswordExpires: Date      
                    
});

// AUTHENTICATION
UserSchema.plugin(passportLocalMongoose);

// MODEL COMPILATION
module.exports = mongoose.model("User", UserSchema);