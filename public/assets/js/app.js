$(document).ready(function () {
    var $winwidth = $(window).width();
    $("img.main-img").attr({
        width: $winwidth
    });
    $(window).bind("resize", function () {
        var $winwidth = $(window).width();
        $("img.main-img").attr({
            width: $winwidth
        });
    });

    //SCRAPES ARTICLES
    $(".scrape").click(function (event) {
        event.preventDefault();
        $.get("/api/fetch").then(function (data) {
            $(".articles").remove();
            $.get("/").then(function () {
                bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>", function (result) {
                    location.reload()
                });
            });
            //location.reload();
        });
    });

    //SAVES ARTICLE
    $(".save-article").click(function () {
        var articleToSave = {};
        articleToSave.id = $(this).data("id");
        articleToSave.saved = true;
        $.ajax({
            method: "PATCH",
            url: "/api/articles",
            data: articleToSave
        }).then(function (data) {
            location.reload();
        });
    });

    //REMOVES SAVED ARTICLE
    $(".removeSaved").click(function () {
        var articleToremoveSaved = {};
        articleToremoveSaved.id = $(this).data("id");
        articleToremoveSaved.saved = false;
        $.ajax({
            method: "PATCH",
            url: "/api/articles",
            data: articleToremoveSaved
        }).then(function (data) {
            location.reload();
        });
    });

    //SAVE BUTTON
    $('.saved-buttons').on('click', function () {
        //ARTICLE ID
        var thisId = $(this).attr("data-value");

        //ATTACHES ARTICLE _ID TO SAVE BUTTON
        $("#saveButton").attr({
            "data-value": thisId
        });

        //CALLS AJAX FOR THE NOTES ATTACHED TO ARTICLE
        $.get("/notes/" + thisId, function (data) {
            console.log(data);
            //EMPTY MODAL TITLE, BODY, AND NOTES
            $('#noteModalLabel').empty();
            $('#notesBody').empty();
            $('#notestext').val('');

            //ADD ID OF CURRENT ARTICLE TO MODAL LABEL
            $('#noteModalLabel').append(' ' + thisId);
            //ADD NOTES TO MODAL BODY - LOOPS THROUGH MULTIPLE NOTES
            for (var i = 0; i < data.note.length; i++) {
                var button = ' <a href=/deleteNote/' + data.note[i]._id + '><i class="pull-right fa fa-times fa-2x deletex" aria-hidden="true"></i></a>';
                $('#notesBody').append('<div class="panel panel-default"><div class="noteText panel-body">' + data.note[i].body + '  ' + button + '</div></div>');
            }
        });
    });

    //SAVE NOTE BUTTON
    $(".savenote").click(function () {
        //GRABS THE ID ASSOCIATES WTIH ARTICLE FROM SUBMIT BUTTON
        var thisId = $(this).attr("data-value");

        //POST REQUEST TO CHANGE NOTE
        $.ajax({
                method: "POST",
                url: "/notes/" + thisId,
                data: {
                    body: $("#notestext").val().trim()
                }
            })
            .done(function (data) {
                $('#noteModal').modal('hide');
            });
    });
});