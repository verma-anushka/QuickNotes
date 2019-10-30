(function($, window, document, undefined) {
    'use strict';

    // var type = ${note.type};

        // init cubeportfolio
        $('#grid-container').cubeportfolio({
            filters: '#filters-container',
            loadMore: '#loadMore-container',
            loadMoreAction: 'click',
            layoutMode: 'grid',
            mediaQueries: [{
                width: 1100,
                cols: 3
            }, {
                width: 800,
                cols: 3
            }, {
                width: 500,
                cols: 2
            }, {
                width: 320,
                cols: 1
            }],
            defaultFilter: '*',
            animationType: 'rotateSides',
            gapHorizontal: 0,
            gapVertical: 0,
            gridAdjustment: 'responsive',
            caption: 'minimal',
            displayType: 'sequentially',
            displayTypeSpeed: 100,
    
            // lightbox
            lightboxDelegate: '.cbp-lightbox',
            lightboxGallery: true,
            // lightboxTitleSrc: 'data-title',
            lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',
    
            // singlePageInline
            singlePageInlineDelegate: '.cbp-singlePageInline',
            singlePageInlinePosition: 'below',
            singlePageInlineInFocus: true,
            singlePageInlineCallback: function(url, element) {
                // to update singlePageInline content use the following method: this.updateSinglePageInline(yourContent)
                var t = this;

            },
        });


        $(".share").click(function(){
            //to get the content  
            var input = $(this).children("a").data("note");
            console.log( input );
            $('.note-id-input').html('');
            console.log( $('.note-id-input').val() );
            $('.note-id-input').append('<label for="noteid" class="sr-only">Note ID</label>' +     
                                       '<span class="input-group-addon"><i class="fas fa-id-card"></i></span>' +       
                                       '<input class="form-control" type="text" id="noteid" name="shareUser[noteid]" value="' + input + '" readonly="readonly">'
                                      );

            // alert(input);
        });
        // $('.noteShare').click(function(){
        //     console.log( $("a.noteShare") );
        //     var input = $("a.noteShare").data("note");
        //     $('.note-id-input').html('');
        //     console.log( $('.note-id-input').val() );
        //     $('.note-id-input').append('<label for="noteid" class="sr-only">Note ID</label>' +     
        //                                '<span class="input-group-addon"><i class="fa fa-user"></i></span>' +       
        //                                '<input class="form-control" type="text" id="noteid" name="shareUser[noteid]" value="' + input + '" >'
        //                               );
        // });

        $('.btnDelete').click(function Delete(){
            // console.log("delete1");
            var par = $(this).parent().parent(); //tr
            par.remove();
          });

        $(".meeting-edit").click(function() {
            var par = $(this).parent().parent(); //tr
            var tdName = par.children("td:nth-child(1)");
            var tdPhone = par.children("td:nth-child(2)");
            var tdEmail = par.children("td:nth-child(3)");
            // var tdButtons = par.children("td:nth-child(4)");
         
            tdName.html("<input type='text' id='txtName' value='"+tdName.html()+"'/>");
            tdPhone.html("<input type='text' id='txtPhone' value='"+tdPhone.html()+"'/>");
            tdEmail.html("<input type='text' id='txtEmail' value='"+tdEmail.html()+"'/>");
            // tdButtons.html("<img src='images/disk.png' class='btnSave'/>");
         
            // $(".btnSave").bind("click", Save);
            $(".meeting-edit").bind("click", Edit);
            $(".btnDelete").bind("click", Delete);
          });

    })(jQuery, window, document);