const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, logstash, colorize } = format;


const createCustomLogger = (configList) => {
    const loggerTransports = [];
    configList.transports.forEach(config => {
        if (config.location == 'console') {
            loggerTransports.push(new transports.Console({
                level: config.level
            }))
        } else if (config.location == 'file') {
            loggerTransports.push(new transports.File({
                level: config.level,
                filename: config.filename,
            }))
        } else {
            loggerTransports.push(new transports.Console({
                level: config.level
            }))
        }
    })
    const myFormat = printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${JSON.stringify(message)}`;
    });

    let formatOptions;
    if (!configList.logstash) {
        formatOptions = combine(
            colorize({
                colors: {
                    debug: 'gray',
                    info: 'blue',
                    warn: 'yellow',
                    error: 'red'
                }
            }),
            label({ label: configList.label }),
            timestamp(),
            myFormat
        )
    } else {
        formatOptions = combine(
            label({ label: configList.label }),
            timestamp(),
            myFormat,
            logstash()
        )
    }

    return createLogger({
        transports: loggerTransports,
        format: formatOptions
    })
}

module.exports = {
    createCustomLogger
}