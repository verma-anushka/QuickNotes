var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

// Schema Structure
var UserSchema = new mongoose.Schema({
    username: { 
                type: String, 
                required: true 
              },
    email:    { 
                type: String, 
                required: true 
              },
    password: { 
                type: String, 
                // required: true 
              }
});

UserSchema.plugin(passportLocalMongoose);

// Model Compilation
module.exports = mongoose.model("User", UserSchema);