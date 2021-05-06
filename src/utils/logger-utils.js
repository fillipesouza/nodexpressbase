const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, logstash } = format;


const createCustomLogger = (configList) => {
    const loggerTransports = [];
    for (let config in configList.transports) {
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
    }
    const myFormat = printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
    });

    return createLogger({
        loggerTransports,
        format: combine(
            label(configList.label),
            timestamp(),
            logstash(),
            myFormat
        ),
    })
}

module.exports = {
    createCustomLogger
}