// PACKAGES
var express                = require("express"),
    router                 = express.Router({mergeParams: true});
    passport               = require("passport"),
    sgMail                 = require('@sendgrid/mail');
    db                     = require('../database'),
    User                   = require("../models/user"),
    Note                   = require("../models/notes");
    middleware             = require("../middleware");

// NOTES SHARE 
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// NOTES HOMEPAGE
router.get("/:id/notes", middleware.isAuthenticated, async function(req, res){

    User.findById(req.params.id, function(error, user){
        if(error){
            console.log(error);
            req.flash("error", "Something went wrong! User not found!" );
            res.redirect("back");
        }else{
            Note.find(req.params.note_id, function(error, allNotes){
                if(error){
                    console.log(error);
                    req.flash("error", "Something went wrong! Notes not found!" );
                    res.redirect("back");
                }else{
                    res.render("note/all-notes", {user: user, notes: allNotes});
                }
            });
        }
    });
});

// SHARE NOTES
router.get("/:id/notes/share", function(req, res){
    var shareUser = req.query.shareUser;
    if(shareUser){
        Note.findById(req.query.shareUser.noteid, function(error, note){
            if(error){
                console.log(error);
                req.flash("error", "Something went wrong! Note not found" );                
                return res.redirect("back");
            }else{
                var msgToReciever = {};
                var msgToUser = {};
                if(note.type === 'blank' || note.type === 'lecture'){
                    msgToReciever = {
                        to:     shareUser.receiverEmail,
                        // to: 	'anushkarvp1999@gmail.com',
                        from: 	'v.anushka786@gmail.com',
                        subject:'Notes from QuickNotes!',
                        html: 	'Hi, ' + shareUser.receiverName + '!' +
                                '<br>'	+ 
                                note.author.username + ' just shared their notes with you!' + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' + 
                                '<h3>' + note.title + '</h3>' + 
                                '<p>' + note.description + '</p>' + 
                                '<br>'	+ 
                                '<br>'	+ 
                                '<p>Join QuickNotes today to enjoy making notes for free!'
                    };
                    msgToUser = {
                        to: 	 'v.anushka786@gmail.com',
                        from: 	 'QuickNotes@gmail.com',
                        subject: 'Notes shared with ' + shareUser.receiverName,
                        html: 	'Hi, ' + note.author.username +
                                '<br>'	+ 
                                'Your notes have been shared with ' + shareUser.receiverName + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' +
                                '<h3>' + note.title + '</h3>' + 
                                '<p>' + note.description + '</p>' + 
                                '<br>'	+ 
                                '<br>'	+ 
                                shareUser.receiverMsg +
                                '<p>Keep using QuickNotes!' 
                    };
                }else if(note.type === 'to-do'){
                    var todoList = '';
                    note.todos.forEach(function(todo){ 
                        todoList = todoList + todo;
                        todoList = todoList + '<br />';
                    });
                    msgToReciever = {
                        to:     shareUser.receiverEmail,
                        // to: 	 'anushkarvp1999@gmail.com',
                        from: 	 'v.anushka786@gmail.com',
                        subject: 'Notes from QuickNotes!',
                        html: 	'Hi, ' + shareUser.receiverName + '!' +
                                '<br>'	+ 
                                note.author.username + ' just shared their notes with you!' + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' + 
                                '<h3>' + note.title + '</h3>' + 
                                '<p>' + todoList + '</p>' +
                                '<br>'	+ 
                                '<br>'	+ 
                                shareUser.receiverMsg +
                                '<p>Join QuickNotes today to enjoy making notes for free!'
                    };
                    msgToUser = {
                        to: 	 'v.anushka786@gmail.com',
                        from: 	 'QuickNotes@gmail.com',
                        subject: 'Notes shared with ' + shareUser.receiverName,
                        html: 	'Hi, ' + note.author.username +
                                '<br>'	+ 
                                'Your notes have been shared with ' + shareUser.receiverName + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' +
                                '<h3>' + note.title + '</h3>' + 
                                '<p>' + todoList + '</p>' +
                                '<br>'	+ 
                                '<br>'	+ 
                                shareUser.receiverMsg +
                                '<p>Keep using QuickNotes!</p>' 
                    };
                }else if(note.type === 'meeting'){
                    msgToReciever = {
                        to:     shareUser.receiverEmail,
                        // to: 	 'anushkarvp1999@gmail.com',
                        from: 	 'v.anushka786@gmail.com',
                        subject: 'Notes from QuickNotes!',
                        html: 	'Hi, ' + shareUser.receiverName + '!' +
                                '<br>'	+ 
                                note.author.username + ' just shared their notes with you!' + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' + 
                                '<h3>' + note.title + '</h3>' + 
                                '<p>Date & Time: ' + note.meetingDate + '</p>' +
                                '<p>Agenda: ' + note.meetingAgenda + '</p>' +
                                '<p>Attendees: ' + note.meetingAttendees + '</p>' +
                                '<br>'	+ 
                                '<br>'	+ 
                                shareUser.receiverMsg +
                                '<p>Join QuickNotes today to enjoy making notes for free!'
                    };
                    msgToUser = {
                        to: 	 'v.anushka786@gmail.com',
                        from: 	 'QuickNotes@gmail.com',
                        subject: 'Notes shared with ' + shareUser.receiverName,
                        html: 	'Hi, ' + note.author.username +
                                '<br>'	+ 
                                'Your notes have been shared with ' + shareUser.receiverName + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' +
                                '<h3>' + note.title + '</h3>' + 
                                '<p>Date & Time: ' + note.meetingDate + '</p>' +
                                '<p>Agenda: ' + note.meetingAgenda + '</p>' +
                                '<p>Attendees: ' + note.meetingAttendees + '</p>' +
                                '<br>'	+ 
                                '<br>'	+ 
                                shareUser.receiverMsg +
                                '<p>Keep using QuickNotes!' 
                    };
                }else if(note.type === 'daily-reflection'){
                    msgToReciever = {
                        to:     shareUser.receiverEmail,
                        // to: 	 'anushkarvp1999@gmail.com',
                        from: 	 'v.anushka786@gmail.com',
                        subject: 'Notes from QuickNotes!',
                        html: 	'Hi, ' + shareUser.receiverName + '!' +
                                '<br>'	+ 
                                note.author.username + ' just shared their notes with you!' + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' + 
                                '<h3>' + note.title + '</h3>' + 
                                '<h4>' + note.startDate + '</h4>' + 
                                '<h4>What went well today?!</h4>' +
                                '<p>' + note.dailyReflection[0] + '</p>' +
                                "<h4>What didn't go as planned?!</h4>" +
                                '<p>' + note.dailyReflection[1] + '</p>' +
                                '<h4>What can be improved upon?!</h4>' +
                                '<p>' + note.dailyReflection[2] + '</p>' +
                                "<h4>What's on your mind?!</h4>" +
                                '<p>' + note.dailyReflection[3] + '</p>' +
                                '<br>'	+ 
                                '<br>'	+ 
                                shareUser.receiverMsg +
                                '<p>Join QuickNotes today to enjoy making notes for free!'
                    };
                    msgToUser = {
                        to: 	 'v.anushka786@gmail.com',
                        from: 	 'QuickNotes@gmail.com',
                        subject: 'Notes shared with ' + shareUser.receiverName,
                        html: 	'Hi, ' + note.author.username +
                                '<br>'	+ 
                                'Your notes have been shared with ' + shareUser.receiverName + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' +
                                '<h3>' + note.title + '</h3>' + 
                                '<h4>' + note.startDate + '</h4>' + 
                                '<h4>What went well today?!</h4>' +
                                '<p>' + note.dailyReflection[0] + '</p>' +
                                "<h4>What didn't go as planned?!</h4>" +
                                '<p>' + note.dailyReflection[1] + '</p>' +
                                '<h4>What can be improved upon?!</h4>' +
                                '<p>' + note.dailyReflection[2] + '</p>' +
                                "<h4>What's on your mind?!</h4>" +
                                '<p>' + note.dailyReflection[3] + '</p>' +
                                '<br>'	+ 
                                '<br>'	+ 
                                shareUser.receiverMsg +
                                '<p>Keep using QuickNotes!' 
                    };
                }else if(note.type === 'meal-planner'){
                    msgToReciever = {
                        to:     shareUser.receiverEmail,
                        // to: 	 'anushkarvp1999@gmail.com',
                        from: 	 'v.anushka786@gmail.com',
                        subject: 'Notes from QuickNotes!',
                        html: 	'Hi, ' + shareUser.receiverName + '!' +
                                '<br>'	+ 
                                note.author.username + ' just shared their notes with you!' + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' + 
                                '<h3>' + note.title + '</h3>' + 
                                '<h4>' + note.startDate + '</h4>' + 
                                '<table id="tblData">' +          
                                    '<thead>' +
                                        '<tr>' +
                                            '<th></th>' +
                                            '<th>Breakfast</th>' +
                                            '<th>Lunch</th>' + 
                                            '<th>Dinner</th>' +
                                       ' </tr>' +
                                    '</thead>' +
                                    '<tbody>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Sunday</strong></td>' +
                                            '<td>' + note.meal1[0] + '</td>' +
                                            '<td>' + note.meal2[0] + '</td>' +
                                            '<td>' + note.meal3[0] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Monday</strong></td>' +
                                            '<td>' + note.meal1[1] + '</td>' +
                                            '<td>' + note.meal2[1] + '</td>' +
                                            '<td>' + note.meal3[1] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Tuesday</strong></td>' +
                                            '<td>' + note.meal1[2] + '</td>' +
                                            '<td>' + note.meal2[2] + '</td>' +
                                            '<td>' + note.meal3[2] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Wednesday</strong></td>' +
                                            '<td>' + note.meal1[3] + '</td>' +
                                            '<td>' + note.meal2[3] + '</td>' +
                                            '<td>' + note.meal3[3] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Thursday</strong></td>' +
                                            '<td>' + note.meal1[4] + '</td>' +
                                            '<td>' + note.meal2[4] + '</td>' +
                                            '<td>' + note.meal3[4] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Friday</strong></td>' +
                                            '<td>' + note.meal1[5] + '</td>' +
                                            '<td>' + note.meal2[5] + '</td>' +
                                            '<td>' + note.meal3[5] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Saturday</strong></td>' +
                                            '<td>' + note.meal1[6] + '</td>' +
                                            '<td>' + note.meal2[6] + '</td>' +
                                            '<td>' + note.meal3[6] + '</td>' +
                                        '</tr>' +
                                    '</tbody>' +
                                '</table>' +
                                '<br>'	+ 
                                '<br>'	+ 
                                shareUser.receiverMsg +
                                '<p>Join QuickNotes today to enjoy making notes for free!'
                    };
                    msgToUser = {
                        to: 	 'v.anushka786@gmail.com',
                        from: 	 'QuickNotes@gmail.com',
                        subject: 'Notes shared with ' + shareUser.receiverName,
                        html: 	'Hi, ' + note.author.username +
                                '<br>'	+ 
                                'Your notes have been shared with ' + shareUser.receiverName + 
                                '<br>'	+ 
                                '<h4>Notes Details!</h4>' +
                                '<h3>' + note.title + '</h3>' + 
                                '<h4>' + note.startDate + '</h4>' + 
                                '<table id="tblData">' +          
                                    '<thead>' +
                                        '<tr>' +
                                            '<th></th>' +
                                            '<th>Breakfast</th>' +
                                            '<th>Lunch</th>' + 
                                            '<th>Dinner</th>' +
                                       ' </tr>' +
                                    '</thead>' +
                                    '<tbody>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Sunday</strong></td>' +
                                            '<td>' + note.meal1[0] + '</td>' +
                                            '<td>' + note.meal2[0] + '</td>' +
                                            '<td>' + note.meal3[0] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Monday</strong></td>' +
                                            '<td>' + note.meal1[1] + '</td>' +
                                            '<td>' + note.meal2[1] + '</td>' +
                                            '<td>' + note.meal3[1] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Tuesday</strong></td>' +
                                            '<td>' + note.meal1[2] + '</td>' +
                                            '<td>' + note.meal2[2] + '</td>' +
                                            '<td>' + note.meal3[2] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Wednesday</strong></td>' +
                                            '<td>' + note.meal1[3] + '</td>' +
                                            '<td>' + note.meal2[3] + '</td>' +
                                            '<td>' + note.meal3[3] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Thursday</strong></td>' +
                                            '<td>' + note.meal1[4] + '</td>' +
                                            '<td>' + note.meal2[4] + '</td>' +
                                            '<td>' + note.meal3[4] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Friday</strong></td>' +
                                            '<td>' + note.meal1[5] + '</td>' +
                                            '<td>' + note.meal2[5] + '</td>' +
                                            '<td>' + note.meal3[5] + '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td class="day"><strong>Saturday</strong></td>' +
                                            '<td>' + note.meal1[6] + '</td>' +
                                            '<td>' + note.meal2[6] + '</td>' +
                                            '<td>' + note.meal3[6] + '</td>' +
                                        '</tr>' +
                                    '</tbody>' +
                                '</table>' +
                                '<br>'	+ 
                                '<br>'	+ 
                                shareUser.receiverMsg +
                                '<p>Keep using QuickNotes!' 
                    };
                }
                sgMail.send(msgToReciever, (error, result) =>{
                    if (error) {
                        console.log(error);
                        req.flash("error", "Email not sent!" ); 
                        res.redirect("back");
                    }
                    else {
                        sgMail.send(msgToUser, (error, result) =>{
                            if (error) {
                                console.log(error);
                                req.flash("error", "Email not sent!" );                
                                res.redirect("back");
                            }
                            else {
                                req.flash("success", "Email Sent!" );    
                                return res.redirect('/' + req.params.id + '/notes');
                            };	
                        });
                    }
                });
            }
        });
     }
});
    
