(function () {
    "use strict"

    var Event = function () { };
    Codename.Event = Event;

    Event.prototype.create = function (episode, eventName) {
        var self = this;
        this.eventPath = episode.episodePath;
        this.episode = episode;
        Codename.loadGameObject(this.dialogPath, eventName, function (event) {
            self.event = event;
            event.event = self;
        });
    };

}());