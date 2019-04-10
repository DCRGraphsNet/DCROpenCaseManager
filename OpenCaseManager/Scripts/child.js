﻿$(document).ready(function () {
    var childId = App.getParameterByName("id", window.location.href);
    var query = {
        "type": "SELECT",
        "entity": "ChildInstances",
        "resultSet": ["*"],
        "filters": new Array(),
        "order": []
    }

    var whereChildIdMatchesFilter = {
        "column": "ChildId",
        "operator": "equal",
        "value": childId,
        "valueType": "int",
        "logicalOperator": "and"
    };
    query.filters.push(whereChildIdMatchesFilter);

    API.service('records', query)
        .done(function (response) {
            showChildInstances(response);
        })
        .fail(function (e) {
            reject(e);
        });
});

function showChildInstances(response) {
    var result = JSON.parse(response);
    var list = "";
    if (result.length === 0) {
        list = "<tr class='trStyleClass'><td colspan='100%'>" + translations.NoRecordFound + " </td></tr>";
    } else {
        for (i = 0; i < result.length; i++) {
            list += getChildInstanceHtml(result[i]);
        }
    }
    $("#childInstances").html("").append(list);
    setClosedInstancesToFaded();
}

function getChildInstanceHtml(item) {
    var open = (item.IsOpen) ? "" : "instanceClosed";
    var instanceLink = "../Instance?id=" + item.Id;
    var returnHtml = "<tr class='trStyleClass " + open + "'>";
    returnHtml += (item.IsOpen) ? "<td class='statusColumn'>" + getStatus(item.NextDeadline) + "</td>" : "<td class='statusColumn'>Lukket</td>";
    returnHtml += "<td><a href='" + instanceLink + "'>" + item.Title + "</a></td>";
    returnHtml += "<td>" + item.Process + "</td>";
    returnHtml += "<td>" + item.Name.substr(0, 1).toUpperCase() + item.Name.substr(1) + "</td>";
    if (item.LastUpdated != null) {
        returnHtml += "<td>" + item.LastUpdated.toString().substr(0, 10) + "</td>";
    } else {
        returnHtml += "<td> intet gjort</td>";
    }
    returnHtml += "</tr>";
    console.log(returnHtml);
    return returnHtml;
}

function getStatus(deadline) {
    if (deadline != null) {
        var now = new Date().getTime();
        deadline = new Date(deadline).getTime();
        if (now >= deadline) {
            return "<span class='dot dotRed'></span>";
        } else if (now + 604800000 >= deadline) {
            return "<span class='dot dotYellow'></span>";
        }
    }
    
    return "<span class='dot dotGreen'></span>";
}

function setClosedInstancesToFaded() {
    $('.instanceClosed').each(function () {
        $(this).find('td, a').css('color', 'lightgray');
    });
}
