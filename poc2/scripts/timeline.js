define(['helper/utils'], function (util) {
    'use strict';

    var startTime = null,
        triggeringInterval = 1000,
        events = [],
        eventsData = {},
        msgData = {},
        gameVars = {
            msg : "ooo"
        };

    var onReceiveMessage,
        onReceiveDocument;

    function getResult(str) {
        try {
            var Fn = Function, res = (new Fn('game', str))(gameVars);
            return res;
        } catch (e) {
            throw "getResult";
        }
    }

    function addEvent(evt, delay) {
        evt.startAt = util.addDelay(new Date(), delay);
        events.push(evt);
    }

    function triggerEvent(evt) {
        evt.played = true;
        var requirementsOK = evt.require ? getResult(evt.require) : true;

        if (!requirementsOK) { return; }
        if (evt.fn) {
            getResult(evt.fn);
        }
        if (evt.message) {
            onReceiveMessage(
                evt.message.contactId,
                msgData[evt.message.messageId]
            );
        }
        if (evt.docId) {
            onReceiveDocument(evt.docId);
        }
        if (evt.triggers) {
            addEvent(
                eventsData[evt.triggers],
                evt.triggerDelay || 0
            );
        }
    }

    function triggerEvents() {
        var i = events.length - 1;
        while (i >= 0) {
            if (events[i].played) {
                events.splice(i, 1);
            }
            i--;
        }

        var currTime = (new Date()).getTime();
        events.forEach(function (evt) {
            if (evt.startAt < currTime && !evt.played) {
                triggerEvent(evt);
            }
        });
    }

    return {
        init : function (data) {
            eventsData = data.events;
            msgData = data.messages;
            return this;
        },
        start : function () {
            if (!startTime) { // premier lancement de la timeline
                if (eventsData.firstEvents) {
                    eventsData.firstEvents.forEach(function (event) {
                        addEvent(eventsData[event]);
                    });
                }
                startTime = new Date();
            } else { // on reprend l'exécution de la timeline...
                // recherche et exécution rapide des événements qui ont déjà eu lieu...
            }

            window.setInterval(function tick() {
                triggerEvents();
            }, triggeringInterval);

            return this;
        },
        onReceiveMessage : function (fn) {
            onReceiveMessage = fn;
            return this;
        },
        onReceiveDocument : function (fn) {
            onReceiveDocument = fn;
            return this;
        },
        addEvent : function (evt, delay) {
            addEvent(evt, delay);
        }
    };
});
