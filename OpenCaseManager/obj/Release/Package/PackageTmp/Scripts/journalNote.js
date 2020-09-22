﻿var alreadyDrafted;
var documentId;
var documentText;
var documentTitle;
var documentEventDate;
var documentEventTime;
var timer = $.now() - 1000;
var numberOfChanges = 0;
var intervalPause = false;
var isAlreadyDraftWhenOpened;

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
        .exec(window.location.search);

    return (results !== null) ? results[1] || 0 : false;
}

function getDocumentByLinkQuery(documentLink) {
    var query = {
        "type": "SELECT",
        "entity": "DocumentTimes",
        "filters": [
            {
                "column": "Type",
                "operator": "equal",
                "value": "JournalNoteBig",
                "valueType": "string",
                "logicalOperator": "and"
            }
        ],
        "resultSet": ["Id", "Title", "EventDate", "IsDraft"],
        "order": [{ "column": "Id", "descending": false }]
    }

    query.filters.push({
        "column": "Link",
        "operator": "equal",
        "value": documentLink,
        "valueType": "string"

    });
    return query;
}

function CreateJournalNoteView() {
    var id = $.urlParam("id");
    var newWindow = window.open("/JournalNote/Create" + (id ? "?id=" + id : ""), "", "width=800,height=600");
    newWindow.alreadyDrafted = false;
    newWindow.isAlreadyDraftWhenOpened = true;
}

function CreateJournalNoteViewWithLink() {
    var id = $.urlParam("instanceId");
    var documentLink = $('#documentLink').val();
    documentText = $(".content").html();
    var query = getDocumentByLinkQuery(documentLink);
    API.service('records', query)
        .done(function (response) {
            var documentInfo = $.parseJSON(response)[0];
            documentId = documentInfo.Id;
            var newWindow = window.open("/JournalNote/Create" + (id ? "?id=" + id : "") + (documentId ? "&documentId=" + documentId : ""), "", "width=800,height=600");
            newWindow.documentId = documentId;
            newWindow.alreadyDrafted = true;
            newWindow.documentText = documentText;
            newWindow.documentTitle = documentInfo.Title;
            newWindow.isAlreadyDraftWhenOpened = documentInfo.IsDraft;

            var splitTime = documentInfo.EventDate.split("T");
            var regex = /(\d\d:\d\d)/gm;
            var match = regex.exec(splitTime[1]);
            newWindow.documentEventTime = match[1];
            newWindow.documentEventDate = splitTime[0];
        });
}

$(function () {
    if (!isAlreadyDraftWhenOpened) $('.change-journal-note-button').html('Opdater');
    $("#input-journal-title").val(documentTitle);
    $(".ui-datepicker").val(documentEventDate);
    $(".timepicker").val(documentEventTime);

    $('#input-journal-title').on('input', function () {
        numberOfChanges++;
    });
    var inputJournalNote = $('#input-journal-note');
    if (inputJournalNote != null) {

        inputJournalNote.trumbowyg();
        inputJournalNote.trumbowyg({
            tagsToRemove: ['Redo']
        });
        inputJournalNote.trumbowyg('html', documentText);
        inputJournalNote.trumbowyg().on('tbwchange', function () {
            numberOfChanges++;
        });
    }
})

function automaticSaveDraft() {
    if ($.now() - timer > 2000 && numberOfChanges >= 10) {
        saveFile(isAlreadyDraftWhenOpened, false, null);
        new Noty({
            type: 'alert',
            theme: 'mint',
            layout: 'topRight',
            text: "Kladde gemt",
            timeout: 2000,
            progressBar: false,
            container: '.custom-container2'
        }).show()
        timer = $.now();
        numberOfChanges = 0;
    }
    else if ($.now() - timer > 10000 && numberOfChanges > 0) {
        saveFile();
        new Noty({
            type: 'alert',
            theme: 'mint',
            layout: 'topRight',
            text: "Kladde gemt",
            timeout: 2000,
            progressBar: false,
            container: '.custom-container2'
        }).show()
        timer = $.now();
        numberOfChanges = 0;
    }
}

