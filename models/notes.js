var mongoose = require("mongoose");
 
var NoteSchema = new mongoose.Schema({
    text: {
            type: String,
            required: true
          }
    // username: {
    //         type: String,
    //         required: true
    //       }
    // author: {
    //     id: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "User" 
    //     },
    //     username: String
    // }
});

module.exports = mongoose.model("Note", NoteSchema);