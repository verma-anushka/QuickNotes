// var mongoose = require("mongoose");

// // // DATABASE
// // // mongoose.set('useFindAndModify', false);
// // var url=process.env.DATABASEURL || "mongodb://localhost:27017/notes";
// // mongoose.connect(url, { 
// //                         useCreateIndex: true,
// //                         useNewUrlParser: true,
// //                         useUnifiedTopology: true
// //                      })
// //         .then(() => console.log(`Database connected`))
// //         .catch(err => console.log(`Database connection error: ${err.message}`));
// mongoose.set('useFindAndModify', false);
// mongoose.connect("mongodb://localhost:27017/notes", {
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
//   .then(db => console.log('DataBase connected'))
//   .catch(err => console.error("error:" + err));