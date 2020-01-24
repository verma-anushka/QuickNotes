var mongoose = require("mongoose");

// DATABASE SETTINGS
var url= "mongodb://localhost:27017/notes";
mongoose.connect(url, { useCreateIndex: true,
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                     })
        .then(() => console.log(`Database connected`))
        .catch(err => console.log(`Database connection error: ${err.message}`));

        