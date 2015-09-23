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
		if (this.dialog && this.dialog.script) {
			this.addScript(this.dialog.script);
		}
	}

	Dialog.prototype.addScript = function (script) {
		if (script) {
			var totalDelay = 0;
			for (var i = 0; i < script.length; i++) {
				var line = script[i];
				var delay = speed + line.t.split(" ").length * speed;
				totalDelay += delay;
				var right = line.p !== 0;
				Codename.TextBlock.Add({ text: line.t, delay: totalDelay, right: right });
				if (line.c) {
					this.addChoice(this.dialog[line.c], totalDelay);
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
		if (choice.s.indexOf(".json") > -1) {
			choiceDialog = choice.s;
		} else {
			choiceScript = this.dialog[choice.s];
		}
		 
		var button = Codename.ChoiceButton.Add({
			text: choice.t,
			delay: delay,
			onClick: function () {
				if (choiceScript) {
					self.addScript(choiceScript);
				} else {
					self.episode.addDialog(choiceDialog);
				}
				
				self.clearButtons();
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