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

    warn (b: string, ...any: string[]) {
        try {
            let t = new Date();
            console.log(`[${chalk.yellow(`${t.getHours()}:${t.getMinutes()}:${t.getSeconds()}`)}] [${chalk.bold(this.context)}] [${chalk.bold(config.version)}] [${b.charAt(0)}]`, ...any, eval(b));
        } catch (er) {
            console.log(er);
        }
    }
}