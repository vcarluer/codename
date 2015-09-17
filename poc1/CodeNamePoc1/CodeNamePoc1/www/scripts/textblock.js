(function () {
	"use strict";

	var TextBlock = function (codename) {
		this.init(codename);
	};

	Codename.TextBlock = TextBlock;

	TextBlock.prototype.init = function (codename) {
		this.div = document.createElement("div");
		this.div.className = "textblock";
		codename.div.appendChild(this.div);
	};

	TextBlock.prototype.setText = function (text) {
		this.div.innerHTML = text;
	};

}());