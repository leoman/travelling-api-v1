import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'travelling-api' },
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/debug.log', level: 'debug' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ]
});

if (process.env.NODE_ENV === 'development') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

logger.debug = (data: any | string) => {
  let object;

  if (typeof data === 'string' || data instanceof String) {
    object = {
      message: data
    }
  } else {
    const { message, ...rest } = data
    object = {
      ...rest,
      message
    }
  }

  return logger.log({
    level: 'info',
    ...object,
  })
}

logger.log('info', 'Logger initiated')

export default logger