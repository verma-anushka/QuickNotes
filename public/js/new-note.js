$(document).ready(function(){

  // Hide submenus
  $('#body-row .collapse').collapse('hide'); 
        
  // Collapse/Expand icon
  $('#collapse-icon').addClass('fa-angle-double-left'); 
  
  // Collapse click
  $('[data-toggle=sidebar-colapse]').click(function() {
      SidebarCollapse();
  });
  
  function SidebarCollapse () {
      $('.menu-collapsed').toggleClass('d-none');
      $('.sidebar-submenu').toggleClass('d-none');
      $('.submenu-icon').toggleClass('d-none');
      $('#sidebar-container').toggleClass('sidebar-expanded sidebar-collapsed');
      
      // Collapse/Expand icon
      $('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');
  }

  $('#collapse-container').click(function() {

    if ($('#sidebar-container').hasClass('sidebar-collapsed')){
      $('.new-note-dropdown').addClass('show-text');
    } else if ($('#sidebar-container').hasClass('sidebar-expanded')){
      $('.new-note-dropdown').removeClass('show-text');
    }
  });

  // TO-DO
  $('.to-do-ul').on('click','.to-do-li',function(){
    // if( $('.to-do-input').val() )
      $(this).toggleClass('completed');
  });
    
  $('.to-do-ul').on('click','.to-do-span',function(event){

      $(this).parent().fadeOut(1000,function(){
        $(this).remove();
      });
      event.stopPropagation();
  });
    
  $('.to-do-input').on('keypress',function(event){

    if(event.which == '13'){
      event.preventDefault();

      var input = $(this).val();
      $('.to-do-ul').append('<li class="to-do-li">' +
                            '<span class="to-do-span"><i class="fa fa-trash"></i></span> '+                      
                            '<input class="form-control to-do-input" type="text" name="note[todos]" value="' + input + '" placeholder="Add Do List" >' +
                            '</li>');
      // $('.to-do-ul').append('<span class="to-do-span"><i class="fa fa-trash"></i></span> '+                      
      //                       '<input class="form-control to-do-input" type="text" name="note[todos]" value="' + input + '" placeholder="Add Do List" >' );

      $(this).append( input );
      $(this).val('');
    }
  });

  $('.fa-plus').click(function(){
    $('.to-do-input').fadeToggle(1000);
  });

  // MEETING NOTES
  $('#btnAdd').click(function(){
    $("#tblData tbody").append(
        "<tr>"+
        "<td><span class='btnDelete'><i class='fa fa-trash'></i></span><input type='text' name='note[meetingAction]' /></td>"+
        "<td><input type='text' name='note[meetingAssignee]' /></td>"+
        "<td><input type='text' name='note[meetingStatus]' /></td>"+
        "</tr>");
        $(".btnDelete").bind("click", Delete);
  });  

  $('.btnDelete').click(function Delete(){
    var par = $(this).parent().parent(); //tr
    par.remove();
  });
  
  function Delete(){
    var par = $(this).parent().parent(); //tr
    par.remove();
  }; 

  // ON-CLICK ANIMATIONS
  $(".blank").click(function() {
    $(".to-do-section").css({ "display": "none" });
    $(".lecture-section").css({ "display": "none" });
    $(".meeting-section").css({ "display": "none" });
    $(".planner-section").css({ "display": "none" });
    $(".meal-planner-section").css({ "display": "none" });
    $(".daily-reflection-section").css({ "display": "none" });  
    $(".blank-section").css({"animation": "o 5s",
                              "display": "block"
                            });
  });
  $(".to-do").click(function() {
    $(".blank-section").css({ "display": "none" });
    $(".lecture-section").css({ "display": "none" });
    $(".meeting-section").css({ "display": "none" });
    $(".planner-section").css({ "display": "none" });
    $(".meal-planner-section").css({ "display": "none" });
    $(".daily-reflection-section").css({ "display": "none" });
    $(".to-do-section").css({"animation": "o 5s",
                              "display": "block"
                            });
  });
  $(".lecture").click(function() {
    $(".blank-section").css({ "display": "none" });
    $(".to-do-section").css({ "display": "none" });
    $(".meeting-section").css({ "display": "none" });
    $(".planner-section").css({ "display": "none" });
    $(".meal-planner-section").css({ "display": "none" });
    $(".daily-reflection-section").css({ "display": "none" });
    $(".lecture-section").css({"animation": "o 5s",
                              "display": "block"
                            });
  });
  $(".meeting").click(function() {
    $(".blank-section").css({ "display": "none" });
    $(".to-do-section").css({ "display": "none" });
    $(".lecture-section").css({ "display": "none" });
    $(".planner-section").css({ "display": "none" });
    $(".meal-planner-section").css({ "display": "none" });
    $(".daily-reflection-section").css({ "display": "none" });
    $(".meeting-section").css({"animation": "o 5s",
                              "display": "block"
                            });
  });
  $(".planner").click(function() {
    $(".blank-section").css({ "display": "none" });
    $(".to-do-section").css({ "display": "none" });
    $(".lecture-section").css({ "display": "none" });
    $(".meeting-section").css({ "display": "none" });
    $(".meal-planner-section").css({ "display": "none" });
    $(".daily-reflection-section").css({ "display": "none" });
    $(".planner-section").css({"animation": "o 5s",
                              "display": "block"
                            });
  });
  $(".daily-reflection").click(function() {
    $(".blank-section").css({ "display": "none" });
    $(".to-do-section").css({ "display": "none" });
    $(".lecture-section").css({ "display": "none" });
    $(".meeting-section").css({ "display": "none" });
    $(".planner-section").css({ "display": "none" });
    $(".meal-planner-section").css({ "display": "none" });
    $(".daily-reflection-section").css({"animation": "o 5s",
                              "display": "block"
                            });
  });
  $(".meal-planner").click(function() {
    $(".blank-section").css({ "display": "none" });
    $(".to-do-section").css({ "display": "none" });
    $(".lecture-section").css({ "display": "none" });
    $(".meeting-section").css({ "display": "none" });
    $(".planner-section").css({ "display": "none" });
    $(".daily-reflection-section").css({ "display": "none" });
    $(".meal-planner-section").css({"animation": "o 5s",
                              "display": "block"
                            });
  });

});