function formatDate(_date) {
    var value = new Date(_date);

    var day = value.getDate() < 10 ? '0' + value.getDate() : value.getDate();
    var month = value.getMonth + 1;
    month = (value.getMonth() + 1) < 10 ? "0" + (value.getMonth() + 1) : (value.getMonth() + 1);
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

$(document).on('click', '.add-journal-note-button', function (event) {
    var id = $.urlParam("id");
    var eventId = $.urlParam("eventId");
    var documentName = $('#input-journal-title').val();
    var journalText = "<div>" + $('#input-journal-note').html() + "</div>";
    //saveJournalInAcadre(id, documentName, journalText, true);
    //saveFile(false, true, event);
    alert("Saving of journalnotes currently disabled");
    event.preventDefault();
});

$(document).on('click', '.cancel-journal-note-button', function (event) {
    closeWindow(event);
});

function closeWindow(event) {
    window.close();
    event.preventDefault();
}

function makeTextFile(text) {
    var data = new Blob([text], { type: 'text/html' });
    return data;
};

function submitFiles(fileName, textContents, isDraft, closeWindow) {
    var instanceId = $.urlParam("id");
    var file = makeTextFile(textContents);
    uploadFile(file, instanceId, fileName, isDraft, closeWindow);

}

function uploadFile(file, instanceId, fileName, isDraft, closeWindow) {
    if (fileName == "") { fileName = "NA" };
    var eventDateTime = $(".ui-datepicker").val() + " " + $(".timepicker").val();

    if (fileName != '') {
        intervalPause = true;
        $.ajax({
            url: window.location.origin + "/api/records/AddDocument",
            type: 'POST',
            headers: {
                'filename': fileName + '.html',
                'type': 'JournalNoteBig',
                'instanceId': instanceId,
                'givenFileName': fileName,
                'eventTime': eventDateTime,
                'isDraft': isDraft
            },
            data: file,
            async: true,
            cache: false,
            contentType: false,
            enctype: 'multipart/form-data',
            processData: false,
            success: function (data, textStatus, request) {
                documentId = request.responseText;
                var myRegexp = /(\d+)/gm;
                var match = myRegexp.exec(documentId);
                documentId = match[1];
            },
            complete: function () {
                intervalPause = false;
                if (closeWindow) {
                    window.close();
                }
            },

        });
    }
}

function addMinutsToTime(currentTime, minutsToAdd) {
    var timeValues = currentTime.split(':');
    var h = parseInt(timeValues[0]);
    var m = parseInt(timeValues[1]) + minutsToAdd;

    while (m < 0) {
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

$(document).on('click', '.change-journal-note-button', function (event) {
    saveFile(isAlreadyDraftWhenOpened, false, event);
    var notyText = "Journalnotat opdateret";
    if (isAlreadyDraftWhenOpened) notyText = "Kladde gemt";
    new Noty({
        type: 'success',
        theme: 'mint',
        layout: 'topRight',
        text: notyText,
        timeout: 2000,
        progressBar: false,
        container: '.custom-container'
    }).show()
});

function saveFile(isDraft, closeWindow, event) {
    if (event != null) event.preventDefault();
    var documentName = $('#input-journal-title').val();
    var journalText = "<div>" + $('#input-journal-note').html() + "</div>";

    if (!alreadyDrafted) {
        submitFiles(documentName, journalText, isDraft, closeWindow);
        alreadyDrafted = true;
    }
    else {
        updateFiles(documentName, journalText, isDraft, closeWindow);
    }
}

function updateFiles(fileName, textContents, isDraft, closeWindow) {
    if (fileName == "") { fileName = "NA" };
    var instanceId = $.urlParam("id");
    var file = makeTextFile(textContents);

    var eventDateTime = $(".ui-datepicker").val() + " " + $(".timepicker").val();

    if (fileName != '') {
        intervalPause = true;
        $.ajax({
            url: window.location.origin + "/api/records/UpdateDocument",
            type: 'POST',
            headers: {
                'id': documentId,
                'filename': fileName + '.html',
                'type': 'JournalNoteBig',
                'instanceId': instanceId,
                'givenFileName': fileName,
                'isNewFileAdded': 'True',
                'eventTime': eventDateTime,
                'isDraft': isDraft
            },
            data: file,
            async: true,
            cache: false,
            contentType: false,
            enctype: 'multipart/form-data',
            processData: false,
            complete: function () {
                intervalPause = false;
                if (closeWindow) {
                    window.close();
                }
            },

        });
    }
}

// save journal in acadre
function saveJournalInAcadre(id, title, description, isLocked) {
    try {
        var data = {
            accessCode: 'BO',
            caseFileReferenceNumber: id,
            fileName: 'testfile.rtf',
            memoTitleText: title,
            memoTypeReference: "2",
            isLocked: isLocked,
            noteText: description,
            date: new Date(moment($('#datepicker').val() + ' ' + $('.timepicker').val() + ':00', 'DD/MM/YYYY HH:mm:ssZ')),
            html: 'html', // can be html
            eventId: App.getParameterByName('eventId'),
            type: App.getParameterByName('type'),
            instanceId: $.urlParam('instanceId') === false ? App.getParameterByName('id') : App.getParameterByName('instanceId')
        }

        var eventId = App.getParameterByName("eventId");
        var instanceId = App.getParameterByName("instanceId");
        var modified = App.getParameterByName("modified");

        if (eventId !== null && eventId !== "") {

            var promise = new Promise(function (resolve, reject) {
                var comment = "<div>" + $('#input-journal-note').html() + "</div>";
                Task.saveTasksNote(eventId, data.instanceId, comment, true, resolve, reject);
            });
            promise.then(function (response) {
                executeTasksWNoteFull(eventId, data.instanceId, modified);
            }, function (e) {
                App.showExceptionErrorMessage(e);
            });
        } else {
            API.service('services/CreateJournalAcadre', data)
                .done(function (response, data) {
                    closeWindowWithoutAsking = null;
                    window.close();
                })
                .fail(function (e) {
                    App.showErrorMessage(e.responseJSON.ExceptionMessage);
                });
        }
    }
    catch (e) {
        alert('Exception');
    }
}

async function executeTasksWNoteFull(eventId, instanceId, modified) {
    // Check event is current - begin
    var query = {
        "type": "SELECT",
        "entity": "[InstanceEvents]",
        "resultSet": ["NextDelay", "NextDeadline", "Modified", "NeedToSetTime", "TrueEventId", "EventTitle", "GraphId", "SimulationId", "EventId"],
        "filters": new Array(),
        "order": []
    }

    var whereInstanceIdMatchesFilter = {
        "column": "instanceId",
        "operator": "equal",
        "value": instanceId,
        "valueType": "int",
        "logicalOperator": "and"
    };
    query.filters.push(whereInstanceIdMatchesFilter);

    var whereEventIdMatchesFilter = {
        "column": "eventId",
        "operator": "equal",
        "value": eventId,
        "valueType": "string",
        "logicalOperator": "and"
    };
    query.filters.push(whereEventIdMatchesFilter);
    modified = modified.replace('t', 'T');
    var whereModifiedMatchesFilter = {
        "column": "Modified",
        "operator": "equal",
        "value": modified,
        "valueType": "datetime"
    };
    query.filters.push(whereModifiedMatchesFilter);

    var result1 = await API.service('records', query);
    var EventOK = JSON.parse(result1);
    if (EventOK.length == 0) {
        App.showWarningMessage('Page not current - press F5 to refresh');
        return;
    }
    if (EventOK[0].NeedToSetTime == 1) {
        var setTimeData = {
            "instanceId": instanceId,
            "time": new Date().toUTCString()
        }

        var responseSetTime = await API.service('services/settime', setTimeData);

        App.showWarningMessage('Page not current - press F5 to refresh - time');
        return;
    }
    // Check event is current - end
    var data = {
        taskId: EventOK[0].EventId,
        instanceId: instanceId,
        graphId: EventOK[0].GraphId,
        simulationId: EventOK[0].SimulationId,
        eventId: EventOK[0].EventId,
        title: EventOK[0].EventTitle,
        trueEventId: EventOK[0].TrueEventId,
        Modified: modified
    };
    App.executeEvent(data, false, null, null, "tasksWNoteFull");
}

function saveJournalInAcadreTest() {
    var data = {
        accessCode: 'BO',
        caseFileReferenceNumber: 727191,
        fileName: 'testfile.rtf',
        memoTitleText: "title",
        memoTypeReference: "2",
        isLocked: false,
        noteText: "this is a note",
        html: 'html' // can be html
    }

    API.service('services/CreateJournalAcadre', data)
        .done(function (response) {
        })
        .fail(function (e) {
            App.showErrorMessage(e.responseJSON.ExceptionMessage);
        });
}