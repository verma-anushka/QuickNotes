(function($, window, document, undefined) {
    'use strict';

        // DISPLAY USER NOTES
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
    
            // LIGHTBOX
            lightboxDelegate: '.cbp-lightbox',
            lightboxGallery: true,
            // lightboxTitleSrc: 'data-title',
            lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',
    
            // SINGLE PAGE INLINE
            singlePageInlineDelegate: '.cbp-singlePageInline',
            singlePageInlinePosition: 'below',
            singlePageInlineInFocus: true,
            // singlePageInlineCallback: function(url, element) {
            //     // to update singlePageInline content use the following method: this.updateSinglePageInline(yourContent)
            //     var t = this;
            // },
        });

        // SHARE NOTES - NOTE-ID
        $(".share").click(function(){
            
            var input = $(this).children("a").data("note");
            console.log( input );
            $('.note-id-input').html('');
            console.log( $('.note-id-input').val() );
            $('.note-id-input').append('<label for="noteid" class="sr-only">Note ID</label>' +     
                                       '<span class="input-group-addon"><i class="fas fa-id-card"></i></span>' +       
                                       '<input class="form-control" type="text" id="noteid" name="shareUser[noteid]" value="' + input + '" readonly="readonly">'
                                      );
        });

    })(jQuery, window, document);