// ADD NEW NOTE
router.get("/:id/notes/new", middleware.isAuthenticated, function(req, res){

    User.findById(req.params.id, function(error, user){
        if(error){
            console.log(error);
            req.flash("error", "Something went wrong! User not found!" );
            res.redirect("back");
        }else{
            Note.find({}, function(error, note){
                if(error){
                    console.log(error);
                    req.flash("error", "Something went wrong! Notes not found!" );
                    res.redirect("back");
                }else{
                    res.render("note/new", {user: user, note: note});
                }
            });
        }
    });
});

router.post("/:id/notes", middleware.isAuthenticated, function(req,res){

    User.findById(req.params.id, function(error, user){
        if(error){            
            console.log(error);
            req.flash("error", "Something went wrong! User not found!" );
            return res.redirect("back");
        }else{           
            Note.create(req.body.note, function(error, note){
                if(error){
                    console.log(error);
                    req.flash("error", "Something went wrong! Notes not found!" );
                    return res.redirect("back");
                }else{
                    note.author.id = req.user._id;
                    note.author.username = req.user.username;
                    note.save();
                    user.notes.push(note);
                    user.save();
                    req.flash("success", "Successfully added note!" );
                    res.redirect("/" + req.params.id + "/notes" );
                }
            });
        }
    });
});

