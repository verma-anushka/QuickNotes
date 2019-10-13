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
      $(this).toggleClass('completed');
  });
    
  $('.to-do-ul').on('click','.to-do-span',function(event){
      console.log("clicked ul 1");

      $(this).parent().fadeOut(1000,function(){
        $(this).remove();
      });
      event.stopPropagation();
  });
    
  $('.to-do-input').on('keypress',function(event){

        if(event.which == '13'){
          event.preventDefault();

          console.log("pressed enter");

          // var extratitles = $(this); 
          // var str = '';
          // for (var i = 0; i < extratitles.length; i++) { 
          //   str = str + '|' + extratitles.item(i).value;
          // }
          var input = $(this).val();

          // $('.to-do-ul').append('<input type="hidden"  name="note[title]"/>');
          // var input = '<input class="form-control to-do-input" type="text" name="note[title]" placeholder="Add Do List" autofocus></input>';
          $('.to-do-ul').append('<li class="to-do-li"><span class="to-do-span"><i class="fa fa-trash"></i></span> '+input+'</li>');
          
          console.log("input 1");
          console.log(input);
          $(this).append( input );
          console.log("input 2");
          console.log(this);
          var to_dos = $(this);

          console.log("to_dos");
          console.log(to_dos);

          var str = '';
          for(var i=0; i< to_dos.length; i++){
              console.log(typeof(to_dos));
              console.log(to_dos.key);
              console.log(to_dos.value);
              // str = str + '<br />' + to_dos.text();
          }

          console.log("string");
          console.log(str);

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
     
        // $(".btnSave").bind("click", Save);      
        $(".btnDelete").bind("click", Delete);
  });  


  $('.btnDelete').click(function Delete(){
    console.log("delete1");
    var par = $(this).parent().parent(); //tr
    par.remove();
  });
  
  function Delete(){
    console.log("delete2");
    var par = $(this).parent().parent(); //tr
    par.remove();
  }; 



  $(".blank").click(function() {
    // console.log("clicked");
    // $(".blank").css({"transform": "translate(500px, 10px) scaleX(10) scaleY(10)",
    //                   "cursor": "pointer",
    //                   "animation": "size-animation 3s forwards" 
    //                 });
    // $(".blank div").css({"transform": "rotate(180deg)"});
    $(".to-do-section").css({ "display": "none" });
    $(".lecture-section").css({ "display": "none" });
    $(".blank-section").css({"animation": "o 5s",
                              "display": "block"
                            });
  });

  $(".to-do").click(function() {
    $(".blank-section").css({ "display": "none" });
    $(".lecture-section").css({ "display": "none" });
    $(".to-do-section").css({"animation": "o 5s",
                              "display": "block"
                            });
  });
  $(".lecture").click(function() {
    $(".blank-section").css({ "display": "none" });
    $(".to-do-section").css({ "display": "none" });
    $(".lecture-section").css({"animation": "o 5s",
                              "display": "block"
                            });
  });
  $(".meeting").click(function() {
    $(".blank-section").css({ "display": "none" });
    $(".to-do-section").css({ "display": "none" });
    $(".lecture-section").css({ "display": "none" });
    $(".meeting-section").css({"animation": "o 5s",
                              "display": "block"
                            });
  });

  
});
