﻿function addDocument() {
    dropArea = document.getElementById("drop-area");
    uploadFiles = new Array();


    console.log("addDocument.js called");
    initializeForm();
    $('#addNewDocumentModal').modal('toggle');
    isAdd = true;
    $('#documentName').focus();
    $('.instanceModalHeading').text(translations.AddDocument);
    $('#addDocument').text(translations.Add);
}

