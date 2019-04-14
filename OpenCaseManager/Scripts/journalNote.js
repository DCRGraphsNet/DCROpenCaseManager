﻿$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
        .exec(window.location.search);

    return (results !== null) ? results[1] || 0 : false;
}


function CreateJournalNoteView() {
    var id = $.urlParam("id");
    window.open("/JournalNote/Create" + (id ? "?id=" + id : ""), "", "width=800,height=600");
    //postwindow,dialog=yes,close=no,location=no,status=no,
}

$('#input-journal-note').trumbowyg();

function formatDate(date) {
    var value = new Date(date);
    console.log(value);
    return value.getDate() + "/" + (value.getMonth()+1) + "/" + value.getFullYear();
}

$(function () {
    $("#datepicker").datepicker();
    $("#datepicker").datepicker("option", "dateFormat", "dd/mm/yy");
    $("#datepicker").datepicker({ maxDate: "+0d" });

    var maxDate = $("#datepicker").datepicker("option", "maxDate");

    $("#datepicker").datepicker("option", "maxDate", "+0d");
});

$("#datepicker").on('change', function () {
    $("#change-date-label").removeClass("hideLabel");
});

$("#datepicker").attr('readonly', 'readonly');

/*$.datepicker.setDefaults($.datepicker.regional[""]);*/

$("#datepicker").datepicker({
    firstDay: 1
},
    $.datepicker.regional['dk']
);
/*
$("#datepicker").datepicker({
    gotoCurrent: true
});

$("#datepicker").datepicker({
    dayNames: ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"]
});

$(".selector").datepicker({
    dayNamesMin: ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"]
});

$(".selector").datepicker({
    monthNames: ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"]
});

$(".selector").datepicker({
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]
});
*/
function changedate(inputId, lableId) {
    var value = $('#' + inputId).val();
    var applyTo = $('#' + lableId)[0];
    applyTo.value = value;
    applyTo.textContent = value;
}

$(document).on('click', '.add-journal-note-button', function () {
    var documentName = $('#input-journal-title').val() + '.rtf';
    var journalText = $('#input-journal-note').val();

    // $('#dateLabel').textContent
    submitFiles(documentName, journalText);
});

function makeTextFile(text) {
    var data = new Blob([text], { type: 'text/rich' });
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

function closeJournalNotatWindow() {
    window.close()
}