const log = require("fancy-log");

log.info("INFO: Loading...");

const snekfetch = require("snekfetch");
const { Client } = require("discord-rpc");
const updatePresence = require("./core");
const events = require("events");
const config = require("./config");
const clientID = "697953483969658991";

const mediaEmitter = new events.EventEmitter();
let active = false;
let discordRPCLoop;
let mpcServerLoop;
let rpc;

if (isNaN(config.port)) throw new Error("Port is empty or invalid! Please set a valid port number in 'config.js' file.");

const uri = `http://localhost:${config.port}/variables.html`;
log.info("INFO: Ready!");

mediaEmitter.on("CONNECTED", res => {
	clearInterval(mpcServerLoop);
	mpcServerLoop = setInterval(checkMPCEndpoint, 5000);
	if (!active) log.info(`INFO: Connected to ${res.headers.server}`);
	active = updatePresence(res, rpc);
});

mediaEmitter.on("CONN_ERROR", code => {
	updatePresence("clear", rpc);
	if (mpcServerLoop._onTimeout !== checkMPCEndpoint) {
		clearInterval(mpcServerLoop);
		mpcServerLoop = setInterval(checkMPCEndpoint, 15000);
	}
});

mediaEmitter.on("discordConnected", () => {
	clearInterval(discordRPCLoop);
	log.info("INFO: Connected to Discord. Listening MPC on " + uri);
	checkMPCEndpoint();
	mpcServerLoop = setInterval(checkMPCEndpoint, 15000);
});

mediaEmitter.on("discordDisconnected", () => clearInterval(mpcServerLoop));

function checkMPCEndpoint() {
	snekfetch.get(uri)
		.then(res => mediaEmitter.emit("CONNECTED", res))
		.catch(err => mediaEmitter.emit("CONN_ERROR", err));
}

function initRPC(clientID) {
	rpc = new Client({ "transport": "ipc" });
	rpc.on("ready", () => {
		clearInterval(discordRPCLoop);
		mediaEmitter.emit("discordConnected");
		rpc.transport.once("close", async () => {
			await destroyRPC();
			mediaEmitter.emit("discordDisconnected");
			discordRPCLoop = setInterval(initRPC, 10000, clientID);
		});
	});

	rpc.login(clientID).catch(() => {});
}

async function destroyRPC() {
	if (!rpc) return;
	await rpc.destroy();
	rpc = null;
}

initRPC(clientID);
discordRPCLoop = setInterval(initRPC, 10000, clientID);