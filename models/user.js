var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// Schema Structure
var UserSchema = new mongoose.Schema({
    username: { 
                type: String, 
                // required: true 
              },
    email:    { 
                type: String, 
                // required: true 
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
    resetPasswordExpires:Date,
                         
});

UserSchema.plugin(passportLocalMongoose);

// Model Compilation
module.exports = mongoose.model("User", UserSchema);