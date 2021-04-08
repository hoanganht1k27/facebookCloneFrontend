$('#create-post-show').click(function (e) { 
    e.preventDefault();
    $('#create-post-bg').css('display', 'flex');
});

$('#create-post-bg').click(function (e) { 
    e.preventDefault();
    if($(e.target).hasClass('create-post-bg')) {
        $(this).css('display', 'none')
    }
});