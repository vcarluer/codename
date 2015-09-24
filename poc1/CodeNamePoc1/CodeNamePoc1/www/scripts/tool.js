(function () {
	"use strict";

	var Tool = function () { };
	Codename.Tool = Tool;

	Tool.Add = function (options, tools) {
		var tool = new Tool();
		tool.create(options);
		tool.show(tools);
		return tool;
	};

	Tool.prototype.create = function (options) {
		this.div = document.createElement("div");
		this.div.className = "tool";
		this.div.innerHTML = options.text;
		this.div.onclick = options.onClick;
	};

	Tool.prototype.show = function (tools) {
		tools.addTool(this.div);
	};

}());