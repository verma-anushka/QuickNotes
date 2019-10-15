mobiscroll.settings = {
  lang: 'en',                                  // Specify language like: lang: 'pl' or omit setting to use default
  
  theme: 'ios'                                 // Specify theme like: theme: 'ios' or omit setting to use default
};

$(function () {

  var monthInst,
      dayInst,
      popupInst,
      dateInst,
      preventSet,
      now = new Date(),
      btn = '<a class="mbsc-btn mbsc-btn-outline mbsc-btn-danger md-delete-btn mbsc-ios">Delete</a>',
      myData = [
      //   {
      //     start: new Date(now.getFullYear(), now.getMonth(), 8, 13),
      //     end: new Date(now.getFullYear(), now.getMonth(), 8, 13, 30),
      //     text: 'Lunch @ Butcher\'s' + btn,
      //     color: '#26c57d'
      // }, {
      //     start: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15),
      //     end: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16),
      //     text: 'General orientation' + btn,
      //     color: '#fd966a'
      // }, {
      //     start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 18),
      //     end: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 22),
      //     text: 'Dexter BD' + btn,
      //     color: '#37bbe4'
      // }, {
      //     start: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 30),
      //     end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 30),
      //     text: 'Stakeholder mtg.' + btn,
      //     color: '#d00f0f'
      // }
    ];

  function navigate(inst, val) {
      if (inst) {
          inst.navigate(val);
      }
  }

  dateInst = $('#eventDate').mobiscroll().range({
      
      controls: ['date', 'time'],
      dateWheels: '|D M d|',
      endInput: '#endInput',
      tabs: false,
      responsive: {
          large: {
              touchUi: false
          }
      },
      showSelector: false,
      cssClass: 'md-add-event-range'
  }).mobiscroll('getInst');

  dayInst = $('#demo-add-event-day').mobiscroll().eventcalendar({
      display: 'inline',                       // Specify display mode like: display: 'bottom' or omit setting to use default
      view: {                                  // More info about view: https://docs.mobiscroll.com/4-8-3/eventcalendar#opt-view
          eventList: { type: 'day' }
      },
      data: myData,                            // More info about data: https://docs.mobiscroll.com/4-8-3/eventcalendar#opt-data
      onPageChange: function (event, inst) {   // More info about onPageChange: https://docs.mobiscroll.com/4-8-3/eventcalendar#event-onPageChange
          var day = event.firstDay;
          preventSet = true;
          navigate(monthInst, day);
          dateInst.setVal([day, new Date(day.getFullYear(), day.getMonth(), day.getDate(), day.getHours() + 2)], true);
      },
      onEventSelect: function (event, inst) {
            // More info about onEventSelect: https://docs.mobiscroll.com/4-8-3/eventcalendar#event-onEventSelect

        // event.preventdefault();
        if ($(event.domEvent.target).hasClass('md-delete-btn')) {
            mobiscroll.confirm({ 
                  
                  title: 'Confirm Deletion',
                  message: 'Are you sure you want to delete this item?',
                  okText: 'Delete',
                  callback: function (res) {
                      if (res) {
                          inst.removeEvent([event.event._id]);
                          monthInst.removeEvent([event.event._id]);
                          mobiscroll.toast({ 
                              
                              message: 'Deleted'
                          });
                      }
                  }
              });
          }
      }
  }).mobiscroll('getInst');

  monthInst = $('#demo-add-event-month').mobiscroll().eventcalendar({
      display: 'inline',                       // Specify display mode like: display: 'bottom' or omit setting to use default
      view: {                                  // More info about view: https://docs.mobiscroll.com/4-8-3/eventcalendar#opt-view
          calendar: { type: 'month' }
      },
      data: myData,                            // More info about data: https://docs.mobiscroll.com/4-8-3/eventcalendar#opt-data
      onSetDate: function (event, inst) {      // More info about onSetDate: https://docs.mobiscroll.com/4-8-3/eventcalendar#event-onSetDate
          if (!preventSet) {
              var day = event.date;
              navigate(dayInst, day);
              dateInst.setVal([day, new Date(day.getFullYear(), day.getMonth(), day.getDate(), day.getHours() + 2)], true);
          }
          preventSet = false;
      }
  }).mobiscroll('getInst');

  $('#allDay').on('change', function () {
      var allDay = this.checked;

      dateInst.option({
          controls: allDay ? ['date'] : ['date', 'time'],
          dateWheels: (allDay ? 'MM dd yy' : '|D M d|')
      });
  });

  popupInst = $('#demo-add-event-popup').mobiscroll().popup({
      display: 'center',                       // Specify display mode like: display: 'bottom' or omit setting to use default
      cssClass: 'mbsc-no-padding',
      buttons: [{                              // More info about buttons: https://docs.mobiscroll.com/4-8-3/eventcalendar#opt-buttons
              text: 'Add event',
              handler: 'set'
          },
          'cancel'
      ],
    //   headerText: 'Add new event',             // More info about headerText: https://docs.mobiscroll.com/4-8-3/eventcalendar#opt-headerText
      onSet: function (event, inst) {
          var eventDates = dateInst.getVal(),
              events = {
                  start: eventDates[0],
                  end: eventDates[1],
                  text: ($('#eventText').val() || 'New Event') + btn,
                  title: $('#eventText').val() || 'New Event',
                  description: $('#eventDesc').val(),
                  allDay: $('#allDay').prop('checked'),
                  free: $('input[name=free]:checked').val() == 'true'
              };
          monthInst.addEvent(events);
          dayInst.addEvent(events);
          $('#eventText').val('');
          $('#eventDesc').val('');
          // Navigate the calendar to the new event's start date
          monthInst.navigate(eventDates[0], true);
      }
  }).mobiscroll('getInst');

  $('#showAddEventPopup').click(function () {
      popupInst.show();
  });


//   $(function() {
//     // By default deny the submit
//     var allowSubmit = false;

//     $(".planner-form").on("submit", function(event) {

//         if (!allowSubmit) {
//             event.preventDefault();

//             // Your code logic in here (maybe form validation or something)
//             // Then you set allowSubmit to true so this code is bypassed
//             console.log("save!");

//             allowSubmit = true;
//         }

//     });
// });
//   $('.planner-btn').click(function () {
//       console.log("save!");
//     // popupInst.show();
// });

});