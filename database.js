var mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/notes", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost:27017/notes", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(db => console.log('DataBase connected'))
  .catch(err => console.error(err));