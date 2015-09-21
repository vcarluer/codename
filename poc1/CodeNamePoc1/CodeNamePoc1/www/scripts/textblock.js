(function () {
	"use strict";

	// For todays date;
	Date.prototype.today = function () {
		return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + this.getFullYear();
	}

	// For the time now
	Date.prototype.timeNow = function () {
		return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
	}

	var TextBlock = function () { };

	Codename.TextBlock = TextBlock;

	TextBlock.Add = function (option) {
		var textblock = new TextBlock();
		textblock.init(Codename.instance, option.right);
		textblock.show(Codename.instance, option.delay, option.text);
	};

	TextBlock.prototype.init = function (codename, right) {
		this.div = document.createElement("div");
		this.div.className = "chatLine";
		this.divAvatar = document.createElement("div");
		this.divAvatar.className = "avatar";
		this.img = document.createElement("img");
		if (right) {
			this.img.src = "images/av1.png";
			this.divAvatar.className += " avatarRight";
		} else {
			this.img.src = "images/av2.png";
			this.divAvatar.className += " avatarLeft";
		}

		this.divAvatar.appendChild(this.img);
		this.div.appendChild(this.divAvatar);

		this.divBubble = document.createElement("div");
		this.divText = document.createElement("div");
		
		this.p = document.createElement("p");
		this.p.className = "talktextp";
		this.divText.appendChild(this.p);
		this.divBubble.appendChild(this.divText);

		this.div.appendChild(this.divBubble);
		if (right) {
			this.divBubble.className = "talk-bubble talk-right tri-right right-top";
			this.divText.className = "talktext talk-right";
		} else {
			this.divBubble.className = "talk-bubble tri-right left-top";
			this.divText.className = "talktext";
		}

		this.divTimestamp = document.createElement("div");
		this.divTimestamp.className = "talk-bubble";
		if (right) this.divTimestamp.className += " talk-right";
		this.divTimestamp.className += " chatTime";
		var currentdate = new Date(); 
		var datetime = currentdate.today() + " " + currentdate.timeNow();
		this.divTimestamp.innerHTML = datetime;
		this.div.appendChild(this.divTimestamp);
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