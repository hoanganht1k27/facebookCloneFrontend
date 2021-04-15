$(document).ready(function () {
    $('#create-post-show').click(function (e) { 
        e.preventDefault();
        $('#create-post-bg').show()
        $('.create-post-container').show()
    });
    
    $('#create-post-bg').click(function (e) { 
        e.preventDefault();
        $(this).hide()
        $('.create-post-container').hide()
    });

    
});