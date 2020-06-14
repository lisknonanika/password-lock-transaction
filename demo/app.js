const { Application } = require("lisk-sdk");
const { genesisBlockDevnet, configDevnet } = require("./config");
const { PasswordLockSendTransaction,
		PasswordLockReceiveTransaction,
		PasswordLockCancelTransaction } = require("../src");

const app = new Application(genesisBlockDevnet, configDevnet);
app.registerTransaction(PasswordLockSendTransaction);
app.registerTransaction(PasswordLockReceiveTransaction);
app.registerTransaction(PasswordLockCancelTransaction);

app
	.run()
	.then(() => app.logger.info("App started..."))
	.catch(error => {
		console.error("Faced error in application", error);
		process.exit(1);
	});