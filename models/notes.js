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
  // TO DO
  todos: [{
    type: String
  }],

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
  meetingAction: [{
    type: String,
  }],
  meetingAssignee: [{
    type: String,
  }],
  meetingStatus: [{
    type: String,
  }],
  // meetingTable: [{
  //   meetingAction: [{
  //     type: String,
  //   }],
  //   meetingAssignee: [{
  //     type: String,
  //   }],
  //   meetingStatus: [{
  //     type: String,
  //   }]
  // }],
  // meetingAttendees: {
  //   type: String,
  // },
  // meetingAction: {
  //   type: String,
  // },
  // meetingAssignee: {
  //   type: String,
  // },


  eventTitle: [{
    type: String,
    // required: true
  }],
  eventDescription: [{
      type: String,
      // required: true
    }],
  eventAllDay: [{
      type: Boolean,
      // required: true
    }],
  eventStart: [{
                type: Date,
                default: Date.now
            }],
  eventEnd: [{
                type: Date,
                // default: Date.now
              }],
  eventAvailability: [{
            type: String,
            possibleValues: ['true', 'false']
            // default: Date.now
          }],

  // DAILY REFLECTION
  dailyReflection: [{
    type: String,
  }],

  // MEAL PLANNER
  meal1: [{
    type: String,
  }],
  meal2: [{
    type: String,
  }],
  meal3: [{
    type: String,
  }],
  
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