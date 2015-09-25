(function () {
	"use strict";
	var speed = 50; //500 or 10
	var delayRatio = 3; // 1

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
		this.dialogPath = episode.episodePath;
		this.episode = episode;
		Codename.loadGameObject(this.dialogPath, dialogName, function (dialog) {
		    self.dialog = dialog;
		    dialog.dialog = self;
			self.run();
		});
	};

	Dialog.prototype.run = function () {
	    if (this.dialog) {
	        if (this.dialog.root) {    
	            this.addScript(this.dialog.root);
	        } else {
	            console.log("No initial state for dialog");
	        }
	    }
	};

	Dialog.prototype.addScriptByName = function (scriptName) {
	    var script = this.dialog[scriptName];
	    if (script) {
	        this.addScript(script);
	    } else {
	        console.log("bad script name: " + scriptName);
	    }
	};

	Dialog.prototype.addScript = function (script) {
	    if (script) {
	        var self = this;
	        
	        this.clearButtons();
	        if (this.pendingScript)
	            clearTimeout(this.pendingScript);

	        self.readLine(script, 0);
		} else {
			console.log("script does not exist");
		}		
	};

	Dialog.prototype.readLine = function (script, i) {
	    if (script && i < script.length) {
	        var self = this;
	        var line = script[i];
	        line.dialog = this;
	        var readNext = true;

	        this.continueScript = function () {
	            self.readLine(script, i + 1);
	        };

	        if (line.b)
	            this.readButton(line);
	        else if (line.s)
	            this.readScript(line);
	        else if (line.d)
	            this.readDop(line);
	        else if (line.t) {
	            this.readAgent(line);
	            readNext = false;
	        }
	        else if (line.f)
	            this.readFunction(line);

	        if (readNext)
	            this.continueScript();
	    } else {
            if (!script)
                console.log("script does not exist");
            else if (i >= script.length)
                console.log("end if script");
	    }
	};
	 
    Dialog.prototype.readDop = function (line) {
        this.readText(line.d);
    };

    Dialog.prototype.readAgent = function (line) {
        var delay = speed + line.t.split(" ").length * speed;
        this.readText(line.t, delay, true);
    };

    Dialog.prototype.readText = function (text, delay, right) {
        var self = this;
        Codename.TextBlock.Add({
            text: text, delay: delay / delayRatio, right: right, callback: function () {
                self.continueScript();
            }
        });
    };

    Dialog.prototype.readFunction = function (line) {
	    if (line.f) {
	        Codename.executeFunction(this.dialogPath, line);
	    }
	};

    Dialog.prototype.readScript = function (line) {
        var script, dialog, delay = 0, self = this;
        if (line.s) {
            if (line.w)
                delay = line.w;

            if (this.pendingScript)
                clearTimeout(this.pendingScript);

            this.pendingScript = setTimeout(function () {
                if (line.s.indexOf(".json") > -1) {
                    dialog = line.s;
                    self.episode.addDialog(dialog);
                } else {
                    script = self.dialog[line.s];
                    self.addScript(script);
                }
            }, delay / delayRatio);
        }
    };

	Dialog.prototype.readButton = function (line) {
		var self = this;
		
		var button = Codename.ChoiceButton.Add({
			text: line.b,
			onClick: function () {
			    if (line.f) {
			        self.readFunction(line);
			    }
                
			    if (line.d)
			        self.readDop(line);
			    else if (line.s)
			        self.readScript(line);

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