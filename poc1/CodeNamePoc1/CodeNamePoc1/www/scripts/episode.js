(function () {
	"use strict";
	var Episode = function () { };

	Codename.Episode = Episode;

	Episode.Add = function (episodeCode) {
		var episode = new Codename.Episode();
		episode.create(episodeCode);
		return episode;
	};

	Episode.prototype.create = function (episodeCode) {
		this.episodeCode = episodeCode;
		var self = this;
		this.episodePath = Codename.getDataDirectory() + this.episodeCode + "/";
		Codename.loadGameObject(this.episodePath, "ep.json", function (episode) {
			self.run(episode);
		});
	};

	Episode.prototype.run = function (episode) {
		if (episode) {
			var dialogEntry = "dialog1.json";
			this.addDialog(dialogEntry);
		}
	}

	Episode.prototype.addDialog = function (dialogName) {
		Codename.Dialog.Add(this, dialogName);
	}

}());