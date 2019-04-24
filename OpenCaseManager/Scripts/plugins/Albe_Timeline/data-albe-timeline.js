function formatDateTimeline(date) {
    var value = new Date(date);
    return value.getFullYear() + "-" + value.getMonth() + "-" + value.getDate() ;
}

function documentType(data) {
    return {
        type: "Dokument",
        time: formatDateTimeline(data.EventDate),
        responsible: data.DocumentResponsible,
        body: [{
            tag: 'h3',
            content: data.DocumentTitle,
            attr: {
                cssclass: 'group-title'
            }
        },
        {
            tag: 'p',
            content: "Indsats: " + data.InstanceTitle
            }]
    }
}
// TODO -> Her skal der evt. v�re noget content tekst som er passer til den tekst de rer skrevet.
function journalNoteType(data) {
    console.log(data)
    return {
        type: "Journalnotat",
        time: formatDateTimeline(data.EventDate),
        responsible: data.DocumentResponsible,
        body: [{
            tag: 'h3',
            content: data.DocumentTitle,
            attr: {
                cssclass: 'group-title'
            }
        },
        {
            tag: 'p',
            content: "Tilføjet: " + formatDateTimeline(data.CreationDate),
        }]
    }
}
function activitiesType(data) {
    console.log(data)
    var eventtype = data.Type;
    if (data.Type === 'Event') eventtype = "Aktivitet";
    return {
        type: eventtype,
        time: formatDateTimeline(data.EventDate),
        responsible: data.EventResponsible,
        body: [{
            tag: 'h3',
            content: data.Title,
            attr: {
                cssclass: 'group-title'
            }
        },
            {
                tag: 'p',
                content: "Indsats: " + data.InstanceTitle
            }]
    }
}

$(document).ready(function () {
    async function getData(activity, journalnote, document) {
        console.log("aktivitet " + activity);
        var childId = App.getParameterByName("id", window.location.href);
        var data = await getTimelineData(childId);

        var normData = [];
        $.each(data, function (index, value) {   
            if (journalnote && (value.DocumentType === 'JournalNote' || value.Type === 'JournalNoteBig' || value.Type === 'JournalNoteLittle')) normData.push(journalNoteType(value));
            if (document && value.DocumentType === 'Instance') normData.push(documentType(value));
            if (activity && value.Type === 'Event') normData.push(activitiesType(value)); 
        });

        $('#myTimeline').albeTimeline(normData);
        $('#timeline-menu').trigger('change');
    }

    var activityChecked = true;
    var journalnoteChecked = true;
    var documentChecked = true;

    getData(activityChecked, journalnoteChecked, documentChecked);

    $(document).on('change', '.filterTypeWrapper', function () {
        activityChecked = $('#activityCheckbox').prop('checked');
        journalnoteChecked = $('#journalnoteCheckbox').prop('checked');
        documentChecked = $('#documentCheckbox').prop('checked');

        if (!activityChecked && !journalnoteChecked && !documentChecked) getData(true, true, true);
        else getData(activityChecked, journalnoteChecked, documentChecked);
    });
    
});

