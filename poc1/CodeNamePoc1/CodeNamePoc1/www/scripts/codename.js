var Codename = function () { };

(function () {
	"use strict";

	Codename.Attach = function (codename) {
		Codename.instance = codename;
	};

	Codename.prototype.run = function () {
		Codename.Attach(this);
	
		this.div = document.getElementById("codename");
		/*this.divMenu = document.createElement("div");
		this.divMenu.className = "menu";
		this.div.appendChild(this.divMenu);*/
		this.chatDiv = document.createElement("div");
		this.chatDiv.className = "chat";
		this.div.appendChild(this.chatDiv);

		this.choiceDiv = document.createElement("div");
		this.choiceDiv.className = "choices";
		this.div.appendChild(this.choiceDiv);

		Codename.Episode.Add("s01e01");
	};

	Codename.loadGameObject = function (gameObjectPath, gameObjectRoot, onLoaded) {
		var gameObjectManifest = gameObjectPath + gameObjectRoot;
		Codename.ajax(gameObjectManifest, function (gameObject) {
			var keys = Object.keys(gameObject);
			var scriptSeparator = "script:";
			var codeSeparator = "code:";
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

	Codename.prototype.addChat = function (newDiv) {
		this.chatDiv.appendChild(newDiv);
	};
	Codename.prototype.addChoice = function (newDiv) {
		this.choiceDiv.appendChild(newDiv);		
	};

	Codename.prototype.removeChoice = function (div) {
		this.choiceDiv.removeChild(div);
	};

}());