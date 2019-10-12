$(document).ready(function(){
    $('input[type="file"]').change(function(e){
        var fileName = e.target.files[0].name;
        if( fileName ){
            $('span#filename').text(fileName);
            console.log( $('span#filename').text());
            // alert(fileName);
        }else{
            $('span#filename').text("Choose a file...");
        }  
    });

    // $(function() {
    //     var temp="a"; 
    //     $("#MySelect").val(temp);
    // });
});
