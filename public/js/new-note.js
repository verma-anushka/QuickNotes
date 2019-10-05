$(document).ready(function(){

    // TO-DO
    $('.to-do-ul').on('click','.to-do-li',function(){
        $(this).toggleClass('completed');
      });
      
      $('.to-do-ul').on('click','.to-do-span',function(event){
        $(this).parent().fadeOut(1000,function(){
          $(this).remove();
        });
        event.stopPropagation();
      });
      
      $('.to-do-input').on('keypress',function(event){
            if(event.which == 13){
            var input = $(this).val();
            $('.to-do-ul').append('<li class="to-do-li"><span class="to-do-span"><i class="fa fa-trash"></i></span> '+input+'</li>')
            $(this).val('');
          }
      });
      
      $('.fa-plus').click(function(){
        $('.to-do-input').fadeToggle(1000);
      });
    

});
