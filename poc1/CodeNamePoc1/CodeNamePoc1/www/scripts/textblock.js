(function () {
	"use strict";

	var TextBlock = function (codename) {
		this.init(codename);
	};

	Codename.TextBlock = TextBlock;

	TextBlock.Add = function (option) {
		var textblock = new TextBlock();
		textblock.init(Codename.instance, option.right);
		textblock.show(Codename.instance, option.delay, option.text);
	};

	TextBlock.prototype.init = function (codename, right) {
		this.div = document.createElement("div");
		if (right) {
			this.div.className = "textblockright";
		} else {
			this.div.className = "textblock";
		}
	};

	TextBlock.prototype.show = function (codename, delay, text) {
		var self = this;
		if (!delay) {
			this.directShow(codename, text);
		} else {
			setTimeout(function () {
				self.directShow(codename, text);
			}, delay);
		}
	};

	TextBlock.prototype.directShow = function (codename, text) {
		codename.div.appendChild(this.div);
		this.setText(text);
	};

	TextBlock.prototype.setText = function (text) {
		this.div.innerHTML = text;
	};

}());