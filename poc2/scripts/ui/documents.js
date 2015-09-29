define(['../helper/utils'], function (util) {
    'use strict';

    var ctrls = {
        container :   util.$$("#documents"),
        header :      util.$$("#dsk-doc-header"),
        headerInfo :  util.$$("#dsk-doc-header-info"),
        backButton :  util.$$("#dsk-doc-header-back"),
        documents :   util.$$("#dsk-doc-list"),
        document :    util.$$("#dsk-doc-document")
    };
    var docs = {},
        onNotifyParent,
        displayed = false;

    function showDocument(docId) {
        var doc = docs[docId];
        ctrls.headerInfo.html(doc.title);
        ctrls.documents.hide();
        ctrls.document
            .html(doc.content)
            .show();
    }

    function createDocumentList() {
        var strList = Object.keys(docs).map(function (key) {
            var doc = docs[key];
            doc.id = key;
            return doc;
        }).sort(function (a, b) {
            return (a.title > b.title);
        }).map(function (doc) {
            return "<li class='doc-box' data-id='" + doc.id + "' " +  (doc.isKnown ? "" : "style='display:none;'")  + "><p>" + doc.title + "</p></li>";
        }).join('');

        ctrls.documents
            .appendHTML(strList)
            .each(function (doc) {
                util.$$(doc).on("click", function () {
                    var docId = this.getAttribute("data-id");
                    showDocument(docId);
                });
            });
    }

    return {
        init : function (data) {
            docs = data;
            createDocumentList();
            return this;
        },
        show : function (docId) {
            ctrls.container.show();
            displayed = true;
            if (docId) {
                showDocument(docId);
            } else {
                ctrls.headerInfo.html("");
                ctrls.document.hide();
                ctrls.documents.show();
            }
            return this;
        },
        hide : function () {
            ctrls.container.hide();
            displayed = false;
            return this;
        },
        onBackButtonClick : function (fn) {
            ctrls.backButton.on("click", fn);
            return this;
        },
        onNotifyParent : function (fn) {
            onNotifyParent = function (documentId, title) {
                if (fn) {
                    fn(documentId, title);
                }
            };
            return this;
        },
        addDocument : function (documentId) {
            docs[documentId].isKnown = true;
            util.$$("[data-id='" + documentId + "']", ctrls.documents.els[0]).show();
            onNotifyParent(documentId, docs[documentId].title);
            return this;
        },
        getDocument : function (documentId) {
            return docs[documentId];
        }
    };

});
