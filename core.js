const jsdom = require("jsdom");
const {
	addFileExtension,
	ignoreBrackets,
	ignoreFiletype,
	replaceUnderscore,
	showRemainingTime,
	replaceDots
} = require("./config");
const { JSDOM } = jsdom;

String.prototype.trimStr = function (length) {
	return this.length > length ? this.substring(0, length - 3) + "..." : this;
};

const playback = {
	"filename": "",
	"filenameOriginal": "",
	"position": "",
	"duration": "",
	"fileSize": "",
	"state": "",
	"prevState": "",
	"prevPosition": ""
};

const updatePresence = async (res, rpc) => {
	if (res === "clear") return rpc.clearActivity();

	const { document } = new JSDOM(res.body).window;
	if (!document.getElementById("filepath")) return;

	const filename = playback.filename = document.getElementById("filepath").textContent.split("\\").pop().trimStr(128);
	playback.state = document.getElementById("state").textContent;
	playback.duration = sanitizeTime(document.getElementById("durationstring").textContent);
	playback.position = sanitizeTime(document.getElementById("positionstring").textContent);

	if (replaceUnderscore) playback.filename = playback.filename.replace(/_/g, " ");
	if (ignoreBrackets) {
		playback.filename = playback.filename.replace(/ *\[[^\]]*\]/g, "").trimStr(128);
		if (playback.filename.substr(0, playback.filename.lastIndexOf(".")).length === 0) playback.filename = filename;
	}
	if (replaceDots) playback.filename = playback.filename.replace(/[.](?=.*[.])/g, " ");
	if (ignoreFiletype) playback.filename = playback.filename.substr(0, playback.filename.lastIndexOf("."));
	if (addFileExtension) playback.filename = `${playback.filename} (${filename.split('.').pop(-1).toUpperCase()})`;

	const payload = {
		"state": `${playback.duration} total`,
		"startTimestamp": undefined,
		"endTimestamp": undefined,
		"details": playback.filename
	};

	switch (playback.state) {
		case "-1": rpc.clearActivity(); break;
		case "1": payload.state = `${playback.position} / ${playback.duration} ⏸`; break;
		case "2":
			if (showRemainingTime) payload.endTimestamp = Date.now() + (convert(playback.duration) - convert(playback.position));
			else payload.startTimestamp = Date.now() - convert(playback.position); break;
		default: payload.state = `${playback.duration} total ■`;
	}

	if ((playback.state !== playback.prevState) || (
		playback.state === "2" &&
        convert(playback.position) !== convert(playback.prevPosition) + 5000
	)) rpc.setActivity(payload).catch((err) => {});

	playback.prevState = playback.state;
	playback.prevPosition = playback.position;
	return true;
};

const convert = time => {
	const parts = time.split(":");
	const seconds = parseInt(parts[parts.length - 1]);
	const minutes = parseInt(parts[parts.length - 2]);
	const hours = (parts.length > 2) ? parseInt(parts[0]) : 0;
	return ((hours * 60 * 60) + (minutes * 60) + seconds) * 1000;
};

const sanitizeTime = time => {
	if (time.split(":")[0] === "00") return time.substr(3, time.length - 1);
	return time;
};

module.exports = updatePresence;