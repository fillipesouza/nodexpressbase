const Logger = require('../../src/utils/logger-utils');
const logging = (log) => {
    log.debug("Debug Test");
    log.info("Info Test");
    log.warn("Warn Test");
    log.error("Error Test");
}
describe("Logger", () => {

    it("should create logger and log colorized", () => {
        const configList = {
            transports: [{
                location: 'console',
                level: 'debug'
            }],
            label: 'Test'
        }
        const log = Logger.createCustomLogger(configList);
        logging(log);
    })
    it("should create logger with info level", () => {
            const configList = {
                transports: [{
                    location: 'console',
                    level: 'info'
                }],
                label: 'Test'
            }
            const log = Logger.createCustomLogger(configList);
            logging(log);
        }),
        it("should create logger with warn level", () => {
            const configList = {
                transports: [{
                    location: 'console',
                    level: 'warn'
                }],
                label: 'Test'
            }
            const log = Logger.createCustomLogger(configList);
            logging(log);
        })
    it("should create logger with error level", () => {
        const configList = {
            transports: [{
                location: 'console',
                level: 'error'
            }],
            label: 'Test'
        }
        const log = Logger.createCustomLogger(configList);
        logging(log);
    })
    it("should create logger with logstash", () => {
        const configList = {
            transports: [{
                location: 'console',
                level: 'error'
            }],
            label: 'Logstash Test',
            logstash: true
        }
        const log = Logger.createCustomLogger(configList);
        logging(log);
    })
    it("should create logger with logstash", () => {
        const configList = {
            transports: [{
                location: 'console',
                level: 'info'
            }],
            label: 'Logstash Test',
            logstash: true
        }
        const log = Logger.createCustomLogger(configList);
        log.info({ className: "log.test", value: "Logstash json" })
    })
})