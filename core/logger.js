const path = require('path')
const winston = require('winston')
const config = require('./config')

const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({
      filename: path.resolve(config.logger.path, 'error.log'),
      level: 'error'
    }),
    new winston.transports.File({ filename: path.resolve(config.logger.path, 'aa.log') })
  ]
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

module.exports = logger