require.config({
    paths : { text : 'lib/text', json : 'lib/json'}
});
requirejs([
  "helper/utils", "data/loader", "timeline", 
  "ui/desktop", "ui/contacts", "ui/messaging", "ui/documents"], 
function(util, data, timeline, desktop, contacts, messaging, documents) {
'use strict';
    
    var ctrls = {
        container :           util.$$("#container"),
        loader :              util.$$("#loader"),
        title :               util.$$("#title"),
        //fingerprint :         util.$$("#fingerprint"),
        auth :                util.$$("#btn-authentication"),
        notification :        util.$$("#app-notification"),
        notificationText :    util.$$("#app-notification-text"),
        notificationAction :  util.$$("#app-notification-action"),
        apps :                util.$$(".app")
    };
    
    function notify(text, actionText, actionFn) {
        ctrls.notificationText
            .html(text);
        ctrls.notificationAction
            .html(actionText)
            .on("click", function() {
                actionFn();
                ctrls.notification
                  .addClass("out")
                  .delay("hide", null, 500);
            });            
        ctrls.notification
            .show()
            .removeClass("out")
            .delay("addClass", ["out"], 3000)
            .delay("hide", [], 3500);
    }
    
    function launch(dataLoaded) {
        var pressTimer;
        /*ctrls.fingerprint
          .on("mouseup", function() {
              ctrls.fingerprint.removeClass("is-pressed");
              clearTimeout(pressTimer);
          })
          .on("mousedown", function() {
              ctrls.fingerprint.addClass("is-pressed");
              pressTimer = setTimeout(function() {
                ctrls.title.hide();
                desktop.show();
                timeline.start();
              },500)
              return false; 
          });*/
        ctrls.auth.on("click", function() {
            ctrls.title.hide();
            desktop.show();
            timeline.start();
        });

      /// timeline initialization          
        timeline
            .onReceiveMessage(function (contactId, msg) {
                 messaging.addMessage(contactId, msg);
            })
            .onReceiveDocument(function (docId) {
                documents.addDocument(docId);
            })
            .init(dataLoaded);

            
      /// desktop initialization
        desktop
            .openContacts(function() {
                ctrls.apps.hide();
                contacts.show();
            })
            .openDocuments(function() {
                ctrls.apps.hide();
                documents.show(); 
            })
            //.openAgenda()
            //.openNews()
            .init();
        
      /// messaging initialization        
        messaging
            .onBackButtonClick(function() {
                messaging.hide();
                contacts.show();
            })
            .onSendAnswer(function (contactId, answer) {
                if(answer.next) {
                    var delay = messaging.getDelay(
                        dataLoaded.contacts[contactId], 
                        dataLoaded.messages[answer.next]
                    );
                    timeline.addEvent({
                        message : {
                            contactId : contactId,
                            messageId : answer.next
                        }
                    }, delay);
                }
                if(answer.doc || answer.fn || answer.triggers) {
                    timeline.addEvent({
                        fn : answer.fn,
                        triggers : answer.triggers,
                        docId : answer.doc
                    }, answer.triggerDelay);
                }             
            })
            .onNoAnswer(function (contactId, noAnswer) {
                if(noAnswer.fn) {
                    timeline.addEvent({
                        fn : noAnswer.fn
                    }, noAnswer.triggerDelay);
                }
                if(noAnswer.triggers) {
                    timeline.addEvent({
                        triggers : noAnswer.triggers
                    }, noAnswer.triggerDelay);
                }            
            })
            .onNotifyParent(function (contactId) {
                var contact = contacts.getContact(contactId);
                notify(
                     "New message from " + contact.name, 
                     "Afficher", 
                     function() {
                        ctrls.apps.hide();
                        messaging.show(contact);
                    });
            })
            .init(dataLoaded.messagesHistory);
            
      /// contacts initialization
        contacts
            .onBackButtonClick(function () {
                contacts.hide();
                desktop.show();
            })
            .onSelectContact(function (contact) {
                contacts.hide();
                messaging.show(contact);
            })
            .init(dataLoaded.contacts);


      /// documents initialization
        documents
            .onBackButtonClick(function () {
                documents.hide();
                desktop.show();
            })
            .onNotifyParent(function (docId, title) {
                notify(
                    "New document : " + title, 
                    "Afficher", 
                    function() {
                        ctrls.apps.hide();
                        documents.show(docId);
                    });
            })
            .init(dataLoaded.documents);
    }

      /// data loading
    util.$$().ready(function() {
        data.load(function (d) {
          ctrls.container.style("height", window.innerHeight + "px");
          launch(d);
          ctrls.loader.hide();
        });
    });
    
});
