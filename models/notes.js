var mongoose = require("mongoose");
 
// NOTES SCHEMA STRUCTURE
var NoteSchema = new mongoose.Schema({
  
  // GENERAL
  type: {
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
          },

  // ALL NOTES
  title:{
          type: String,
        },

  // BLANK AND LECTURE NOTES
  description: {
          type: String,
        },

  // TO DO LIST
  todos: [{
    type: String
  }],

  // MEETING NOTES
  meetingDate: {
    type: String,
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

  // SCHEDULER
  eventTitle: [{
    type: String,
  }],
  eventDescription: [{
      type: String,
    }],
  eventAllDay: [{
      type: Boolean,
    }],
  eventStart: [{
      type: Date,
      default: Date.now
  }],
  eventEnd: [{
    type: Date,
  }],
  eventAvailability: [{
    type: String,
    possibleValues: ['true', 'false']
  }],

  // DAILY REFLECTION
  dailyReflection: [{
    type: String,
  }],

  // MEAL PLANNER
  meal1: [{
    type: String
  }],
  meal2: [{
    type: String
  }],
  meal3: [{
    type: String
  }],
  startDate: {
    type: String //Date
  }
},
{
  timestamps: true
});

// MODEL COMPILATION
module.exports = mongoose.model("Note", NoteSchema);