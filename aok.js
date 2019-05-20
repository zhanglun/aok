const path = require('path')
const Koa = require('koa')
const koaStatic = require('koa-static')
const koaBody = require('koa-body')
const koaSession = require('koa-session')
const koaCompress = require('koa-compress')
const koaConditional = require('koa-conditional-get')
const koaEtag = require('koa-etag')
const koaNunjucks = require('koa-nunjucks-2')
const koaError = require('koa-error')

const config = require('./core/config')
const cluster = require('./core/cluster')
const logger = require('./core/logger')

const LoggerMiddleware = require('./middlewares/logger')
// const ErrorMiddleware = require('./middlewares/error')

class Aok extends Koa {
  constructor () {
    super()

    this.config = config
    this.listener = null

    this.init(config)
  }

  init () {
    const { config } = this

    this.keys = [ config.keys ]

    this.use(LoggerMiddleware())
    this.use(koaCompress({ threshold: 2048 }))
    this.use(koaConditional())
    this.use(koaEtag())
    this.use(koaBody({
      multipart: config.upload.multipart,
      formidable: {
        uploadDir: config.upload.path,
        keepExtensions: config.upload.keepExtensions,
        maxFileSize: config.upload.maxFileSize
      }
    }))
    this.use(koaError({
      engine: 'nunjucks',
      template: __dirname + '/templates/error.njk'
    }))
    this.use(koaSession({ ...config.session }, this))

    if (config.views.extension === 'nunjucks') {
      this.use(koaNunjucks({
        ext: 'njk',
        path: config.views.path,
        nunjucksConfig: {
          trimBlocks: true
        }
      }))
    } else {
      this.use(koaViews(config.views.path, {
        extension: config.views.extension,
      }))
    }

    this.use(koaStatic(config.staticPath || path.resolve(process.cwd(), 'public')))

    this.on('error', (error) => {
      logger.error('Error', error)
    })
  }

  registerRoute (routers) {
    routers.forEach((router) => this.use(router.routes()))
  }

  start (cb) {
    this.listener = this.listen(config.port, cb)
  }

  startWithWorker (cb) {
    cluster(() => {
      this.start(cb)
    })
  }

  close () {
    this.listener.close()
  }
}

module.exports = Aok
