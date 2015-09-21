(function () {
	var ChoiceButton = function () { };
	Codename.ChoiceButton = ChoiceButton;
	ChoiceButton.prototype = new Codename.TextBlock();

	ChoiceButton.Add = function (option) {
		var choiceButton = new ChoiceButton();
		choiceButton.init(Codename.instance);
		choiceButton.show(Codename.instance, option.delay, option.text);
	};

	ChoiceButton.prototype.init = function (codename) {
		this.div = document.createElement("div");
		this.div.className = "choiceButton";
		this.p = document.createElement("p");
		this.p.className = "talktextp";
		this.div.appendChild(this.p);

		var self = this;
		this.div.onclick = function () {
			self.click();
		};
	};

	ChoiceButton.prototype.click = function () {
		this.setText("clicked");
	};

	ChoiceButton.prototype.addElement = function (codename) {
		codename.addChoice(this.div);
	};
}());