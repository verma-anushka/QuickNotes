console.firebug=true;

$(document).ready(function(){
  console.log("clicked vhvc vhvh");

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

// $.each(top_brands, function(brand) {
//   $brand_options.append(
//     $("<option />").val(brand.key).text(brand.key + " " + brand.value)
//   );
// });

            console.log("string");
            console.log(str);

            $(this).val('');
          }
    });
      
      $('.fa-plus').click(function(){
        $('.to-do-input').fadeToggle(1000);
      });
    

});
