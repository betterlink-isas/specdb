import * as winston from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";
import * as chalk from "chalk";
const format = winston.format;
const { combine, timestamp } = format;

const fileFormat = combine(
    timestamp({
        format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.printf(({ level, message, timestamp }): string => {
        return `[${timestamp}] [${level.toUpperCase()}] [specdb]: ${message}`;
    })
);

export const logger = winston.createLogger({
    level: "debug",
    format: combine(
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        format.printf(({ level, message, timestamp }): string => {
            if (level == "error") {
                return chalk.white(`${chalk.white(timestamp)} ${chalk.bgRed(chalk.black(" ERR! "))} ${chalk.bgWhite(chalk.black(" SpecDB "))}: `) + chalk.redBright(message);
            } else if (level == "warn") {
                return chalk.white(`${chalk.white(timestamp)} ${chalk.bgYellow(chalk.black(" WARN "))} ${chalk.bgWhite(chalk.black(" SpecDB "))}: `) + chalk.yellow(message);
            } else if (level == "info") {
                return chalk.white(`${chalk.white(timestamp)} ${chalk.bgBlue(chalk.black(" INFO "))} ${chalk.bgWhite(chalk.black(" SpecDB "))}: ${message}`);
            } else {
                return chalk.white(`${chalk.white(timestamp)} ${chalk.bgGray(chalk.black(" DEBG "))} ${chalk.bgWhite(chalk.black(" SpecDB "))}: `) + chalk.gray(message);
            }
        })
    ),
    transports: [
        new DailyRotateFile({
            filename: "log/error-%DATE%.log",
            level: "warn",
            datePattern: "YYYY-MM-DD-HH",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
            format: fileFormat
        }),
        new DailyRotateFile({
            filename: "log/info-%DATE%.log",
            level: "info",
            datePattern: "YYYY-MM-DD-HH",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
            format: fileFormat
        }),
        new DailyRotateFile({
            filename: "log/debug-%DATE%.log",
            level: "debug",
            datePattern: "YYYY-MM-DD-HH",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
            format: fileFormat
        }),
        new winston.transports.Console({ level: "debug" })
    ],
});