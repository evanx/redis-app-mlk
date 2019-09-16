# redis-app-mlk

A basic Redis microservice application archetype with lifecycle support, using the stack:

- `dotenv` - env for config
- `pino` - logging
- `ioredis` - Redis client

This repo is namespaced in honour of MLK.

## Demo

See https://github.com/evanx/redis-app-mlk/blob/master/demo/main.js

```javascript
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
```

## Implementation

See https://github.com/evanx/redis-app-mlk/blob/master/lib/app.js

```javascript
process.on('unhandledRejection', (err, promise) =>
  app.end({ message: 'unhandledRejection', err }),
)
try {
  app.ending = await spec.start(app)
  if (spec.loop) {
    while (true) {
      const res = await spec.loop(app)
      if (res.delay) {
        await delay(res.delay)
      }
    }
  }
} catch (err) {
  app.end({ message: 'start', err })
}
```
