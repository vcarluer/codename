(function () {
	var ChoiceButton = function () { };
	Codename.ChoiceButton = ChoiceButton;
	ChoiceButton.prototype = new Codename.TextBlock();

	ChoiceButton.Add = function (option) {
		var choiceButton = new ChoiceButton();
		choiceButton.init(Codename.instance, option.onClick);
		choiceButton.show(Codename.instance, option.delay, option.text);
		return choiceButton;
	};

	ChoiceButton.prototype.init = function (codename, onClick) {
		this.codename = codename;
		this.div = document.createElement("div");
		this.div.className = "choiceButton";
		this.p = document.createElement("p");
		this.p.className = "talktextp";
		this.div.appendChild(this.p);
		this.onClick = onClick;
		var self = this;
		this.div.onclick = function () {
			self.click();
		};
	};

	ChoiceButton.prototype.click = function () {
		this.onClick();
	};

	ChoiceButton.prototype.addElement = function (codename) {
		codename.addChoice(this.div);
	};

	ChoiceButton.prototype.remove = function () {
		this.codename.removeChoice(this.div);
	}
}());