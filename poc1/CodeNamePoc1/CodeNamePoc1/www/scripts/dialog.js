(function () {
	"use strict";
	var Dialog = function () { };

	Codename.Dialog = Dialog;

	Dialog.Add = function (episodePath, dialogName) {
		var dialog = new Codename.Dialog();
		dialog.create(episodePath, dialogName);
	};

	Dialog.prototype.create = function (dialogPath, dialogName) {
		var self = this;
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
				var delay = 500 + line.t.split(" ").length * 500;
				totalDelay += delay;
				var right = line.p !== 0;
				Codename.TextBlock.Add({ text: line.t, delay: totalDelay, right: right });
				if (line.c) {
					this.addChoice(this.dialog[line.c]);
				}
			}
		} else {
			console.log("script does not exist");
		}		
	};

	Dialog.prototype.addChoice = function (choice) {
		if (choice) {
			for (var i = 0; i < choice.length; i++) {

			}
		} else {
			console.log("choice does not exist");
		}
		
	};

}());