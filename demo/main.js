require('../lib/app')({
  secret: {
    password: 'PASSWORD',
  },
  env: {
    redis: {
      host: 'REDIS_HOST',
      port: 'REDIS_PORT',
    },
    logger: {
      level: 'LOG_LEVEL',
    },
  },
  config: {
    name: 'demo',
    redis: {
      host: 'localhost',
      port: 6379,
    },
    logger: {
      level: 'debug',
      prettyPrint: { colorize: true, translateTime: true },
    },
  },
  async start({ config, logger, redis }) {
    logger.info({ config }, 'start')
    return {
      ending: () => logger.info('ending'),
    }
  },
  async loop({ config, logger, redis }) {
    logger.info('loop')
    return {
      delay: 1000,
    }
  },
})
