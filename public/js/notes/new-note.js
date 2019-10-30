$(document).ready(function(){

    // SIDEBAR START
    // HIDE SUBMENUS
    $('#body-row .collapse').collapse('hide'); 
          
    // COLLAPSE/EXPAND ICON
    $('#collapse-icon').addClass('fa-angle-double-right'); 
    
    // COLLAPSE CLICK
    $('[data-toggle=sidebar-colapse]').click(function() {
        SidebarCollapse();
    });
    
    function SidebarCollapse () {

        $('.menu-collapsed').toggleClass('d-none');
        $('.sidebar-submenu').toggleClass('d-none');
        $('.submenu-icon').toggleClass('d-none');
        $('#sidebar-container').toggleClass('sidebar-expanded sidebar-collapsed');

        // COLLAPSE/EXPAND ICON
        $('#collapse-icon').toggleClass('fa-angle-double-left fa-angle-double-right');
    }

    // SHOW/HIDE TEXT
    $('#collapse-container').click(function() {

      if ($('#sidebar-container').hasClass('sidebar-collapsed')){
        // console.log("hide");
        $('.note div').css('text-align','center');
        $('.new-note-dropdown').addClass('show-text');
      } else if ($('#sidebar-container').hasClass('sidebar-expanded')){
        // console.log("show");
        $('.new-note-dropdown').removeClass('show-text');
        $('.note div').css('text-align','left');
        $('.note div i').css('margin-left','10%');
        $('.note div span').css('margin-left','8%');
        $('.meeting i::before').css('font-size','18px');
        $('.daily-reflection i::before').css('font-size','18px');
        $('.meeting div span').css('margin-left','5%');
        $('.daily-reflection div span').css('margin-left','5%');
      }
    });
    // SIDEBAR END


    // TO-DO SECTION
    // STRIKETHROUGH COMPLETED TO-DO
    $('.to-do-ul').on('click','.to-do-li',function(){
      // if( $('.to-do-input').val() )
        $(this).toggleClass('completed');
    });
      
    // DELETE TO-DO
    $('.to-do-ul').on('click','.to-do-span',function(event){
        $(this).parent().fadeOut(1000,function(){
          $(this).remove();
        });
        event.stopPropagation();
    });
      
    // ADD NEW TO-DO
    $('.to-do-input').on('keypress',function(event){

      if(event.which == '13'){
        event.preventDefault();

        var input = $(this).val();
        $('.to-do-ul').append('<li class="to-do-li">' +
                              '<span class="to-do-span"><i class="fa fa-trash"></i></span> '+                      
                              '<input class="form-control to-dos" type="text" name="note[todos]" value="' + input + '" >' +
                              '</li>');
        // $('.to-do-ul').append('<span class="to-do-span"><i class="fa fa-trash"></i></span> '+                      
        //                       '<input class="form-control to-do-input" type="text" name="note[todos]" value="' + input + '" placeholder="Add Do List" >' );
        $(this).append( input );
        $(this).val('');
      }
    });

    $('.to-do-ul').on('keypress',function(event){
      if(event.which == '13'){
        event.preventDefault();
      }
      
    });

    // TOGGLE NEW INPUT AREA
    $('.fa-plus').click(function(){
      $('.to-do-input').fadeToggle(1000);
    });
    // TO-DO SECTION END


    // MEETING NOTES
    // APPEND NEW ROW (TABLE)
    $('#btnAdd').click(function(){
      $("#tblData tbody").append(
          "<tr>"+
          "<td><span class='btnDelete'><i class='fa fa-trash'></i></span><input type='text' name='note[meetingAction]' /></td>"+
          "<td><input type='text' name='note[meetingAssignee]' /></td>"+
          "<td><input type='text' name='note[meetingStatus]' /></td>"+
          "</tr>");
          $(".btnDelete").bind("click", Delete);
    });  

    // DELETE ROW
    $('.btnDelete').click(function Delete(){
      var par = $(this).parent().parent(); //tr
      par.remove();
    });
    
    function Delete(){
      var par = $(this).parent().parent(); //tr
      par.remove();
    }; 
    // MEETING NOTES END


    // ON-CLICK ANIMATIONS
    // BLANK
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
    // TO-DO
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
    // LECTURE
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
    // MEETING
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
    // SCHEDULER
    // $(".planner").click(function() {
    //   $(".blank-section").css({ "display": "none" });
    //   $(".to-do-section").css({ "display": "none" });
    //   $(".lecture-section").css({ "display": "none" });
    //   $(".meeting-section").css({ "display": "none" });
    //   $(".meal-planner-section").css({ "display": "none" });
    //   $(".daily-reflection-section").css({ "display": "none" });
    //   $(".planner-section").css({"animation": "o 5s",
    //                             "display": "block"
    //                           });
    // });
    // DAILY REFLECTION
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
    // MEAL PLANNER
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
    // ON-CLICK ANIMATIONS END


});
