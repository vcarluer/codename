define(["helper/utils"], function (util) {
    'use strict';

    var ctrls = {
        container :    util.$$("#desktop"),
        btnContacts :  util.$$("#dsk-contacts"),
        btnDocuments : util.$$("#dsk-documents"),
        btnAgenda :    util.$$("#dsk-agenda"),
        btnNews :      util.$$("#dsk-news"),
        clockDate :    util.$$("#dsk-clock-date"),
        clockTime :    util.$$("#dsk-clock-time")
    };

    return {
        init : function () {
            window.setInterval(function tick() {
                ctrls.clockDate.html(new Date().toLocaleDateString());
                ctrls.clockTime.html(new Date().toLocaleTimeString());
            }, 1000);
            return this;
        },
        show : function () {
            ctrls.container.show();
            return this;
        },
        hide : function () {
            ctrls.container.hide();
            return this;
        },
        openContacts : function (fn) {
            ctrls.btnContacts.on("click", fn);
            return this;
        },
        openDocuments : function (fn) {
            ctrls.btnDocuments.on("click", fn);
            return this;
        }
        /*,
        openAgenda : function (fn) {

        },
        openNews : function (fn) {

        }*/
    };

});
