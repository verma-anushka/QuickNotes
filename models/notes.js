var mongoose = require("mongoose");
 
var NoteSchema = new mongoose.Schema({
    
  title:{
          type: String,
          // required: true
        },

  description: {
          type: String,
          // required: true
        },

  date: {
          type: Date,
          default: Date.now
        },

  author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User" 
            },
            username: String
          }
});

module.exports = mongoose.model("Note", NoteSchema);