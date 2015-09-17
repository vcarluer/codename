var Codename = function () { };

(function () {
	"use strict";

	Codename.prototype.run = function () {
		this.div = document.getElementById("codename");
		var firstText = new Codename.TextBlock(this);
		firstText.setText("Hello agent");
	};

}());