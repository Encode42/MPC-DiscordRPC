const log = require('fancy-log');

log.info('INFO: Loading...');

const snekfetch = require('snekfetch'),
	{ Client } = require('discord-rpc'),
	updatePresence = require('./core'),
	events = require('events'),
	config = require('./config'),
	clientID = '697953483969658991';

let mediaEmitter = new events.EventEmitter(),
	active = false,
	discordRPCLoop,
	mpcServerLoop,
	rpc;

if (isNaN(config.port)) throw new Error('Port is empty or invalid! Please set a valid port number in \'config.js\' file.');

const uri = `http://localhost:${config.port}/variables.html`;
log.info('INFO: Ready!');

mediaEmitter.on('CONNECTED', res => {
	clearInterval(mpcServerLoop);
	mpcServerLoop = setInterval(checkMPCEndpoint, 5000);
	if (!active) log.info(`INFO: Connected to ${res.headers.server}`);
	active = updatePresence(res, rpc);
});

mediaEmitter.on('CONN_ERROR', code => {
	if (active) {
		updatePresence("destroy")
	} else log.error(`ERROR: Unable to connect to Media Player Classic on port ${config.port}. ` +
		`Make sure MPC is running, Web Interface is enabled and the port set in 'config.js' file is correct.\n` + code);
	if (mpcServerLoop._onTimeout !== checkMPCEndpoint) {
		clearInterval(mpcServerLoop);
		mpcServerLoop = setInterval(checkMPCEndpoint, 15000);
	}
});

mediaEmitter.on('discordConnected', () => {
	clearInterval(discordRPCLoop);
	log.info('INFO: Connected to Discord. Listening MPC on ' + uri);
	checkMPCEndpoint();
	mpcServerLoop = setInterval(checkMPCEndpoint, 15000);
});

mediaEmitter.on('discordDisconnected', () => {
	clearInterval(mpcServerLoop);
});

function checkMPCEndpoint() {
	snekfetch.get(uri)
		.then(res => mediaEmitter.emit('CONNECTED', res))
		.catch(err => mediaEmitter.emit('CONN_ERROR', err));
}

function initRPC(clientID) {
	rpc = new Client({ transport: 'ipc' });
	rpc.on('ready', () => {
		clearInterval(discordRPCLoop);
		mediaEmitter.emit('discordConnected');
		rpc.transport.once('close', async () => {
			await destroyRPC();
			log.error('ERROR: Connection to Discord client was closed. Trying again in 10 seconds...');
			mediaEmitter.emit('discordDisconnected');
			discordRPCLoop = setInterval(initRPC, 10000, clientID);
		});
	});

	rpc.login(clientID).catch(() => {
		log.warn('WARN: Connection to Discord has failed. Trying again in 10 seconds...');
	});
}

async function destroyRPC() {
	if (!rpc) return;
	await rpc.destroy();
	rpc = null;
}

initRPC(clientID);
discordRPCLoop = setInterval(initRPC, 10000, clientID);
