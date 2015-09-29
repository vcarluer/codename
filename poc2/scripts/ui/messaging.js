define(['helper/utils'], function (util) {
    'use strict';

    var ctrls = {
        parent :       util.$$("#container"),
        container :    util.$$("#messaging"),
        header :       util.$$("#dsk-msg-header"),
        headerInfo :   util.$$("#dsk-msg-header-info"),
        backButton :   util.$$("#dsk-msg-header-back"),
        conversation : util.$$("#dsk-msg-conversation"),
        choices :      util.$$("#dsk-msg-choice")
    };

    var messages = {},
        answers = {},
        lastContactShown = "",
        waitingForAnAnswer = [],
        onSendAnswer,
        onNoAnswer,
        onNotifyParent,
        displayed = false;

    function scrollToBottom() {
        window.console.log("scrollToBottom");
        var container = ctrls.parent.els[0];
        ctrls.parent.animate("scrollTop", container.scrollHeight, "500");
    }

    function appendConversationBox(msg, fadeIn) {
        var cssBox = msg.isMine ? "is-mine" : "is-others";
        cssBox = fadeIn ? cssBox + " fade-in" : cssBox;

        var nodes = ctrls.conversation.append("<li class='conversation-box " + cssBox + "'><p>" + msg.text + "</p><time>" + msg.time + "</time></li>");

        if (fadeIn) {
            nodes.delay("addClass", ["in"], 10);
        }
        scrollToBottom();
    }

    function addAnswer(contactId, answer, callback) {
        ctrls.choices
            .append("<li class='conversation-box is-mine fade-in'><p>" + answer.text + "</p></li>")
            .on("click", function () {
                ctrls.choices.html("");
                answers[contactId] = [];
                appendConversationBox({
                    text : answer.text,
                    isMine : true,
                    time : new Date().toLocaleFormat()
                }, true);
                callback(contactId, answer);
            })
            .delay("addClass", ["in"], 300);
    }

    function displayConversationHistory(contactId) {
        ctrls.conversation.html("");
        if (messages[contactId]) {
            messages[contactId].forEach(function (msg) {
                appendConversationBox(msg);
            });
        } else {
            messages[contactId] = [];
        }
        if (answers[contactId]) {
            answers[contactId].forEach(function (answer) {
                addAnswer(contactId, answer, onSendAnswer);
            });
        } else {
            answers[contactId] = [];
        }
        scrollToBottom();
    }

    function displayAnswers(contactId) {
        ctrls.choices.html("");
        answers[contactId].forEach(function (answer) {
            addAnswer(contactId, answer, onSendAnswer);
        });
    }

    function removeFromAnswersList(contactId, msgId) {
        var waitIdx = waitingForAnAnswer.indexOf(msgId);
        if (waitIdx > -1) {
            waitingForAnAnswer.splice(waitIdx, 1);
        }
        var i = answers[contactId].length;
        while (i--) {
            if (answers[contactId][i].msgId === msgId) {
                answers[contactId].splice(i, 1);
            }
        }
    }

    return {
        init : function (data) {
            messages = data;
            return this;
        },
        show : function (contact) {
            if (contact && contact.id !== lastContactShown) {
                ctrls.headerInfo.html(contact.name);
                displayConversationHistory(contact.id);
                displayAnswers(contact.id);
                lastContactShown = contact.id;
            }
            displayed = true;
            ctrls.container.show();
            return this;
        },
        hide : function () {
            displayed = false;
            ctrls.container.hide();
            return this;
        },
        onBackButtonClick : function (fn) {
            ctrls.backButton.on("click", fn);
            return this;
        },
        onSendAnswer : function (fn) {
            onSendAnswer = function (contactId, answer) {
                var now = (new Date()).toLocaleFormat();
                messages[contactId].push({text: answer.text, isMine : true, time : now});
                if (answer.msgId) {
                    removeFromAnswersList(contactId, answer.msgId);
                }
                if (fn) {
                    fn(contactId, answer);
                }
            };
            return this;
        },
        onNoAnswer : function (fn) {
            onNoAnswer = function (contactId, noAnswer) {
                ctrls.choices.html("");
                removeFromAnswersList(contactId, noAnswer.msgId);
                if (fn) {
                    fn(contactId, noAnswer);
                }
            };
            return this;
        },
        onNotifyParent : function (fn) {
            onNotifyParent = function (contactId, msg) {
                if (fn) {
                    fn(contactId, msg);
                }
            };
            return this;
        },
        addMessage : function (contactId, msg) {
            var now = (new Date()).toLocaleFormat();

            msg.id = util.random();
            var idx = messages[contactId].push({text: msg.text, isMine : false, time : now});

            if (contactId === lastContactShown) {
                appendConversationBox(messages[contactId][idx - 1], displayed);
            }

            if (msg.answers) {
                waitingForAnAnswer.push(msg.id);
                msg.answers.forEach(function (answer) {
                    answer.msgId = msg.id;
                    if (answers[contactId]) {
                        answers[contactId].push(answer);
                    } else {
                        answers[contactId] = [answer];
                    }
                    if (contactId === lastContactShown) {
                        addAnswer(contactId, answer, onSendAnswer);
                    }
                }, this);
            }

            if (msg.noAnswer) {
                var delay = util.addDelay(new Date(0), msg.noAnswer.triggerDelay);
                msg.noAnswer.msgId = msg.id;

                setTimeout(function () {
                    var waitIdx = waitingForAnAnswer.indexOf(msg.id);
                    if (waitIdx > -1) {
                        onNoAnswer(contactId, msg.noAnswer);
                    }
                }, delay);
            }

            if (!displayed) {
                onNotifyParent(contactId, msg);
            }

            return this;
        },
        getDelay : function (contact, message) {
            return (message.text.length * contact.typingSpeed * 0.1) + "s";
        }
    };

});
