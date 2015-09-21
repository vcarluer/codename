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

		var base = 1000; // nb de mots ?
		Codename.TextBlock.Add({ text: "Hello agent Cross", delay: base });
		Codename.TextBlock.Add({ text: "How are you?", delay: base * 2 });
		Codename.TextBlock.Add({ text: "Quite fine", delay: base * 4, right: true });
		Codename.TextBlock.Add({ text: "Got a question for you", delay: base * 6, right: true });
		Codename.TextBlock.Add({ text: "Yesterday a strange man talked to me. He wanted to know your name, I was shocked!", delay: base * 12, right: true });
		Codename.TextBlock.Add({ text: "I manage to find his address, do you want me to 'talk' to him?", delay: base * 15, right: true });
		Codename.ChoiceButton.Add({ text: "Tell me", delay: base * 6.5 });
		Codename.ChoiceButton.Add({ text: "Listen to me", delay: base * 6.5 });

		//Codename.TextBlock.Add({ text: "Dummy", delay: base * 7, right: true });
		//Codename.TextBlock.Add({ text: "Dummy", delay: base * 8, right: true });
		//Codename.TextBlock.Add({ text: "Dummy", delay: base * 9, right: true });
		//Codename.TextBlock.Add({ text: "Dummy", delay: base * 10, right: true });
		//Codename.TextBlock.Add({ text: "Dummy", delay: base * 11, right: true });
		//Codename.TextBlock.Add({ text: "Dummy", delay: base * 12, right: true });
		//Codename.TextBlock.Add({ text: "Dummy", delay: base * 13, right: true });
		//Codename.TextBlock.Add({ text: "Dummy", delay: base * 14, right: true });
		//Codename.TextBlock.Add({ text: "Dummy", delay: base * 15, right: true });
		//Codename.TextBlock.Add({ text: "Dummy", delay: base * 16, right: true });
	};

	Codename.prototype.addChat = function (newDiv) {
		this.chatDiv.appendChild(newDiv);
	};
	Codename.prototype.addChoice = function (newDiv) {
		this.choiceDiv.appendChild(newDiv);
	};

}());