var Codename = function () { };

(function () {
	"use strict";

	Codename.Attach = function (codename) {
		Codename.instance = codename;
	};

	Codename.prototype.run = function () {
		Codename.Attach(this);
	
		this.div = document.getElementById("codename");
		
		// CHAT
		this.divChatTool = document.createElement("div");
		this.div.appendChild(this.divChatTool);

		/*this.divMenu = document.createElement("div");
		this.divMenu.className = "menu";
		this.div.appendChild(this.divMenu);*/

		this.chatDiv = document.createElement("div");
		this.chatDiv.className = "chat";
		this.divChatTool.appendChild(this.chatDiv);

		this.choiceDiv = document.createElement("div");
		this.choiceDiv.className = "choices";
		this.divChatTool.appendChild(this.choiceDiv);

		// TOOLS
		Codename.EpisodeTools.Add(this);

		// Codename.Episode.Add("s01e01");
	};

	var scriptSeparator = "script:";
	var codeSeparator = "code:";

	Codename.loadGameObject = function (gameObjectPath, gameObjectRoot, onLoaded) {
		var gameObjectManifest = gameObjectPath + gameObjectRoot;
		Codename.ajax(gameObjectManifest, function (gameObject) {
			var keys = Object.keys(gameObject);
			
			var ready = keys.length;
			var idx, val, i, script, scriptName, methodName, code;

			for (i = 0; i < keys.length; i++) {
				val = gameObject[keys[i]];
				if (val.indexOf) { // is string
					idx = val.indexOf(scriptSeparator);
					if (idx > -1) { // Load an external js script
						script = val.substr(scriptSeparator.length);
						scriptName = keys[i];
						Codename.ajax(gameObjectPath + script, function (func) {
							gameObject[scriptName] = new Function(func);
							ready--;
							Codename.testReady(ready, gameObject, onLoaded);
						})
					} else {
						idx = val.indexOf(codeSeparator);
						if (idx > -1) { // load an inline js code
							code = val.substr(codeSeparator.length);
							methodName = keys[i];
							gameObject[methodName] = new Function(code);
						}

						ready--;
					}
				} else {
					ready--;
				}

				Codename.testReady(ready, gameObject, onLoaded);
			}
		}, true);
	};

	Codename.executeFunction = function (gameObjectPath, gameObject) {
	    var idx;
	    var val = gameObject.f;
	    idx = val.indexOf(scriptSeparator);
	    if (idx > -1) { // Load an external js script
	        var script = val.substr(scriptSeparator.length);
	        Codename.ajax(gameObjectPath + script, function (func) {
	            gameObject.f = new Function(func);
	            gameObject.f();
	        })
	    } else {
	        idx = val.indexOf(codeSeparator);
	        if (idx > -1) { // load an inline js code
	            var code = val.substr(codeSeparator.length);
	            gameObject.f = new Function(code);
	            gameObject.f();
	        }
	    }
    }


	Codename.testReady = function (ready, gameObject, onLoaded) {
		if (ready === 0 && gameObject.onReady) {
			gameObject.onReady();
		}

		if (ready === 0 && onLoaded) {
			onLoaded(gameObject);
		}
	}

	Codename.ajax = function (url, callback, json) {
		console.log("AJAX - loading " + url);
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var response = xhr.responseText;
				var result = response;
				if (json) {
					result = JSON.parse(response);
				}

				callback(result);
			}
		};

		xhr.open("GET", url);
		xhr.send();

	};

	Codename.isRipple = function () {
	    return (typeof window.parent.ripple !== "undefined");
	};

	Codename.getDataDirectory = function () {
	    var path;
	    if (!Codename.isRipple()) {
	        path = cordova.file.applicationDirectory + "www/data/"
	    } else {
	        path = /data/;
	    }

	    return path;
	};

	Codename.prototype.addChat = function (newDiv) {
		this.chatDiv.appendChild(newDiv);
	};
	Codename.prototype.addChoice = function (newDiv) {
		this.choiceDiv.appendChild(newDiv);		
	};

	Codename.prototype.removeChoice = function (div) {
		this.choiceDiv.removeChild(div);
	};

	Codename.prototype.addTools = function (toolsDiv) {
		this.divTools = toolsDiv;
		this.div.appendChild(this.divTools);
	};

}());