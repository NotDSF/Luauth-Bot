import chalk from "chalk"
let config = require("../../config.json");

export class Logger {
    context: string;
    constructor (context: string) {
        this.context = context
    }

    log (...any: string[]) {
        let t = new Date();
        console.log(`[${chalk.green(`${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`)}] [${chalk.bold(this.context)}] [${chalk.bold(config.version)}]`, ...any);
    }

    error (...any: string[]) {
        let t = new Date();
        console.log(`[${chalk.red(`${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`)}] [${chalk.bold(this.context)}] [${chalk.bold(config.version)}]`, ...any);
    }
}