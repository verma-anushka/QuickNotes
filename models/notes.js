var mongoose = require("mongoose");
 
var NoteSchema = new mongoose.Schema({
  
  type: {
          type: String,
  },
  
  title:{
          type: String,
          // required: true
        },

  description: {
          type: String,
          // required: true
        },

  // MEETING 
  meetingDate: {
    type: Date,
  },
  meetingAgenda: {
    type: String,
  },
  meetingAttendees: {
    type: String,
  },
  meetingAction: {
    type: String,
  },
  meetingAssignee: {
    type: String,
  },
  meetingStatus: {
    type: String,
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
},
{
  timestamps: true
});

module.exports = mongoose.model("Note", NoteSchema);