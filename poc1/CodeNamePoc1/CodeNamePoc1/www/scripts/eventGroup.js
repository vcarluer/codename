(function () {
    "use strict"

    var EventGroup = function () { };
    EventGroup.prototype = Object.create(Codename.Event);

    Codename.EventGroup = EventGroup;

    EventGroup.init = function () {
        this.events = [];
    };

}());