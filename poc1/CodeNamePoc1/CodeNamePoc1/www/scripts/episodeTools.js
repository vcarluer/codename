(function () {
	"use strict";

	var EpisodeTools = function () { };

	Codename.EpisodeTools = EpisodeTools;

	EpisodeTools.Add = function (codename) {
		var tools = new EpisodeTools();
		tools.create(codename);
		return tools;
	};

	EpisodeTools.prototype.create = function (codename) {
		this.div = document.createElement("div");
		this.div.className = "tools";
		codename.addTools(this.div);

		var self = this;
		Codename.Tool.Add({
			text: "Dossier", onClick: function () {
				self.onClick();
			}
		}, this);

		Codename.Tool.Add({
			text: "Agenda", onClick: function () {
				self.onClick();
			}
		}, this);

		Codename.Tool.Add({
			text: "Contacts", onClick: function () {
				self.onClick();
			}
		}, this);

		Codename.Tool.Add({
			text: "Journal", onClick: function () {
				self.onClick();
			}
		}, this);

		Codename.Tool.Add({
			text: "Notes", onClick: function () {
				self.onClick();
			}
		}, this);
	};

	EpisodeTools.prototype.onClick = function (onClick) {
		Codename.Episode.Add("s01e01");
		this.hide();
	};

	EpisodeTools.prototype.show = function (codename) {
		this.div.style.display = "block";
	};

	EpisodeTools.prototype.hide = function (codename) {
		this.div.style.display = "none";
	};

	EpisodeTools.prototype.addTool = function (toolDiv) {
		this.div.appendChild(toolDiv);
	};

}());