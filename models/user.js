var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// Schema Structure
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
                enum: ["male", "female", "prefer not to say"],
                default: "prefer not to say"
              },
    contact:  { 
                type: Number,
                default: ""
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
                // required: true 
              },
    password2: { 
                type: String, 
                // required: true 
                },
    notes: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Note" 
                }
              ],
    resetPasswordToken: String,
    resetPasswordExpires: Date
                         
});

UserSchema.plugin(passportLocalMongoose);

// Model Compilation
module.exports = mongoose.model("User", UserSchema);