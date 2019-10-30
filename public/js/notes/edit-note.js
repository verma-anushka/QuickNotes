(function($, window, document, undefined) {
    'use strict';

    // EDIT MEETING NOTES
    $('.btnDelete').click(function Delete(){
        var par = $(this).parent().parent(); //tr
        par.remove();
        });

    $(".meeting-edit").click(function() {
        var par = $(this).parent().parent(); //tr
        var tdName = par.children("td:nth-child(1)");
        var tdPhone = par.children("td:nth-child(2)");
        var tdEmail = par.children("td:nth-child(3)");
        
        tdName.html("<input type='text' id='txtName' value='"+tdName.html()+"'/>");
        tdPhone.html("<input type='text' id='txtPhone' value='"+tdPhone.html()+"'/>");
        tdEmail.html("<input type='text' id='txtEmail' value='"+tdEmail.html()+"'/>");
        
        $(".meeting-edit").bind("click", Edit);
        $(".btnDelete").bind("click", Delete);
    });

})(jQuery, window, document);