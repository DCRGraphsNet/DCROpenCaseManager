﻿$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
        .exec(window.location.search);

    return (results !== null) ? results[1] || 0 : false;
}



function CreateJournalNoteView() {
    var id = $.urlParam("id");
    window.open("/JournalNote/Create" + (id ? "?id=" + id : ""), "", "width=1200,height=1200");
}

$(function () {
    $("#datepicker").datepicker();
    $("#datepicker").datepicker("option", "dateFormat", "d/m/yy");
});

function changedate(inputId, lableId) {
    var value = $('#' + inputId).val();
    var applyTo = $('#' + lableId)[0];
    applyTo.value = value;
    applyTo.textContent = value;
}

$(document).on('click', '.add-journal-note-button', function () {
    var documentName = $('#input-journal-title').val() + '.txt';
    var journalText = $('#input-journal-note').val();

    // $('#dateLabel').textContent
    submitFiles(documentName, journalText);
});

function makeTextFile(text) {
    var data = new Blob([text], { type: 'text/plain' });
    return data;
};

function submitFiles(fileName, textContents) {
    var instanceId = $.urlParam("id");
    var file = makeTextFile(textContents);
    uploadFile(file, instanceId, fileName);

}

function uploadFile(file, instanceId, fileName) {
    console.log(file, instanceId, fileName)
    if (fileName != '') {
        $.ajax({
            url: window.location.origin + "/api/records/AddDocument",
            type: 'POST',
            headers: {
                'filename': fileName,
                'type': 'JournalNoteBig',
                'instanceId': instanceId,
                'givenFileName': fileName
            },
            data: file,
            async: false,
            cache: false,
            contentType: false,
            enctype: 'multipart/form-data',
            processData: false,

        }).done(function () {
            window.close()
        });
        
    }
}