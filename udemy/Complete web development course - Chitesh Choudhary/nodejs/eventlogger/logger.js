import * as fs from "node:fs";
import * as os from "node:os";
import { EventEmitter } from "node:events";

class Logger extends EventEmitter {
    log(message) {
        this.emit("message", message);
    }
}

const logger = new Logger();
const logFilePath = "./eventlog.txt";

const logToFile = (event) => {
    const logMessage = `${new Date().toISOString()} - ${event}\n`;
    fs.appendFileSync(logFilePath, logMessage);
};

logger.on("message", logToFile);

setInterval(() => {
    const memoryUsage = (os.freemem() / os.totalmem()) * 100;
    logger.log(`Current memory usage: ${memoryUsage.toFixed(2)}%`);
}, 3000);

logger.log("Application started");
