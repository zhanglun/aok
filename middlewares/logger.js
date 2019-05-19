module.exports = function () {
  return async (ctx, next) => {
    console.log('-->logger middleware!')

    await next()

    console.log('<-- logger end')
  }
}
