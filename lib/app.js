const assert = require('assert')
const delay = require('delay')
const path = require('path')
const Redis = require('ioredis')

module.exports = async spec => {
  if (spec.env) {
    assert.strictEqual(typeof spec.env, 'object', 'env')
  }
  assert.strictEqual(typeof spec.config, 'object', 'config')
  assert.strictEqual(typeof spec.config.name, 'string', 'name')
  assert.strictEqual(typeof spec.start, 'function', 'start')
  if (spec.end) {
    assert.strictEqual(typeof spec.end, 'function', 'end')
  }
  if (spec.loop) {
    assert.strictEqual(typeof spec.loop, 'function', 'loop')
  }
  if (spec.secret) {
    assert.strictEqual(typeof spec.secret, 'object', 'secret')
  }
  const app = {}
  app.config = spec.config
  const configPath = path.join(process.env.HOME, '.env.d', app.config.name)
  require('dotenv').config({
    path: configPath,
  })
  if (spec.env) {
  }
  if (spec.secret) {
  }
  app.logger = require('pino')(
    Object.assign({ name: app.config.name }, app.config.logger),
  )
  app.logger.info(
    { NODE_ENV: process.env.NODE_ENV, config: app.config },
    'start',
  )
  app.redis = new Redis(app.config.redis)
  app.end = async ({ message, err }) => {
    if (app.ending) {
      app.ending(app, { message, err })
    }
    app.redis.quit()
    if (err) {
      app.logger.error({ err }, message)
      process.exit(1)
    } else {
      app.logger.info({ message }, 'ended')
      process.exit(0)
    }
  }
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
}
