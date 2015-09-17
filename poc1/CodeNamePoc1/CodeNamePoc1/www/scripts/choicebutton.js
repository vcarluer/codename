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
		Codename.TextBlock.prototype.init.call(this, codename, false);
		this.div.className = "choiceButton";
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