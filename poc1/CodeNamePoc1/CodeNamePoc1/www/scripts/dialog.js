(function () {
	"use strict";
	var speed = 500; //500 or 10

	var Dialog = function () {
		this.choices = [];
	};

	Codename.Dialog = Dialog;

	Dialog.Add = function (episode, dialogName) {
		var dialog = new Codename.Dialog();
		dialog.create(episode, dialogName);
		return dialog;
	};

	Dialog.prototype.create = function (episode, dialogName) {
		var self = this;
		var dialogPath = episode.episodePath;
		this.episode = episode;
		Codename.loadGameObject(dialogPath, dialogName, function (dialog) {
			self.dialog = dialog;
			self.run();
		});
	};

	Dialog.prototype.run = function () {
	    if (this.dialog) {
	        if (this.dialog.initialScript) {    
	            this.addScript(this.dialog.initialScript);
	        } else {
	            if (this.dialog.initialChoices) {
	                this.addChoice(this.dialog.initialChoices, 0);
	            } else {
	                console.log("No initial state for dialog");
	            }
	        }
		}
	}

	Dialog.prototype.addScript = function (script) {
		if (script) {
		    this.readLine(script, 0);
		} else {
			console.log("script does not exist");
		}		
	};

	Dialog.prototype.readLine = function (script, i) {
	    if (script && i < script.length) {
	        var self = this;
	        var line = script[i];
	        if (line.p === 0 && line.b) {
	            var buttonText = line.b;
	            this.addChoiceButton({
	                t: buttonText, f: function () {
	                    Codename.TextBlock.Add({
	                        text: line.t, delay: 0, right: false, callback: function () {
	                            i++;
	                            if (i < script.length) {
	                                self.readLine(script, i);
	                            }
	                        }
	                    });
	                }
	            });
	        } else { // Other text line
	            var delay = 0;
	            var right = line.p !== 0;
	            if (right) {
	                delay = speed + line.t.split(" ").length * speed;
	            }
	            Codename.TextBlock.Add({
	                text: line.t, delay: delay, right: right, callback: function () {
	                    i++;
	                    if (i < script.length) {
	                        self.readLine(script, i);
	                    }
	                }
	            });

	            if (line.c) {
	                this.addChoice(this.dialog[line.c],delay);
	            }
	        }
	    } else {
	        console.log("script does not exist");
	    }
	};

	Dialog.prototype.addChoice = function (choice, delay) {
		if (choice) {
			var c, i;
			var choices = choice.choices;
			for (i = 0; i < choices.length; i++) {
				c = choices[i];
				this.addChoiceButton(c, delay);
			}
		} else {
			console.log("choice does not exist");
		}
		
	};

	Dialog.prototype.addChoiceButton = function (choice, delay) {
		var self = this;
		var choiceScript, choiceDialog;
		if (!choice.f) {
		    if (choice.s.indexOf(".json") > -1) {
		        choiceDialog = choice.s;
		    } else {
		        choiceScript = this.dialog[choice.s];
		    }
		}

		var button = Codename.ChoiceButton.Add({
			text: choice.t,
			delay: delay,
			onClick: function () {
			    self.clearButtons();
			    if (choice.f) {
			        choice.f();
			    } else {
			        if (choiceScript) {
			            self.addScript(choiceScript);
			        } else {
			            self.episode.addDialog(choiceDialog);
			        }
			    }
			}
		});

		this.choices.push(button);
	};

	Dialog.prototype.clearButtons = function () {
		for (var i = 0; i < this.choices.length; i++) {
			this.choices[i].remove();
		}

		this.choices = [];
	};

}());