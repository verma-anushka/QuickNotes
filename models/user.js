var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// Schema Structure
var UserSchema = new mongoose.Schema({
    username: { 
                type: String, 
                unique: true,
                // required: true 
              },
    email:    { 
                type: String, 
                unique: true,
                // required: true 
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
                default: ""
              },
    contact:  { 
                type: Number,
                default: ""
              },       
    image:    {
                type: String, 
                default: "https://previews.123rf.com/images/tanyastock/tanyastock1803/tanyastock180300490/97923644-user-icon-avatar-login-sign-circle-button-with-soft-color-gradient-background-vector-.jpg"
              },
    imageId:  {
                 type: String, 
                 default: "https://previews.123rf.com/images/tanyastock/tanyastock1803/tanyastock180300490/97923644-user-icon-avatar-login-sign-circle-button-with-soft-color-gradient-background-vector-.jpg".public_id
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