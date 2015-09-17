var Codename = function () { };

(function () {
	"use strict";

	Codename.Attach = function (codename) {
		Codename.instance = codename;
	};

	Codename.prototype.run = function () {
		this.div = document.getElementById("codename");
		Codename.Attach(this);

		Codename.TextBlock.Add({ text: "Hello agent", delay: 1000 });
		Codename.TextBlock.Add({ text: "How are you?", delay: 2000 });
		Codename.TextBlock.Add({ text: "I'm fine thanks", delay: 4000, right: true });
	};

}());