define(['../helper/utils'], function (util) {
    'use strict';

    var ctrls = {
        container :  util.$$("#contacts"),
        header :     util.$$("#dsk-cnt-header"),
        backButton : util.$$("#dsk-cnt-header-back"),
        contacts :   util.$$("#dsk-cnt-list")
    };

    var contacts = {},
        onSelectContact;

    function createContactList() {

        var strList = Object.keys(contacts).map(function (key) {
            var ct = contacts[key];
            ct.id = key;
            return ct;
        }).sort(function (a, b) {
            return (a.name > b.name);
        }).map(function (contact) {
            return "<li class='contact-box' data-id='" + contact.id + "' " +  (contact.isKnown ? "" : "style='display:none;'")  + "><p>" + contact.name + "</p></li>";
        }).join('');

        ctrls.contacts
            .appendHTML(strList)
            .each(function (contact) {
                util.$$(contact).on("click", onSelectContact);
            });
    }

    return {
        init : function (data) {
            contacts = data;
            createContactList();
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
        onBackButtonClick : function (fn) {
            ctrls.backButton.on("click", fn);
            return this;
        },
        onSelectContact : function (fn) {
            onSelectContact = function () {
                var contactId = this.getAttribute("data-id");
                if (contactId) {
                    fn(contacts[contactId]);
                }
            };
            return this;
        },
        addContact : function (contactId) {
            contacts[contactId].isKnown = true;
            util.$$("[data-id='" + contactId + "']", ctrls.contacts.els[0]).show();
            return this;
        },
        getContact : function (contactId) {
            return contacts[contactId];
        }
    };

});
