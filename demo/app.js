const { Application, genesisBlockDevnet, configDevnet } = require("lisk-sdk");
const { PasswordLockTransactions, PasswordLockTransactionsConfig } = require("../src");
const { PasswordLockSendTransaction } = PasswordLockTransactions;

const app = new Application(genesisBlockDevnet, configDevnet);
app.registerTransaction(PasswordLockSendTransaction);

app
	.run()
	.then(() => app.logger.info("App started..."))
	.catch(error => {
		console.error("Faced error in application", error);
		process.exit(1);
	});