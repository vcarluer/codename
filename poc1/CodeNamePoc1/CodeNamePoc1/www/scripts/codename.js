var Codename = function () { };

(function () {
	"use strict";

	Codename.prototype.run = function () {
		this.div = document.getElementById("codename");
		this.div.innerHTML = "Hello codename";
	};

}());