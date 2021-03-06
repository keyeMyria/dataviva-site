var inputThumbCallback = function() {
    $('#thumb-img').hide();
    $('.thumb-buttons').hide();

    $('#thumb-preview').show();
    $('.crop-buttons').show();
    $('.thumb-crop').show();

    $($('#thumb-crop')).cropper({
        aspectRatio: 350/227,
        preview: '#thumb-preview',
        viewMode: 3
    });
}

var add_caption = function(image) {
    if (image.attr('src').trim() == "http://placehold.it/1600x900/FFFFFF?text=")
        return;
    image.wrap('<figure> </figure>');
    figcaption = $('<figcaption> </figcaption>');
    if (image.attr('data-original-title'))
        figcaption.html(image.attr('data-original-title'));
    figcaption.appendTo(image.parent());

    var image_float = image.css('float'),
        image_width = image.css('width');

    if (image_float == 'left' || image_float == 'right') {
        image
            .css('float', 'none')
            .parent().css('float', image_float);
    }
    image.parent().css('max-width', image_width);
    image.css('width', '100%');
    image.css('height', 'auto');
}

var remove_caption = function(image) {
    if (image.attr('src').trim() == "http://placehold.it/1600x900/FFFFFF?text=")
        return;
    image.siblings('figcaption').remove();
    var figure_width = image.parent().css('max-width');
    image.css('width', figure_width);
    var figure_float = image.parent().css('float');
    if (figure_float == 'left' || figure_float == 'right')
        image.css('float', figure_float);
    image.unwrap();
}

var load_tooltips = function() {
    $('[data-toggle="tooltip"]').each(function() {
        var image_title = $(this).attr('title');
        $(this).attr('title', '');
        $(this).tooltip();
        $(this).attr('title', image_title);
    });
}

$(document).ready(function(){
    select2Config.placeholder = 'Separe as palavras-chave por vírgula';
    $('#subject').select2(select2Config);

    $('#subject').on('select2:select', function(e) {
        var elm = e.params.data.element;
        $elm = $(elm);
        $t = $(this);
        $t.append($elm);
        $t.trigger('change.select2');
    });

    $('#blog-edit').prop('disabled', true);

    $('#text-content-editor').append($('#text_content').val());

    $('#text-content-editor img').each(function() {
        if ($(this).parent().is('figure'))
                remove_caption($(this));
    });

    $('#text-content-editor').summernote(summernoteConfig);

    $('#blog-edit').click(function() {
        var editor = $('#text-content-editor');
        $('#blog-preview').prop('disabled', false);
        $('#blog-edit').prop('disabled', true);
        summernoteConfig['focus'] = true;
        editor.find('img').each(function() {
            if ($(this).parent().is('figure'))
                remove_caption($(this));
        });
        editor.summernote(summernoteConfig);
        load_tooltips();
    });

    $('#blog-preview').click(function() {
        var editor = $('#text-content-editor');
        $('#blog-preview').prop('disabled', true);
        $('#blog-edit').prop('disabled', false);
        editor.summernote('destroy');
        editor.find('img').each(function() {
            add_caption($(this));
        });
        var aHTML = editor.html();
        $('text_content').val(aHTML);
    });

    cropInput($('#thumb-crop'), $('#thumb-input'), inputThumbCallback)

    $('#thumb-zoomIn').click(function() {
        $('#thumb-crop').cropper('zoom', 0.1);
    });
    $('#thumb-zoomOut').click(function() {
        $('#thumb-crop').cropper('zoom', -0.1);
    });
    $('#thumb-rotateLeft').click(function() {
        $('#thumb-crop').cropper('rotate', 45);
    });
    $('#thumb-rotateRight').click(function() {
        $('#thumb-crop').cropper('rotate', -45);
    });
    $('#thumb-save').click(function() {
        var thumbDataURL = $('#thumb-crop').cropper('getDataURL');
        $('#thumb').val(thumbDataURL);
        $('#thumb-img').attr('src', thumbDataURL);

        $('#thumb-img').show();
        $('.thumb-buttons').show();

        $('#thumb-preview').hide();
        $('.crop-buttons').hide();
        $('.thumb-crop').hide();

        $('#thumb-crop').cropper('destroy');
        $('#thumb-crop').attr('src', '');
    });

    $('#publish-date').datepicker({
        format: "dd/mm/yyyy",
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true
    });

    var text_max = 500;
    $('[name=textarea-feedback]').html(text_max + ' ' + dataviva.dictionary['characters_left']);

    $('#text_call').keyup(function() {
        var text_length = $(this).val().length;
        var text_remaining = text_max - text_length;
        $(this).siblings('[name=textarea-feedback]').html(text_remaining + ' ' + dataviva.dictionary['characters_left']);
    });

    load_tooltips();

    $('#blog-form').submit(function() {
        $('#blog-form > button[type=submit]').prop('disabled', true);
        $('#summernote').hide();

        var submittingForm = dataviva.ui.loading('#blog-form');
        submittingForm.text(dataviva.dictionary['loading'] + "...");

        $('#text-content-editor').summernote('destroy');

        $('#text-content-editor img').each(function() {
            if ($(this).parent().is('figure') == false)
               add_caption($(this));
        });

        var pt_html = $('#text-content-editor').html();
        $('#text_content').val(pt_html);
        if ($('#text-content-editor').summernote('isEmpty')) {
            $('#text_content').val('');
        }

        return true;
    });
});
