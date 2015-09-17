(function () {
	"use strict";

	var TextBlock = function () { };

	Codename.TextBlock = TextBlock;

	TextBlock.Add = function (option) {
		var textblock = new TextBlock();
		textblock.init(Codename.instance, option.right);
		textblock.show(Codename.instance, option.delay, option.text);
	};

	TextBlock.prototype.init = function (codename, right) {
		this.div = document.createElement("div");
		this.divText = document.createElement("div");
		
		this.p = document.createElement("p");
		this.p.className = "talktextp";
		this.divText.appendChild(this.p);
		this.div.appendChild(this.divText);
		if (right) {
			this.div.className = "talk-bubble talk-right tri-right round border btm-right-in";
			this.divText.className = "talktext talk-right";
		} else {
			this.div.className = "talk-bubble tri-right round border btm-left-in";
			this.divText.className = "talktext";
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
		this.setText(text);
		this.addElement(codename);
	};

	TextBlock.prototype.addElement = function (codename) {
		codename.addChat(this.div);
	};

	TextBlock.prototype.setText = function (text) {
		this.p.innerHTML = text;
	};

	TextBlock.prototype.setNext = function (next) {
		this.next = next;
	};

}());