// EDIT
router.get("/:id/notes/:note_id/edit", middleware.isAuthenticated, function(req, res){

    Note.findById(req.params.note_id, function(error, foundNote){
        if(error){
            console.log(error);
            req.flash("error", "Something went wrong! Notes not found!" );
            res.redirect("back");
        }else{
            res.render("note/edit", {user_id: req.params.id, note: foundNote}); 
        }
    });
   
});

// UPDATE
router.put("/:id/notes/:note_id", middleware.isAuthenticated, function(req, res){

    // req.body.blog.body = req.sanitize(req.body.blog.body);
    Note.findByIdAndUpdate(req.params.note_id, req.body.note, function(error, updatedNote){
        if(error){
            console.log(error);
            req.flash("error", "Something went wrong! Notes not found!" );
            res.redirect("back");
        }else{
            req.flash("success", "Successfully updated note!" );
            res.redirect("/" + req.params.id + "/notes/" );
        }
    });    
});

// DESTROY
router.delete("/:id/notes/:note_id", middleware.isAuthenticated, function(req, res){

    User.findById(req.params.id, function(error, user){
        if(error){
            console.log(error);
            req.flash("error", "Something went wrong! User not found!" );
            return res.redirect("back");
        }else{
            Note.findByIdAndRemove(req.params.note_id, function(error){
                if(error){
                    console.log(error);
                    req.flash("error", "Something went wrong! Notes not found!" );
                    res.redirect("back");
                }else{
                    req.flash("success", "Note deleted!" );
                    res.redirect("/" + req.params.id + "/notes/" );
                }
            });
        }
    });
});

module.exports = router;