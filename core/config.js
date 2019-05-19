const fs = require('fs')
const path = require('path')

const loadConfig = (env) => {
  const filepath = path.resolve(process.cwd(), 'configs', `config.${ env }.js`)

  return fs.existsSync(filepath) ? require(filepath) : {}
}

module.exports = (() => {
  const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'production'
  const defaultConfig = loadConfig('default')
  const envConfig = loadConfig(env)

  const config = Object.assign({ env }, defaultConfig, envConfig)

  config.root = process.cwd()

  if (!config.logger) {
    config.logger = {
      path: path.resolve(config.root, 'logs')
    }
  }

  if (!config.views) {
    config.views = {
      extension: 'nunjucks',
      path: path.join(process.cwd(), 'views'),
    }
  }

  if (!config.upload) {
    config.upload = {
      multipart: true,
      path: path.join(process.cwd(), 'public/uploads/'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024
    }
  }

  return config
})()