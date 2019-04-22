﻿

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
        .exec(window.location.search);

    return (results !== null) ? results[1] || 0 : false;
}

$(function () {
    var inputJournalNote = $('#input-journal-note');
    if (inputJournalNote != null) {
        inputJournalNote.trumbowyg({
            tagsToRemove: ['Redo']
        });
    }
})

function formatDate(_date) {
    var value = new Date(_date);

    var day = value.getDate() < 10 ? '0' + value.getDate() : value.getDate();
    var month = value.getMonth + 1;
        month = value.getMonth() < 10 ? "0" + value.getMonth() : value.getMonth();
    var year = value.getFullYear();

    return day + "/" + month + "/" + year;
}

$(function () {
    $("#datepicker").datepicker();
    $("#datepicker").datepicker("option", "dateFormat", "dd/mm/yy");
    $("#datepicker").datepicker({ maxDate: "+0d" });
    var maxDate = $("#datepicker").datepicker("option", "maxDate");
    $("#datepicker").datepicker("option", "maxDate", "+0d");

    $("#datepicker").datepicker({ dayNames: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"] });
    var dayNames = $("#datepicker").datepicker("option", "dayNames");
    $("#datepicker").datepicker("option", "dayNames", ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"]);

    $("#datepicker").datepicker({ dayNamesMin: ["Sø", "Ma", "Ti", "On", "To", "Fr", "Lø"] });
    var dayNamesMin = $("#datepicker").datepicker("option", "dayNamesMin");
    $("#datepicker").datepicker("option", "dayNamesMin", ["Sø", "Ma", "Ti", "On", "To", "Fr", "Lø"]);

    $("#datepicker").datepicker({ monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"] });
    var monthNamesShort = $("#datepicker").datepicker("option", "dayNamesMin");
    $("#datepicker").datepicker("option", "monthNamesShort", ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]);

    $("#datepicker").datepicker({ monthNames: ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"] });
    var dayNamesMin = $("#datepicker").datepicker("option", "monthNames");
    $("#datepicker").datepicker("option", "monthNames", ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"]);

    $("#datepicker").datepicker({ gotoCurrent: true });
    var gotoCurrent = $("#datepicker").datepicker("option", "gotoCurrent");
    $("#datepicker").datepicker("option", "gotoCurrent", true);

    $("#datepicker").datepicker({ firstDay: 1 });
    var firstDay = $("#datepicker").datepicker("option", "firstDay");
    $("#datepicker").datepicker("option", "firstDay", 1);

    $("#datepicker").datepicker({ hideIfNoPrevNext: true });
    var hideIfNoPrevNext = $("#datepicker").datepicker("option", "hideIfNoPrevNext");
    $("#datepicker").datepicker("option", "hideIfNoPrevNext", true);

    $("#datepicker").datepicker({ nextText: "Næste" });
    var nextText = $("#datepicker").datepicker("option", "nextText");
    $("#datepicker").datepicker("option", "nextText", "Næste");

    $("#datepicker").datepicker({ prevText: "Forrige" });
    var prevText = $("#datepicker").datepicker("option", "nextText");
    $("#datepicker").datepicker("option", "prevText", "Forrige");

    $("#datepicker").val(formatDate(new Date().toString()));
});


$("#datepicker").attr('readonly', 'readonly');

/*$.datepicker.setDefaults($.datepicker.regional["da"]);*/

function changedate(inputId, lableId) {
    var value = $('#' + inputId).val();
    var applyTo = $('#' + lableId)[0];
    applyTo.value = value;
    applyTo.textContent = value;
}

$(document).on('click', '.add-journal-note-button', function () {
    var documentName = $('#input-journal-title').val();
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
    if (fileName != '') {
        $.ajax({
            url: window.location.origin + "/api/records/AddDocument",
            type: 'POST',
            headers: {
                'filename': fileName + '.rtf',
                'type': 'JournalNoteBig',
                'instanceId': instanceId,
                'givenFileName': fileName,
                'eventTime': $("#datepicker").val() + " " + $('input.timepicker').val()
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

function addMinutsToTime(currentTime, minutsToAdd) {
    var timeValues = currentTime.split(':');
    var h = parseInt(timeValues[0]);
    var m = parseInt(timeValues[1]) + minutsToAdd;

    if (m < 0) {
        h = h - 1
        m = m + 60;
    }
    h = h < 0 ? 23 : h; 

    var h = (h + Math.floor(m / 60)) % 24; 
    var m = m % 60; 

    var m = m < 10 ? '0' + m : m;

    return h + ':' + m;
}

function incrementTime() {
    var currentTime = $('input.timepicker').val()
    var newTime = addMinutsToTime(currentTime, 15);
    $('input.timepicker').val(newTime)
}

function decrementTime() {
    var currentTime = $('input.timepicker').val()
    var newTime = addMinutsToTime(currentTime, -15);
    $('input.timepicker').val(newTime);
}

$(document).ready(function () {
    var now = new Date();
    var latestQuarter = now.getMinutes() - (now.getMinutes() % 15);
    var defaultTime = now.getHours() + ':' + latestQuarter;

    $('input.timepicker').timepicker({
        timeFormat: 'HH:mm',
        defaultTime: defaultTime,
        interval: 30,
        minTime: '0000',
        maxTime: '2359',
        startTime: '06',
        dynamic: false,
        dropdown: true,
        scrollbar: true,
    });
});
